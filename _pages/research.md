---
layout: page.njk
permalink: /publications/
title: ""
excerpt: "Publications of Arash Pourdamghani"
author_profile: true
---

I am interested in algorithm design and analysis with applications in networks, distributed systems, and blockchains. My particular focus is on [self-adjusting networks](https://self-adjusting.net/).

In theoretical computer science, authors are sorted alphabetically by default.

{% from "publication-card.njk" import pubCard %}
{% for section in publications.sections %}
  {% set section_id = section.title | slugify %}
  <section class="research-section research-section--cards" id="{{ section_id }}">
    <h2>{{ section.title }}</h2>
    <div class="publication-grid">
      {% for pub in section.items %}
        {{ pubCard(pub) }}
      {% endfor %}
    </div>
  </section>
{% endfor %}
