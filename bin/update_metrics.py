#!/usr/bin/env python3
"""
Daily metrics collector for giacomofrisoni.github.io
====================================================

Run by .github/workflows/update-metrics.yml once a day (and on demand).
Every source is optional: if one fails (e.g. Google Scholar rate-limits the
GitHub runner), the previous values for that source are kept and the others
are still updated. The script never deletes history.

Sources
-------
* Google Scholar profile (HTML, or SerpAPI if SERPAPI_KEY is set):
  total citations, h-index, i10-index, citations per year, citations per paper.
  Per-paper deltas between two runs become "scholar" events in the feed
  ("paper X gained +2 citations today").
* DBLP (XML of my author page): publisher / ACL Anthology links for each
  .bib entry; DBLP records missing from papers.bib (arXiv excluded) are
  appended to it automatically (disable with --no-import-bib).
* AMS Laurea (EPrints search on correlatore = Giacomo Frisoni): number and
  list of co-supervised theses, split into Bachelor's and Master's.

Outputs (all committed by the workflow)
---------------------------------------
* assets/data/metrics.json        latest snapshot of every source
* assets/data/history.json        one row per day (for the time-series plots)
* assets/data/citation_feed.json  newest-first list of citation events
* _data/metrics.yml               small summary readable from Liquid
* _data/citations.yml             al-folio Scholar badge data (al_citations)
"""

from __future__ import annotations

import argparse
import datetime as dt
import html
import json
import os
import re
import sys
import time
import unicodedata
from pathlib import Path
from urllib.parse import urlencode, urljoin

import requests
import yaml
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "assets" / "data"
SOCIALS = ROOT / "_data" / "socials.yml"
BIB = ROOT / "_bibliography" / "papers.bib"

TODAY = dt.date.today().isoformat()
UA = (
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/126.0 Safari/537.36"
)
FEED_MAX = 400

AMS_BASE = "https://amslaurea.unibo.it"
AMS_SUPERVISOR = "Giacomo Frisoni"


# ----------------------------------------------------------------------------
# helpers
# ----------------------------------------------------------------------------
def log(msg: str) -> None:
    print(f"[metrics] {msg}", flush=True)


def norm_title(t: str) -> str:
    t = unicodedata.normalize("NFKD", html.unescape(t or "")).encode("ascii", "ignore").decode()
    t = re.sub(r"[{}\\$]", "", t.lower())
    return re.sub(r"[^a-z0-9]+", " ", t).strip()


def load_json(path: Path, default):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return default


def dump_json(path: Path, obj) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(obj, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")


def get(url: str, *, params=None, timeout=30, tries=3, headers=None) -> requests.Response:
    h = {"User-Agent": UA, "Accept-Language": "en-US,en;q=0.8"}
    if headers:
        h.update(headers)
    last = None
    for i in range(tries):
        try:
            r = requests.get(url, params=params, headers=h, timeout=timeout)
            if r.status_code == 200:
                return r
            last = RuntimeError(f"HTTP {r.status_code} for {r.url}")
            if r.status_code in (403, 429):
                break  # blocked: retrying only makes it worse
        except requests.RequestException as e:
            last = e
        time.sleep(2 * (i + 1))
    raise last  # type: ignore[misc]


def socials() -> dict:
    return yaml.safe_load(SOCIALS.read_text(encoding="utf-8")) or {}


def bib_entries() -> list[dict]:
    """Very small BibTeX reader: key, type, title, year (enough for matching)."""
    text = BIB.read_text(encoding="utf-8")
    out = []
    for m in re.finditer(r"@(\w+)\s*{\s*([^,\s]+)\s*,", text):
        start = m.end()
        nxt = text.find("\n@", start)
        body = text[start: nxt if nxt != -1 else len(text)]
        tm = re.search(r"\btitle\s*=\s*{(.*?)}\s*,?\s*\n", body, re.S)
        ym = re.search(r"\byear\s*=\s*{?(\d{4})", body)
        out.append({
            "key": m.group(2),
            "type": m.group(1).lower(),
            "title": re.sub(r"\s+", " ", tm.group(1)) if tm else "",
            "year": int(ym.group(1)) if ym else None,
        })
    return out


# ----------------------------------------------------------------------------
# Google Scholar
# ----------------------------------------------------------------------------
def scholar_html(user: str) -> dict:
    papers, cstart = [], 0
    soup = None
    while True:
        r = get("https://scholar.google.com/citations",
                params={"user": user, "hl": "en", "cstart": cstart, "pagesize": 100})
        page = BeautifulSoup(r.text, "html.parser")
        if soup is None:
            soup = page
        if "gsc_rsb_st" not in r.text and not papers:
            raise RuntimeError("Scholar returned a page without the profile (captcha?)")
        rows = page.select("tr.gsc_a_tr")
        for tr in rows:
            a = tr.select_one("a.gsc_a_at")
            if not a:
                continue
            c = tr.select_one("a.gsc_a_ac")
            y = tr.select_one("span.gsc_a_h")
            href = a.get("href", "")
            m = re.search(r"citation_for_view=([^&]+)", href)
            cites = c.get_text(strip=True) if c else ""
            papers.append({
                "id": m.group(1) if m else norm_title(a.get_text())[:60],
                "title": a.get_text(" ", strip=True),
                "year": int(y.get_text(strip=True)) if y and y.get_text(strip=True).isdigit() else None,
                "citations": int(cites) if cites.isdigit() else 0,
                "cites_url": (c.get("href") if c and c.get("href") else None),
            })
        if len(rows) < 100:
            break
        cstart += 100
        time.sleep(3)

    stats = {}
    for tr in soup.select("#gsc_rsb_st tbody tr"):
        name = tr.select_one(".gsc_rsb_sc1").get_text(strip=True).lower()
        vals = [td.get_text(strip=True) for td in tr.select("td.gsc_rsb_std")]
        key = {"citations": "citations", "h-index": "h_index", "i10-index": "i10_index"}.get(name)
        if key and vals:
            stats[key] = int(vals[0])
            if len(vals) > 1:
                stats[key + "_recent"] = int(vals[1])
    per_year = {}
    for a in soup.select("a.gsc_g_a"):
        m = re.search(r"as_ylo=(\d{4})", a.get("href", ""))
        v = a.select_one(".gsc_g_al")
        if m and v and v.get_text(strip=True).isdigit():
            per_year[m.group(1)] = int(v.get_text(strip=True))
    if not per_year:  # older markup: years and bars in the same order
        years = [s.get_text(strip=True) for s in soup.select(".gsc_g_t")]
        bars = [s.get_text(strip=True) for s in soup.select(".gsc_g_al")]
        if len(years) == len(bars):
            per_year = {y: int(b) for y, b in zip(years, bars) if b.isdigit()}
    return {"source": "scholar-html", **stats, "per_year": per_year, "papers": papers}


def scholar_serpapi(user: str, key: str) -> dict:
    papers, start = [], 0
    first = None
    while True:
        r = get("https://serpapi.com/search.json", params={
            "engine": "google_scholar_author", "author_id": user, "hl": "en",
            "num": 100, "start": start, "api_key": key})
        d = r.json()
        first = first or d
        arts = d.get("articles", [])
        for a in arts:
            cb = a.get("cited_by", {}) or {}
            papers.append({
                "id": a.get("citation_id") or norm_title(a.get("title", ""))[:60],
                "title": a.get("title", ""),
                "year": int(a["year"]) if str(a.get("year", "")).isdigit() else None,
                "citations": int(cb.get("value") or 0),
                "cites_url": cb.get("link"),
            })
        if len(arts) < 100:
            break
        start += 100
    cb = first.get("cited_by", {})
    table = {list(row.keys())[0]: list(row.values())[0] for row in cb.get("table", [])}
    return {
        "source": "serpapi",
        "citations": table.get("citations", {}).get("all"),
        "citations_recent": table.get("citations", {}).get("since_2021"),
        "h_index": table.get("h_index", {}).get("all"),
        "i10_index": table.get("i10_index", {}).get("all"),
        "per_year": {str(g["year"]): g["citations"] for g in cb.get("graph", [])},
        "papers": papers,
    }


def collect_scholar(prev: dict) -> tuple[dict | None, list[dict]]:
    user = socials().get("scholar_userid")
    if not user:
        return None, []
    try:
        key = os.environ.get("SERPAPI_KEY")
        data = scholar_serpapi(user, key) if key else scholar_html(user)
    except Exception as e:
        log(f"Scholar skipped: {e}")
        return None, []
    data["user"] = user
    log(f"Scholar: {data.get('citations')} citations, h={data.get('h_index')}, {len(data['papers'])} papers")

    events = []
    old = {p["id"]: p for p in (prev.get("scholar") or {}).get("papers", [])}
    if old:  # no events on the very first run (everything would be "new")
        for p in data["papers"]:
            before = old.get(p["id"], {}).get("citations", 0)
            if p["citations"] > before:
                events.append({
                    "date": TODAY, "kind": "scholar", "delta": p["citations"] - before,
                    "total": p["citations"], "cited_title": p["title"], "url": p.get("cites_url"),
                })
    return data, events


def write_al_citations(scholar: dict) -> None:
    """Keep _data/citations.yml in the format expected by al-folio badges."""
    out = {"metadata": {"last_updated": TODAY}, "papers": {}}
    for p in scholar["papers"]:
        pid = p["id"] if ":" in p["id"] else f"{scholar['user']}:{p['id']}"
        out["papers"][pid] = {"title": p["title"], "year": p["year"] or "Unknown Year",
                              "citations": p["citations"]}
    (ROOT / "_data" / "citations.yml").write_text(
        yaml.safe_dump(out, allow_unicode=True, sort_keys=True, width=1000), encoding="utf-8")


# ----------------------------------------------------------------------------
# DBLP
# ----------------------------------------------------------------------------
def best_link(ees: list[str]) -> str | None:
    for pref in ("aclanthology.org", "ojs.aaai.org", "doi.org", ""):
        for e in ees:
            if pref in e:
                return e
    return None


def collect_dblp(import_bib: bool) -> dict | None:
    url = socials().get("dblp_url")
    if not url:
        return None
    xml_url = re.sub(r"\.html?$", "", url) + ".xml"
    try:
        soup = BeautifulSoup(get(xml_url, timeout=40).text, "html.parser")
    except Exception as e:
        log(f"DBLP skipped: {e}")
        return None
    recs = []
    for r in soup.find_all("r"):
        rec = next((c for c in r.children if getattr(c, "name", None)), None)
        if rec is None:
            continue
        title = rec.find("title").get_text(" ", strip=True).rstrip(".") if rec.find("title") else ""
        venue = rec.find("booktitle") or rec.find("journal")
        recs.append({
            "key": rec.get("key"),
            "type": rec.name,
            "title": title,
            "year": int(rec.find("year").get_text()) if rec.find("year") else None,
            "venue": venue.get_text(strip=True) if venue else "",
            "ee": [e.get_text(strip=True) for e in rec.find_all("ee")],
        })
    bib = {norm_title(b["title"]): b["key"] for b in bib_entries()}
    links, new = {}, []
    for rec in recs:
        k = bib.get(norm_title(rec["title"]))
        link = best_link(rec["ee"])
        if k:
            if link and not (rec["venue"] == "CoRR" and k in links):
                links[k] = {"url": link, "venue": rec["venue"]}
        elif rec["venue"] != "CoRR":
            new.append(rec)
    if import_bib and new:
        import_into_bib(new)
    log(f"DBLP: {len(recs)} records, {len(links)} linked to .bib, {len(new)} not in .bib")
    return {"count": len(recs), "links": links, "missing_from_bib": new,
            "per_year": {str(y): sum(1 for r in recs if r["year"] == y and r["venue"] != "CoRR")
                         for y in sorted({r["year"] for r in recs if r["year"]})}}


VENUE_ABBR = [("EMNLP", "EMNLP"), ("ACL", "ACL"), ("NAACL", "NAACL"), ("EACL", "EACL"),
              ("AAAI", "AAAI"), ("ECAI", "ECAI"), ("IJCAI", "IJCAI"), ("COLING", "COLING"),
              ("ICLR", "ICLR"), ("NeurIPS", "NeurIPS"), ("Expert Syst. Appl.", "ESWA"),
              ("Neural Networks", "NN"), ("Neurocomputing", "NEUCOM"), ("Artif. Intell. Law", "AIL"),
              ("KEIR", "KEIR")]


def import_into_bib(new: list[dict]) -> None:
    text = BIB.read_text(encoding="utf-8")
    added = []
    for rec in new:
        try:
            bibtex = get(f"https://dblp.org/rec/{rec['key']}.bib", params={"param": 1}).text.strip()
        except Exception as e:
            log(f"could not fetch BibTeX for {rec['key']}: {e}")
            continue
        abbr = next((a for v, a in VENUE_ABBR if v.lower() in rec["venue"].lower()), None)
        extra = "  bibtex_show = {true},\n" + (f"  abbr        = {{{abbr}}},\n" if abbr else "")
        bibtex = re.sub(r"^(@\w+\{[^,]+,\n)", r"\1" + extra.replace("\\", "\\\\"), bibtex, count=1)
        added.append(bibtex)
    if added:
        text = text.rstrip() + (
            "\n\n% ============================================================================\n"
            f"% Auto-imported from DBLP on {TODAY} by bin/update_metrics.py (please review)\n"
            "% ============================================================================\n\n"
            + "\n\n".join(added) + "\n")
        BIB.write_text(text, encoding="utf-8")
        log(f"appended {len(added)} DBLP entries to papers.bib")


# ----------------------------------------------------------------------------
# AMS Laurea (EPrints)
# ----------------------------------------------------------------------------
def ams_search_params() -> dict:
    return {
        "screen": "Search", "dataset": "archive", "_action_search": "Cerca",
        "documents_merge": "ALL", "documents": "", "title_merge": "ALL", "title": "",
        "creators_name_merge": "ALL", "creators_name": "", "relatore_merge": "ALL", "relatore": "",
        "correlatore_multi_merge": "ALL", "correlatore_multi": AMS_SUPERVISOR,
        "abstract_merge": "ALL", "abstract": "", "keywords_merge": "ALL", "keywords": "",
        "discussion_date": "", "scuola_merge": "ANY", "cds_merge": "ANY",
        "indirizzo_merge": "ANY", "orientamento_merge": "ANY", "satisfyall": "ALL",
        "order": "-discussion_date/creators_name/title",
    }


AMS_PERSON = "Frisoni=3AGiacomo=3A=3A"   # EPrints id of "Frisoni, Giacomo" in the relatore/correlatore view


def _level(*texts) -> str | None:
    """Master's or Bachelor's, from the thesis type code (THELM/THEL...) or the degree course label."""
    t = " ".join(str(x) for x in texts if x).lower()
    if re.search(r"thelm|magistral|\[lm-|\blm-|ciclo unico|master", t):
        return "M.S."
    if re.search(r"thel|triennal|\[l-|\bl-dm|laurea\b|bachelor", t):
        return "B.S."
    return None


def _ams_item(e: dict) -> dict:
    def name(c):
        if isinstance(c, dict):
            n = c.get("name", c)
            if isinstance(n, dict):
                return f"{n.get('family', '')}, {n.get('given', '')}".strip(", ")
        return str(c)
    creators = e.get("creators") or e.get("creators_name") or []
    date = str(e.get("discussion_date") or e.get("date") or "")
    title = e.get("title")
    return {
        "author": "; ".join(name(c) for c in creators) if isinstance(creators, list) else name(creators),
        "title": (title if isinstance(title, str) else str(title or "")).strip(),
        "date": date[:10],
        "year": int(date[:4]) if date[:4].isdigit() else None,
        "level": _level(e.get("thesistype"), e.get("citation"), e.get("cds")) or _level(json.dumps(e, ensure_ascii=False)),
        "url": e.get("uri") or (f"{AMS_BASE}/id/eprint/{e['eprintid']}/" if e.get("eprintid") else None),
    }


def _ams_from_view_html(html_text: str) -> list[dict]:
    """Parse the public 'Relatore e Correlatore' browse page: one citation per thesis, e.g.
    'Rossi, Mario (2024) Title. [Laurea magistrale], Università di Bologna, Corso di Studio in ... [LM-DM270]'"""
    soup = BeautifulSoup(html_text, "html.parser")
    items = []
    for a in soup.find_all("a", href=re.compile(r"amslaurea\.unibo\.it/(id/eprint/)?\d+/?$|^/(id/eprint/)?\d+/?$")):
        block = a.find_parent(["p", "li", "div"]) or a.parent
        text = block.get_text(" ", strip=True)
        m = re.match(r"(.+?)\s*\((\d{4})\)", text)
        if not m:
            continue
        items.append({
            "author": m.group(1).strip(),
            "title": a.get_text(" ", strip=True).rstrip("."),
            "year": int(m.group(2)),
            "level": _level(text),
            "url": urljoin(AMS_BASE + "/", a["href"]),
        })
    seen, out = set(), []
    for it in items:  # a citation can contain more than one link
        if it["url"] not in seen:
            seen.add(it["url"]); out.append(it)
    return out


def collect_ams() -> dict | None:
    """Theses where Giacomo Frisoni is relatore or correlatore. Three routes, most reliable first:
    1. EPrints export of the browse view as JSON (structured: type, course, date);
    2. the same browse view as HTML;
    3. the advanced search used in the CV."""
    items: list[dict] = []
    tried = []
    exp = f"{AMS_BASE}/cgi/exportview/relatore/{AMS_PERSON}/JSON/{AMS_PERSON}.js"
    try:
        js = get(exp, timeout=60).json()
        items = [_ams_item(e) for e in js if isinstance(e, dict)]
        tried.append(f"export JSON: {len(items)}")
    except Exception as e:
        tried.append(f"export JSON failed ({e})")
    if not items:
        try:
            items = _ams_from_view_html(get(f"{AMS_BASE}/view/relatore/{AMS_PERSON}.html", timeout=60).text)
            tried.append(f"view HTML: {len(items)}")
        except Exception as e:
            tried.append(f"view HTML failed ({e})")
    if not items:
        try:
            r = get(f"{AMS_BASE}/cgi/search/archive/advanced", params=ams_search_params(), timeout=60)
            items = _ams_from_view_html(r.text)
            tried.append(f"search HTML: {len(items)}")
        except Exception as e:
            tried.append(f"search failed ({e})")
    log("AMS Laurea: " + "; ".join(tried))
    if not items:
        log("AMS Laurea: nothing parsed, keeping previous data")
        return None
    by_year: dict[str, int] = {}
    by_level: dict[str, dict[str, int]] = {"M.S.": {}, "B.S.": {}, "unknown": {}}
    for it in items:
        if it.get("year"):
            y = str(it["year"])
            by_year[y] = by_year.get(y, 0) + 1
            lv = it.get("level") or "unknown"
            by_level[lv][y] = by_level[lv].get(y, 0) + 1
    items.sort(key=lambda it: (it.get("date") or str(it.get("year") or "")), reverse=True)
    log(f"AMS Laurea: {len(items)} theses")
    return {"count": len(items), "items": items, "per_year": dict(sorted(by_year.items())),
            "per_year_level": {k: dict(sorted(v.items())) for k, v in by_level.items()},
            "search_url": f"{AMS_BASE}/view/relatore/{AMS_PERSON}.html"}


# ----------------------------------------------------------------------------
def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--no-import-bib", action="store_true",
                    help="do not append DBLP records missing from papers.bib")
    ap.add_argument("--only", nargs="*", choices=["scholar", "dblp", "ams"])
    args = ap.parse_args()
    run = set(args.only or ["scholar", "dblp", "ams"])

    prev = load_json(DATA / "metrics.json", {})
    feed = load_json(DATA / "citation_feed.json", [])
    history = load_json(DATA / "history.json", [])
    # Rows that only repeat the placeholder copied from the June CV (613 citations) are not real
    # readings: the June 8 seed itself, and any day on which Scholar was unreachable before the
    # first successful fetch (October 2, 2026).
    history = [h for h in history if not (h.get("scholar_citations") == 613 and h.get("date", "") <= "2026-10-01")]
    snap = dict(prev)
    new_events: list[dict] = []

    fresh_scholar = False
    if "scholar" in run:
        s, ev = collect_scholar(prev)
        if s:
            fresh_scholar = True
            snap["scholar"] = s
            new_events += ev
            write_al_citations(s)
    if "dblp" in run:
        d = collect_dblp(not args.no_import_bib)
        if d:
            snap["dblp"] = d
    if "ams" in run:
        a = collect_ams()
        if a:
            snap["theses"] = a

    snap.pop("openalex", None)
    snap.pop("seed", None)
    snap["updated"] = TODAY
    dump_json(DATA / "metrics.json", snap)

    feed = sorted(new_events + feed, key=lambda e: e.get("date") or "", reverse=True)[:FEED_MAX]
    dump_json(DATA / "citation_feed.json", feed)

    row = {"date": TODAY}
    if fresh_scholar:  # only values fetched today, never the ones carried over from a previous snapshot
        for k in ("citations", "h_index", "i10_index"):
            v = snap["scholar"].get(k)
            if v is not None:
                row[f"scholar_{k}"] = v
    if snap.get("theses"):
        row["theses"] = snap["theses"]["count"]
    history = [h for h in history if h.get("date") != TODAY] + [row]
    dump_json(DATA / "history.json", history)

    summary = {
        "updated": TODAY,
        "theses": (snap.get("theses") or {}).get("count"),
        "citations": (snap.get("scholar") or {}).get("citations"),
        "h_index": (snap.get("scholar") or {}).get("h_index"),
        "i10_index": (snap.get("scholar") or {}).get("i10_index"),
        "new_citations_7d": sum(1 for e in feed if e.get("date", "") >= (dt.date.today() - dt.timedelta(days=7)).isoformat() and not e.get("baseline")),
    }
    old_summary = yaml.safe_load((ROOT / "_data" / "metrics.yml").read_text()) if (ROOT / "_data" / "metrics.yml").exists() else {}
    for k, v in summary.items():  # never overwrite a known value with "unknown"
        if v is None and old_summary.get(k) is not None:
            summary[k] = old_summary[k]
    (ROOT / "_data" / "metrics.yml").write_text(
        "# Written by bin/update_metrics.py, do not edit by hand.\n"
        + yaml.safe_dump(summary, sort_keys=False, allow_unicode=True), encoding="utf-8")
    log(f"done: {len(new_events)} new citation events")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        sys.exit(130)
