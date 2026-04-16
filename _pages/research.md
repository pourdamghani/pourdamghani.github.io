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
New publications can be added in [_data/publications.yml](/Users/pourdamghani/Documents/GitHub/pourdamghani.github.io/_data/publications.yml). If you have a BibTeX file, place it in `_pages/` and set the card's `bibtex` field to that file path.

{% for section in site.data.publications.sections %}
<section class="research-section research-section--cards">
  <h2>{{ section.title }}</h2>
  <div class="publication-grid">
    {% for publication in section.items %}
      {% include publication-card.html publication=publication %}
    {% endfor %}
  </div>
</section>
{% endfor %}
