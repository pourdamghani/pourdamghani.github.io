---
permalink: /research
title: ""
excerpt: "Publications of Arash Pourdamghani"
author_profile: true
redirect_from:
  - /publications
  - /publications/
  - /research/
---

I am interested in algorithm design and analysis with applications in networks, distributed systems, and blockchains. My particular focus is on [self-adjusting networks](https://self-adjusting.net/).

# Publications
In theoretical computer science, authors are sorted alphabetically by default.

{% for section in site.data.publications.sections %}
  {% assign section_id = section.title | slugify %}
  <section class="research-section research-section--cards" id="{{ section_id }}">
    <h2>{{ section.title }}</h2>
    <div class="publication-grid">
      {% for publication in section.items %}
        {% include publication-card.html publication=publication %}
      {% endfor %}
    </div>
  </section>
{% endfor %}
