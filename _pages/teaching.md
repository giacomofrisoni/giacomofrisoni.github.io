---
layout: page
permalink: /teaching/
title: teaching
description: Courses, tutoring, supervised projects, and thesis co-supervision at the University of Bologna.
nav: true
nav_order: 4
---

<h2 class="gf-h2">courses</h2>

<div markdown="0">
<div class="gf-course">
  <img src="{{ '/assets/img/logos/bbs_seal.png' | relative_url }}" alt="Bologna Business School">
  <div>
    <h3><a href="{% for c in site.teachings %}{% if c.course_id == 'text-mining-nlp-bbs' %}{{ c.url | relative_url }}{% endif %}{% endfor %}">Text Mining and Natural Language Processing</a></h3>
    <span class="gf-role">Adjunct Professor, co-instructor with Gianluca Moro</span>
    <span class="gf-years">A.Y. 2023–2026</span>
    <p>Master in Data Science and Business Analytics, <a href="https://www.bbs.unibo.it/">Bologna Business School</a>. I teach the laboratory module (12 hours) and design and grade the coding assignments. Student satisfaction 4.5/5 (2024–25) and 4.3/5 (2023–24).</p>
  </div>
</div>
<div class="gf-course">
  <img src="{{ '/assets/img/logos/unibo_seal.png' | relative_url }}" alt="University of Bologna">
  <div>
    <h3><a href="{% for c in site.teachings %}{% if c.course_id == 'big-data-analytics-text-mining' %}{{ c.url | relative_url }}{% endif %}{% endfor %}">Big Data Analytics and Text Mining, Text Mining and LLMs module</a></h3>
    <span class="gf-role">Tutor, course led by Gianluca Moro</span>
    <span class="gf-years">A.Y. 2023–2026</span>
    <p>M.S. in Artificial Intelligence, University of Bologna. I run the labs (LLM prompting and fine-tuning, graph neural networks and knowledge graph embeddings, relational deep learning) and co-supervise the exam projects listed below.</p>
  </div>
</div>
</div>

<h2 class="gf-h2">thesis co-supervision</h2>

<div class="gf-count" markdown="0">
  <b data-gf-metric="theses.count">{{ site.data.metrics.theses | default: 57 }}</b>
  <span>Bachelor's and Master's theses on NLP and deep learning co-supervised at the University of Bologna, counted daily from <a id="gf-ams-link" href="https://amslaurea.unibo.it/">AMS Laurea</a>, the university's open-access thesis repository.</span>
</div>
<div class="gf-shell" id="gf-thesis-shell" markdown="0">
  <div class="gf-term-bar" aria-hidden="true"><i></i><i></i><i></i><span>amslaurea@unibo: ~</span></div>
  <div class="gf-shell-out" aria-live="polite"><span class="d"># theses per year appear after the first daily update</span></div>
  <div class="gf-shell-status">Hover a year for the Bachelor's and Master's split.</div>
</div>

<h3>Selected theses</h3>

<ul class="gf-theses" id="gf-selected-theses" markdown="0">
{% for t in site.data.theses_selected %}
  <li data-surname="{{ t.surname }}">
    <span class="t">{{ t.title }}</span>
    <span class="m">{{ t.name }} ({{ t.year }}){% if t.degree %}. <span class="d">{{ t.degree }}</span>{% endif %}{% if t.note %}. <b>{{ t.note }}</b>{% endif %}</span>
  </li>
{% endfor %}
</ul>

<details class="gf-all" id="gf-all-theses" hidden markdown="0">
  <summary>Show all theses from AMS Laurea</summary>
  <ol></ol>
</details>

<h2 class="gf-h2">supervised exam projects</h2>

A selection of the exam projects (6 CFU) and project works (3 CFU) I co-supervised in *Big Data Analytics and Text Mining*, a course attended by more than 80 students per year. Each topic is agreed with the student, and several grow into theses and papers.

{% for group in site.data.student_projects %}
<h3>A.Y. {{ group.year }} <small class="gf-note">(a selection)</small></h3>
<div class="gf-topics" markdown="0">
  {% for p in group.items %}
  <div class="gf-reveal"><b>{{ p.title }}</b><span>{{ p.text }}</span><em>{{ p.kind }}</em></div>
  {% endfor %}
</div>
{% endfor %}

<h2 class="gf-h2">international thesis committees</h2>

- **Universidad Técnica Federico Santa María (UTFSM)**, Valparaíso, Chile (2026). External member of the thesis committee for the *Magíster en Ciencias de la Ingeniería Informática*: written evaluation of the dissertation and participation in the oral defense (counterfactual explanations, explainable AI, NLP).

<script src="{{ '/assets/extras/teaching.js' | relative_url }}?v={{ site.time | date: '%s' }}" defer></script>
