---
layout: page
title: blog
permalink: /blog/
description: Occasional notes on research life, teaching, the things I build, and whatever happens to be on my mind :)
nav: true
nav_order: 5
---

<ul class="gf-blog" markdown="0">
{% for post in site.posts %}
  <li class="gf-reveal">
    <a class="gf-pub-fig gf-plain" href="{{ post.url | relative_url }}" aria-hidden="true" tabindex="-1">
      {% if post.thumbnail %}<img src="{{ post.thumbnail | relative_url }}" alt="" loading="lazy" style="object-fit:cover">{% endif %}
    </a>
    <div>
      <time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: "%b %-d, %Y" }}</time>
      <h3><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h3>
      <p>{{ post.description }}</p>
      {% if post.tags %}<div class="gf-tags">{% for t in post.tags %}#{{ t }} {% endfor %}</div>{% endif %}
    </div>
  </li>
{% endfor %}
</ul>
