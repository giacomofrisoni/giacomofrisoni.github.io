---
layout: page
permalink: /publications/
title: publications
description: Conference papers, journal articles, workshop papers, books, and preprints. Venue classes follow ICORE 2026 for conferences and Scimago (SJR) 2026 for journals.
nav: true
nav_order: 1
---

<!-- _pages/publications.md -->

<div class="gf-shell" id="gf-scholar" markdown="0">
  <div class="gf-term-bar" aria-hidden="true"><i></i><i></i><i></i><span>scholar@giacomofrisoni: ~</span></div>
  <div class="gf-shell-tabs" role="tablist" aria-label="Citation views"></div>
  <div class="gf-shell-out" aria-live="polite">
    <span class="d"># Google Scholar: {{ site.data.metrics.citations | default: 'n/a' }} citations, h-index {{ site.data.metrics.h_index | default: 'n/a' }}</span>
  </div>
  <div class="gf-shell-status"></div>
</div>

The same list is on [Google Scholar](https://scholar.google.com/citations?user=BEZlFiAAAAAJ) and [DBLP](https://dblp.org/pid/271/1231.html), from which new papers are imported automatically.

<div class="gf-filter gf-pubfilter" id="gf-pubfilter" role="toolbar" aria-label="Filter by publication type" markdown="0"></div>

{% include bib_search.liquid %}

<div class="publications">

{% bibliography %}

</div>

<script>window.GF_PUB_META = {{ site.data.pub_meta | jsonify }};</script>
<script src="{{ '/assets/extras/pubs.js' | relative_url }}?v={{ site.time | date: '%s' }}" defer></script>
