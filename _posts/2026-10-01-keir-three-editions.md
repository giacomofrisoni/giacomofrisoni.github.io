---
layout: post
title: "KEIR, three editions in: from 10 to 32 submissions"
date: 2026-10-01
description: How the KEIR workshop grew from Glasgow to Lucca to Rome, and what the 2026 edition looks like in numbers, topics, and countries.
tags: [workshop, keir, information-retrieval]
thumbnail: /assets/img/blog_keir.svg
related_posts: false
# Countries of the accepted papers (one count per country per paper, from the authors' affiliations).
# DRAFT: inferred by hand from the accepted-paper list; verify against the EasyChair author export
# (Premium > Authors > download, column "country"), then set countries_draft to false.
countries_draft: true
countries:
  - [South Korea, 4]
  - [Italy, 3]
  - [United States, 2]
  - [Germany, 1]
  - [United Kingdom, 1]
  - [China, 1]
  - [India, 1]
  - [Australia, 1]
  - [Poland, 1]
  - [Japan, 1]
  - [Canada, 1]
  - [not yet classified, 2]
topics:
  - [Graphs and knowledge graphs, 6]
  - [Retrieval-augmented generation, 4]
  - [Scientific literature and resources, 2]
  - [Multimodal retrieval, 1]
  - [Agent memory, 1]
  - [Vector indexes, 1]
  - [Labour-market prediction, 1]
---

Three years ago, KEIR started as a bet: that **knowledge** (graphs, ontologies, curated databases, and more and more often documents written by language models themselves) would become the missing piece of modern search engines and of retrieval-augmented LLMs. I have been part of the organizing team since the first edition, and this year's numbers convinced me the bet is paying off.

<h2 class="gf-h2">how it grew</h2>

<ul class="gf-timeline" markdown="0">
  <li><b>2024 · Glasgow</b><br>KEIR @ ECIR 2024. The first edition, organized by a team spanning Bologna, Glasgow, and Amsterdam. I was the publicity chair: my job was to make a brand-new workshop visible to the people who should send it their papers.</li>
  <li><b>2025 · Lucca</b><br>KEIR @ ECIR 2025, my first edition as co-chair. 10 submissions, a keynote by Andrew Yates (University of Amsterdam), and our first Springer volume: <em>LNCS 16086</em>, with 4 full papers and 4 invited papers.</li>
  <li><b>2026 · Rome</b><br>KEIR @ CIKM 2026, November 8, Sapienza University of Rome. A new home at ACM CIKM, where the workshop program itself was competitive (16 proposals accepted out of a record 35), and a record year for us.</li>
</ul>

<div class="gf-shell" data-gf-chart="editions" markdown="0">
  <div class="gf-term-bar" aria-hidden="true"><i></i><i></i><i></i><span>keir@rome: ~</span></div>
  <div class="gf-shell-out"></div><div class="gf-shell-status">Submissions per edition (2024: first edition, numbers not tracked here).</div>
</div>

<h2 class="gf-h2">2026 in numbers</h2>

<div class="gf-stats" markdown="0">
  <div><b data-count="32">32</b><span>submissions, more than three times 2025</span></div>
  <div><b data-count="16">16</b><span>papers accepted after double-blind review</span></div>
  <div><b data-count="50" data-suffix="%">50%</b><span>acceptance rate</span></div>
  <div><b data-count="65">65</b><span>authors of accepted papers</span></div>
</div>

Selecting was harder than I expected. We extended the deadline twice because several groups asked for it, and the extra weeks brought in papers we would have been sorry to miss. With 32 submissions and room for 16, we had to turn down solid work. The 6 papers chosen for oral talks get an extra hour that CIKM gave us late in the planning; every accepted paper is also presented as a poster, so that the oral selection does not read as a ranking of quality.

<h2 class="gf-h2">what the accepted papers are about</h2>

What I like most about this year is the **range**. Graphs remain the backbone of the field, but they now sit next to retrieval-augmented generation, agent memory, multimodal search, and tools for scientific literature. The applications are just as varied: clinical records on smartphones, enterprise knowledge bases, research-impact prediction, and the labour market.

<div class="gf-shell" data-gf-chart="topics" markdown="0">
  <div class="gf-term-bar" aria-hidden="true"><i></i><i></i><i></i><span>keir@rome: ~/accepted</span></div>
  <div class="gf-shell-out"></div><div class="gf-shell-status">Main topic of each accepted paper, from its title and abstract. Hover a bar.</div>
</div>

<h2 class="gf-h2">where the authors come from</h2>

The accepted papers come from teams spread across **Asia, Europe, North America, and Oceania**, from universities, national research institutes, and companies. Several papers are international collaborations.

<div class="gf-shell" data-gf-chart="countries" markdown="0">
  <div class="gf-term-bar" aria-hidden="true"><i></i><i></i><i></i><span>keir@rome: ~/accepted --by-country</span></div>
  <div class="gf-shell-out"></div><div class="gf-shell-status">Accepted papers with at least one author from each country (a paper can count for more than one country).{% if page.countries_draft %} Draft: still to be checked against the submission system.{% endif %}</div>
</div>

Two of the accepted papers come from our group, both led by students I co-supervise: Alice Ferri's benchmark of on-device RAG over clinical records, and Kaijun Yuan's study of next-occupation prediction. In line with our conflict-of-interest policy, they were handled without the organizers from Bologna. Seeing my students on the same program as teams from four continents is, honestly, the part of this job I enjoy most.

<h2 class="gf-h2">see you in Rome</h2>

The afternoon opens with a keynote by **Fabio Petroni** (EMBL Rome), one of the people behind the original Retrieval-Augmented Generation work at Meta AI. Then come the oral session, the posters, and a closing panel with a live survey, where we want the audience to write the research agenda for the next edition. As in 2025, authors can publish their papers in a Springer LNCS volume. The workshop is partially supported by the DARE project and by Fondazione Cassa di Risparmio in Bologna.

Program and accepted papers: [keir-workshop.github.io](https://keir-workshop.github.io/).

<script>
document.addEventListener("DOMContentLoaded", function () {
  var DATA = {
    editions: { labels: ["2025", "2026"], values: [10, 32], unit: "submissions", cmd: "keir --submissions" },
    topics: { rows: {{ page.topics | jsonify }}, unit: "papers", cmd: "keir accepted --by-topic" },
    countries: { rows: {{ page.countries | jsonify }}, unit: "papers", cmd: "keir accepted --by-country" }
  };
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.querySelectorAll("[data-gf-chart]").forEach(function (box) {
    var d = DATA[box.dataset.gfChart]; if (!d || !window.GFShell) return;
    var labels = d.labels || d.rows.map(function (r) { return r[0]; });
    var values = d.values || d.rows.map(function (r) { return r[1]; });
    var out = box.querySelector(".gf-shell-out"), st = box.querySelector(".gf-shell-status");
    var go = function () {
      window.GFShell.run(out, d.cmd, function () {
        var h = document.createElement("div"); out.appendChild(document.createTextNode("\n")); out.appendChild(h);
        window.GFShell.bars(h, st, labels, [{ name: d.unit, values: values, cls: "bar-a", ch: "█" }], d.unit);
      });
    };
    var io = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { go(); io.disconnect(); } }, { threshold: 0.3 }); io.observe(box);
  });
  var nodes = document.querySelectorAll(".gf-stats [data-count]");
  var io2 = new IntersectionObserver(function (es) {
    if (!es[0].isIntersecting) return; io2.disconnect();
    nodes.forEach(function (n) {
      var to = +n.dataset.count, suf = n.dataset.suffix || "", t0 = null;
      function f(t) { t0 = t0 || t; var k = reduce ? 1 : Math.min(1, (t - t0) / 1000); n.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))) + suf; if (k < 1) requestAnimationFrame(f); }
      requestAnimationFrame(f);
    });
  });
  if (nodes.length) io2.observe(nodes[0]);
});
</script>
