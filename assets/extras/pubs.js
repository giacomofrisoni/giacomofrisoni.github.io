/* Publications page.
 *  - shell panel with ASCII charts (Google Scholar data refreshed daily by bin/update_metrics.py)
 *  - each bibliography entry is rebuilt as a card: figure, type, venue, authors, one-line description, links
 *  - filter by publication type
 * Data: window.GF_PUB_META (_data/pub_meta.yml), assets/data/{metrics,history,citation_feed}.json
 * Without JavaScript the standard al-folio list is shown. */
(function () {
  "use strict";
  var GF = window.GF || { data: "/assets/data/", base: "" };
  var META = window.GF_PUB_META || {};
  var BASE = GF.base || "";
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function norm(t) { return String(t || "").normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim(); }
  function getJSON(n) { return fetch(GF.data + n, { cache: "no-cache" }).then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; }); }
  function daysAgo(n) { var d = new Date(); d.setDate(d.getDate() - n); return d.toISOString().slice(0, 10); }
  function fmt(iso) { var d = new Date(iso + "T00:00:00"); return isNaN(d) ? iso || "" : d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }); }
  function asset(p) { return (window.GFA || function (x) { return x; })(BASE + p); }

  var KINDS = [
    ["Conference", "var(--gf-conf)"], ["Journal", "var(--gf-jour)"], ["Workshop", "var(--gf-work)"],
    ["Book", "var(--gf-book)"], ["Preprint", "var(--gf-pre)"]
  ];
  var KCOL = {}; KINDS.forEach(function (k) { KCOL[k[0]] = k[1]; });
  function kindOf(m) {
    if (m.kind) return m.kind;
    if (m.rank && /^Q/.test(m.rank)) return "Journal";
    if (m.event && /@|SEBD/.test(m.event)) return "Workshop";
    if (m.event) return "Conference";
    return "Preprint";
  }
  function eventName(e) { return String(e || "").replace(/-(\d\d)$/, " 20$1"); }
  var LABELS = [[/aclanthology\.org|10\.18653/, "ACL Anthology"], [/ojs\.aaai\.org|10\.1609/, "AAAI"], [/iospress|10\.3233/, "IOS Press"],
    [/sciencedirect|10\.1016/, "ScienceDirect"], [/springer|10\.1007/, "Springer"], [/mdpi|10\.3390/, "MDPI"], [/ieeexplore|10\.1109/, "IEEE Xplore"],
    [/scitepress|10\.5220/, "SciTePress"], [/arxiv\.org/, "arXiv"]];
  function labelFor(u) { for (var i = 0; i < LABELS.length; i++) if (LABELS[i][0].test(u)) return LABELS[i][1]; return "Publisher"; }

  /* ---------------------------------------------------------------- cards */
  function cards(metrics) {
    var scholar = {}; ((metrics.scholar || {}).papers || []).forEach(function (p) { scholar[norm(p.title)] = p; });
    var dblp = (metrics.dblp || {}).links || {};
    var all = [];
    $$(".publications ol.bibliography > li").forEach(function (li) {
      var box = li.querySelector("div[id]"); if (!box) return;
      var key = box.id, m = META[key] || {}, kind = kindOf(m), col = KCOL[kind] || KCOL.Preprint;
      var titleEl = box.querySelector(".title"), title = titleEl ? titleEl.textContent.trim() : "";
      var authors = box.querySelector(".author") ? box.querySelector(".author").innerHTML : "";
      var per = box.querySelectorAll(".periodical");
      var venueFull = per[0] ? per[0].textContent.replace(/\s+/g, " ").trim().replace(/,\s*\d{4}$/, "") : "";
      var note = per[1] ? per[1].textContent.trim() : "";
      var year = (li.closest("ol").previousElementSibling || {}).textContent;

      /* tile: short venue name + year on a dotted background */
      var yr = String(year || "").trim();
      var shortName = m.event ? eventName(m.event) : (m.short ? m.short + " " + yr : kind + " " + yr);
      var fig = '<div class="gf-ph" style="--k:' + col + '"><b>' + esc(shortName) + "</b></div>";
      var v = [];
      var flag = m.country ? '<img class="gf-flag" src="' + esc(asset("/assets/img/flags/" + m.country.toLowerCase() + ".svg")) + '" alt="' + esc(m.country) + '">' : "";
      if (kind === "Journal") v.push(flag + "<strong>" + esc(venueFull) + "</strong>");
      else if (m.event) v.push(flag + "<strong>" + esc(eventName(m.event)) + "</strong>" + (m.track && m.track !== "Main" ? " " + esc(m.track) : "") + (m.city ? '<span class="gf-dim">, ' + esc(m.city === "online" ? "online" : m.city) + "</span>" : ""));
      else v.push("<strong>" + esc(venueFull || kind) + "</strong>");
      if (m.rank) v.push('<span class="gf-dim" title="' + (/^Q/.test(m.rank) ? "Scimago Journal Rank 2026 quartile" : "ICORE 2026 conference class") + '">' + (/^Q/.test(m.rank) ? "SJR " : "ICORE ") + esc(m.rank) + "</span>");
      if (m.acceptance) v.push('<span class="gf-dim">' + esc(m.acceptance) + "% acceptance</span>");
      if (m.talk) v.push('<span class="gf-dim">' + esc(m.talk) + "</span>");
      if (/to appear/i.test(note)) v.push('<span class="gf-dim">to appear</span>');
      var venue = v.join('<span class="gf-sep">·</span>') + (m.award ? '<span class="gf-award">🏆 ' + esc(m.award) + "</span>" : "");

      var links = [];
      var primary = m.anthology ? "https://aclanthology.org/" + m.anthology + "/" : (m.url || (dblp[key] && dblp[key].url));
      $$(".links a", box).forEach(function (a) {
        var t = a.textContent.trim(), href = a.getAttribute("href");
        if (t === "DOI" && !primary) primary = href;
        else if (["Bib", "Abs", "DOI", "Poster", "HTML"].indexOf(t) < 0 && href && href !== "#") links.push('<a href="' + esc(href) + '" target="_blank" rel="noopener">' + esc(t) + "</a>");
        else if (t === "HTML" && !primary) primary = href;
      });
      if (primary) links.unshift('<a href="' + esc(primary) + '" target="_blank" rel="noopener">' + esc(m.anthology ? "ACL Anthology" : labelFor(primary)) + "</a>");
      if (m.demo) {
        var hf = m.demo.url && /huggingface\.co/.test(m.demo.url);
        var dl = (hf ? '<img src="' + esc(asset("/assets/img/logos/huggingface_color.svg")) + '" alt="">' : "") + "Demo";
        if (m.demo.url) links.push('<a href="' + esc(m.demo.url) + '" target="_blank" rel="noopener" title="' + esc((m.demo.label || "") + (m.demo.event ? ", " + m.demo.event : "")) + '">' + dl + "</a>");
        else if (m.demo.img) links.push('<button type="button" data-gf-lightbox="' + esc(asset(m.demo.img)) + '" data-caption="' + esc(m.demo.label || "Demo") + '">' + dl + "</button>");
      }
      if (m.poster_img) links.push('<button type="button" data-gf-lightbox="' + esc(asset("/assets/img/posters/" + m.poster_img)) + '" data-caption="' + esc("Poster: " + title) + '">Poster</button>');
      var bib = box.querySelector(".bibtex");
      if (bib) links.push('<button type="button" class="gf-bibbtn">BibTeX</button>');
      var sc = scholar[norm(title)];
      if (sc && sc.citations) links.push('<span class="gf-dim" title="Citations on Google Scholar">' + sc.citations + " citation" + (sc.citations === 1 ? "" : "s") + "</span>");

      var card = document.createElement("article");
      card.className = "gf-pub gf-reveal"; card.dataset.kind = kind; card.style.setProperty("--k", col);
      card.innerHTML = '<div class="gf-pub-fig">' + fig + "</div><div>" +
        '<span class="gf-pub-kind">' + esc(kind === "Book" && /chapter/i.test(m.kind_label || "") ? "Book chapter" : (m.kind_label || kind)) + "</span>" +
        "<h3>" + (primary ? '<a class="gf-t" href="' + esc(primary) + '" target="_blank" rel="noopener">' + esc(title) + "</a>" : esc(title)) + "</h3>" +
        '<div class="gf-venue">' + venue + (kind === "Conference" || kind === "Workshop" ? '<span class="gf-full">' + esc(venueFull) + "</span>" : "") + "</div>" +
        '<div class="gf-auth">' + authors + "</div>" +
        (m.tldr ? '<p class="gf-desc">' + esc(m.tldr) + "</p>" : "") +
        '<div class="gf-links">' + links.join("") + "</div></div>" +
        (bib ? '<pre class="gf-bibtex">' + esc(bib.textContent.trim()) + "</pre>" : "");
      var b = card.querySelector(".gf-bibbtn");
      if (b) b.addEventListener("click", function () { card.classList.toggle("gf-open-bib"); });
      li.appendChild(card);
      all.push(card);
    });
    document.querySelector(".publications").classList.add("gf-ready");
    return all;
  }

  function filters(all) {
    var bar = document.getElementById("gf-pubfilter"); if (!bar) return;
    var counts = {}; all.forEach(function (c) { counts[c.dataset.kind] = (counts[c.dataset.kind] || 0) + 1; });
    var html = '<button type="button" aria-pressed="true" data-k="all">All<small>' + all.length + "</small></button>";
    KINDS.forEach(function (k) { if (counts[k[0]]) html += '<button type="button" aria-pressed="false" data-k="' + k[0] + '" data-kind style="--k:' + k[1] + '">' + k[0] + (k[0] === "Book" ? "s & chapters" : "s") + "<small>" + counts[k[0]] + "</small></button>"; });
    bar.innerHTML = html;
    bar.addEventListener("click", function (e) {
      var btn = e.target.closest("button"); if (!btn) return;
      $$("button", bar).forEach(function (x) { x.setAttribute("aria-pressed", String(x === btn)); });
      var k = btn.dataset.k;
      all.forEach(function (c) { c.hidden = !(k === "all" || c.dataset.kind === k); });
      $$(".publications h2.bibliography").forEach(function (h) {
        var ol = h.nextElementSibling; var any = ol && $$(".gf-pub", ol).some(function (c) { return !c.hidden; });
        h.style.display = any ? "" : "none"; if (ol) ol.style.display = any ? "" : "none";
      });
    });
  }

  /* ---------------------------------------------------------- shell panel */
  function shell(metrics, history, feed, n) {
    /* site.js (which defines GFShell) loads after this file, so look it up now */
    var S = window.GFShell;
    var box = document.getElementById("gf-scholar"); if (!box || !S) return;
    var out = box.querySelector(".gf-shell-out"), status = box.querySelector(".gf-shell-status");
    var s = metrics.scholar || {};
    var hs = (history || []).filter(function (h) { return h.scholar_citations != null; });
    var month = hs.filter(function (h) { return h.date <= daysAgo(30); }).pop() || hs[0];
    var gain = (s.citations != null && month && hs.length > 1) ? s.citations - month.scholar_citations : null;
    var cmds = {
      stats: ["scholar stats", function () {
        var L = [["citations", s.citations, gain > 0 ? "+" + gain + " in the last 30 days" : ""], ["h-index", s.h_index, "papers with at least h citations each"],
          ["i10-index", s.i10_index, "papers with at least 10 citations"], ["papers", n, "listed on this page"]];
        out.innerHTML += "\n" + '<span class="d"># Google Scholar profile, refreshed every morning</span>\n' + L.map(function (l) {
          return '<span class="row">' + S.esc(l[0].padEnd(11)) + '<span class="h">' + S.esc(String(l[1] == null ? "n/a" : l[1]).padStart(5)) + '</span>   <span class="d">' + S.esc(l[2]) + "</span></span>";
        }).join("\n");
        status.textContent = "Last update: " + fmt(metrics.updated) + (metrics.seed ? " (values from the CV until the first automatic update)" : "") + ". Try the other commands above.";
      }],
      year: ["scholar citations --per-year", function () {
        var py = s.per_year || {}, ys = Object.keys(py).sort();
        var holder = document.createElement("div"); out.appendChild(document.createTextNode("\n")); out.appendChild(holder);
        if (!ys.length) { holder.innerHTML = '<span class="d">no data yet: appears after the first daily update</span>'; return; }
        S.bars(holder, status, ys, [{ name: "citations", values: ys.map(function (y) { return py[y]; }), cls: "bar-a", ch: "█" }], "citations");
        status.textContent = "Citations received in each calendar year (the current year is still running). Hover a bar for its value.";
      }],
      time: ["scholar citations --history", function () {
        var holder = document.createElement("div"); out.appendChild(document.createTextNode("\n")); out.appendChild(holder);
        if (hs.length < 2) { holder.innerHTML = '<span class="d">tracking started on ' + S.esc(fmt(hs[0] && hs[0].date)) + ": the curve appears after the second daily update</span>"; return; }
        S.spark(holder, status, hs.map(function (h) { return { d: h.date, v: h.scholar_citations }; }), "total citations");
        status.textContent = "Total citations, one point per day. Hover the line to read a day.";
      }],
      diff: ["scholar diff --last 30d", function () {
        var ev = (feed || []).filter(function (e) { return e.kind === "scholar" && !e.baseline; }).slice(0, 12);
        var rows = ev.map(function (e) {
          var t = e.cited_title || "", k = Object.keys(META).filter(function (key) { return false; });
          return '<span class="row"><span class="d">' + S.esc(e.date) + '</span>  <span class="g">' + S.esc(("+" + e.delta).padStart(3)) + "</span>  " + S.esc(t.length > 58 ? t.slice(0, 57) + "…" : t) + ' <span class="d">(' + S.esc(e.total) + " total)</span></span>";
        });
        out.innerHTML += "\n" + '<span class="d"># papers whose Google Scholar count went up, compared day by day</span>\n' + (rows.length ? rows.join("\n") : '<span class="d">no increase recorded yet</span>');
        status.textContent = "Every morning the counts of each paper are compared with the previous day; each line is a paper that gained citations.";
      }]
    };
    var tabs = box.querySelector(".gf-shell-tabs");
    tabs.innerHTML = [["stats", "stats"], ["year", "per year"], ["time", "history"], ["diff", "new citations"]].map(function (t) { return '<button type="button" role="tab" data-c="' + t[0] + '">' + t[1] + "</button>"; }).join("");
    function go(c) {
      $$("button", tabs).forEach(function (b) { b.setAttribute("aria-selected", String(b.dataset.c === c)); });
      S.run(out, cmds[c][0], cmds[c][1]);
    }
    tabs.addEventListener("click", function (e) { var b = e.target.closest("button"); if (b) go(b.dataset.c); });
    var started = false;
    function start() { if (!started) { started = true; go("stats"); } }
    if ("IntersectionObserver" in window) { var io = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { start(); io.disconnect(); } }); io.observe(box); } else start();
  }

  function init() {
    Promise.all([getJSON("metrics.json"), getJSON("history.json"), getJSON("citation_feed.json")]).then(function (r) {
      var metrics = r[0] || {}, all = cards(metrics);
      filters(all);
      if (window.GFReveal) window.GFReveal();
      shell(metrics, r[1] || [], r[2] || [], all.length);
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
