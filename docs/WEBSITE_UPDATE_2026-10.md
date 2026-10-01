# Website update, October 2026

Unzip over the repository root (paths are preserved), commit, push.

## What runs automatically
`.github/workflows/update-metrics.yml` runs every day at 05:17 UTC (and from
Actions > "Update metrics" > Run workflow). It executes `bin/update_metrics.py`, which updates:

| File | Content |
| --- | --- |
| `assets/data/metrics.json` | Google Scholar totals, citations per year and per paper; OpenAlex works; DBLP links; AMS Laurea theses |
| `assets/data/history.json` | one row per day (citations, h-index, theses), used by the time-series chart |
| `assets/data/citation_feed.json` | "New citations" feed: Scholar per-paper gains and new citing papers from OpenAlex |
| `_data/metrics.yml` | summary read by Liquid (thesis count, citations, h-index) |
| `_data/citations.yml` | Scholar badge data for al-folio (it previously contained the template's Einstein sample) |

It then commits and starts `deploy.yml` (a push made with GITHUB_TOKEN does not trigger it by itself).

* Google Scholar often blocks GitHub runners. If the Scholar numbers stop changing, add a
  free SerpAPI key as repository secret `SERPAPI_KEY`; the script switches to it.
  OpenAlex, DBLP and AMS Laurea need no key.
* Run the workflow manually once right after pushing, so the seed values (from the June CV) are replaced.
* "Import bib" input of the manual run: appends DBLP records missing from `papers.bib`
  (non-arXiv only), under an "Auto-imported from DBLP" banner. Off by default.

## Where to edit by hand
* `_data/pub_meta.yml`: city/country (flag), ICORE 2026 / SJR 2026 class, acceptance rate,
  track, award, ACL Anthology ID, demo, poster preview, per BibTeX key.
  TODO: Space URLs for the OpenBioNER-v2, Paint It Black and Mixture of Masters demos.
* `_data/theses_selected.yml`: selected theses (TODO: official title of A. Ferri's thesis;
  replaced automatically once the thesis is on AMS Laurea).
* `_data/student_projects.yml`: BDA-TM project topics per academic year.
* Posters: preview image in `assets/img/posters/`, PDF in `assets/pdf/posters/`,
  then `poster`/`preview` fields in the .bib and `poster_img` in pub_meta.

## New files at a glance
* `_includes/footer.liquid` (copy of al_folio_core's footer + one include), `_includes/extras/*`
* `assets/extras/site.css|site.js|pubs.js|teaching.js` (outside assets/css so PurgeCSS does not touch them)
* `_pages/cli.md` (navbar item, redirects to /terminal/)

## Second revision (October 2, 2026)
* Home: affiliation box under the photo, "upcoming" section, research-group block with the UniboNLP logo, colored brand icons, quote. The floating shell button is gone; the navbar `cli` pill blinks.
* News: `/news/` now lists every item with year filters and search (linked from the home page).
* Publications: one card per paper (figure, type, venue with flag, authors, one-line description, links), filter by type, Google Scholar shell panel with ASCII charts. Representative figures: add `figure:` in `_data/pub_meta.yml` (image in `assets/img/publication_preview/`); papers without one show a neutral placeholder.
* OpenAlex removed. New DBLP records are appended to `papers.bib` automatically.
* Projects: overview page restored to the original; DARE and AI-PACT pages show their logos; AI-SLN page with an interactive surgical sequence, tabs for the three tasks and animated results.
* Teaching: BBS logo, stacked Master's/Bachelor's chart of theses per year (from AMS Laurea), more project topics.
* Blog: `/blog/` with two posts (Notte dei Ricercatori 2026 with the video, KEIR history). Video in `assets/video/`.
