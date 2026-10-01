---
layout: page
title: news
permalink: /news/
description: Every announcement since 2020, newest first. Filter by year or search.
nav: false
---

<div class="gf-filter" id="gf-newsfilter" role="toolbar" aria-label="Filter news" markdown="0">
  <input type="search" id="gf-newsq" placeholder="search news..." aria-label="Search news">
</div>

<div id="gf-news" markdown="0">
{% assign items = site.news | reverse %}
{% assign groups = items | group_by_exp: "n", "n.date | date: '%Y'" %}
{% for g in groups %}
  <section data-year="{{ g.name }}">
    <h2 class="gf-news-year">{{ g.name }}</h2>
    <ul class="gf-news-list">
    {% for item in g.items %}
      <li class="gf-reveal">
        <time datetime="{{ item.date | date_to_xmlschema }}">{{ item.date | date: "%b %-d, %Y" }}</time>
        {% if item.inline %}<p>{{ item.content | remove: '<p>' | remove: '</p>' | strip }}</p>{% else %}<p><a href="{{ item.url | relative_url }}">{{ item.title }}</a></p>{% endif %}
      </li>
    {% endfor %}
    </ul>
  </section>
{% endfor %}
</div>

<script>
(function () {
  var bar = document.getElementById("gf-newsfilter"), q = document.getElementById("gf-newsq");
  var secs = Array.prototype.slice.call(document.querySelectorAll("#gf-news section"));
  var year = "all";
  var html = '<button type="button" aria-pressed="true" data-y="all">All</button>' + secs.map(function (s) {
    return '<button type="button" aria-pressed="false" data-y="' + s.dataset.year + '">' + s.dataset.year + "<small>" + s.querySelectorAll("li").length + "</small></button>";
  }).join("");
  q.insertAdjacentHTML("beforebegin", html);
  function apply() {
    var t = q.value.trim().toLowerCase();
    secs.forEach(function (s) {
      var any = false;
      s.querySelectorAll("li").forEach(function (li) { var ok = (year === "all" || s.dataset.year === year) && (!t || li.textContent.toLowerCase().indexOf(t) >= 0); li.hidden = !ok; if (ok) { any = true; li.classList.add("gf-in"); } });
      s.hidden = !any;
    });
  }
  bar.addEventListener("click", function (e) { var b = e.target.closest("button"); if (!b) return; year = b.dataset.y; bar.querySelectorAll("button").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); }); apply(); });
  q.addEventListener("input", apply);
})();
</script>
