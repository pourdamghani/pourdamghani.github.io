---
layout: home.njk
permalink: /
title: ""
excerpt: "About me"
templateEngineOverride: njk
---

{% macro includePage(url) %}
  {% for entry in collections.all %}
    {% if entry.url == url %}
      {{ entry.templateContent | safe }}
    {% endif %}
  {% endfor %}
{% endmacro %}

<section class="home-hero home-anchor" id="about" aria-labelledby="about-title">
  <div class="home-shell home-hero__grid">
    <div class="home-hero__copy">
      <h1 id="about-title"><span>Dr.</span> Arash Pourdamghani</h1>
      <p class="home-hero__role">Postdoctoral researcher <span aria-hidden="true">·</span> TU Berlin</p>
      <div class="home-hero__rule" aria-hidden="true"></div>
      <div class="home-hero__bio">
        <p>I am Arash, a postdoctoral researcher at the <a href="https://inet.tu-berlin.de/">INET</a> research group at the Technical University of Berlin, Germany, working with <a href="https://schmiste.github.io/">Prof. Stefan Schmid</a>. I am also an associated researcher with the PLAMADISO research group at the Weizenbaum Institute for the Networked Society. I received my PhD in Computer Science from TU Berlin in September 2026. Previously I was a researcher at the University of Vienna and completed research internships at IST Austria and CUHK Hong Kong.</p>
        <p>I have been previously received awards such as MacCracken PhD Fellowship, Oxford Berlin Research Partnership Flexible Funds, and has been partner in GeCo seed funding and BeeFAIRChain praxis-sprint funding from German agencies, among others.</p>
        <p class="home-hero__intro">I am interested in algorithm design and analysis with applications in networks, distributed systems, and blockchains. My particular focus is on demand-aware and self-adjusting networks.</p>
      </div>
    </div>

    <div class="home-portrait" aria-label="Portrait of Arash Pourdamghani">
      <svg class="home-portrait__network" viewBox="0 0 620 560" aria-hidden="true">
        <g fill="none" stroke="currentColor" stroke-width="1.2">
          <path d="M35 356 142 243 223 336 335 190 454 277 584 150"/>
          <path d="M65 190 142 243 216 92 335 190 411 70 584 150"/>
          <path d="M223 336 359 442 454 277 565 408"/>
        </g>
        <g fill="currentColor">
          <circle cx="35" cy="356" r="7"/><circle cx="65" cy="190" r="5"/>
          <circle cx="142" cy="243" r="7"/><circle cx="216" cy="92" r="6"/>
          <circle cx="223" cy="336" r="6"/><circle cx="335" cy="190" r="7"/>
          <circle cx="359" cy="442" r="5"/><circle cx="411" cy="70" r="6"/>
          <circle cx="454" cy="277" r="7"/><circle cx="565" cy="408" r="6"/>
          <circle cx="584" cy="150" r="7"/>
        </g>
      </svg>
      <div class="home-portrait__frame">
        <img src="/images/profile.png" alt="Arash Pourdamghani" width="586" height="578">
      </div>
      <nav class="home-profile-links" aria-label="Academic and social profiles">
        <a href="{{ metadata.author.googlescholar }}" aria-label="Google Scholar" title="Google Scholar"><i class="fas fa-graduation-cap" aria-hidden="true"></i></a>
        <a href="https://www.linkedin.com/in/{{ metadata.author.linkedin }}" aria-label="LinkedIn" title="LinkedIn"><i class="fab fa-linkedin" aria-hidden="true"></i></a>
        <a href="{{ metadata.author.orcid }}" aria-label="ORCID" title="ORCID"><i class="ai ai-orcid-square" aria-hidden="true"></i></a>
        <a href="{{ metadata.author.dblp }}" aria-label="DBLP" title="DBLP"><span class="profile-brand profile-brand--dblp" aria-hidden="true">d</span></a>
        <a href="{{ metadata.author.youtube }}" aria-label="YouTube" title="YouTube"><i class="fab fa-youtube" aria-hidden="true"></i></a>
        <a href="{{ metadata.author.mastodon }}" aria-label="Mastodon" title="Mastodon"><i class="fab fa-mastodon" aria-hidden="true"></i></a>
        <a href="{{ metadata.author.bluesky }}" aria-label="Bluesky" title="Bluesky">
          <svg class="profile-brand profile-brand--bluesky" viewBox="0 0 24 24" aria-hidden="true"><path d="M5.2 3.1C8 5.2 11 9.4 12 11.7c1-2.3 4-6.5 6.8-8.6 2-1.5 5.2-2.7 5.2 1 0 .8-.5 6.2-.8 7.1-.9 3-4.1 3.7-7 3.2 5.1.9 6.4 3.8 3.6 6.7-5.3 5.4-7.1-1.4-7.7-3.2-.1-.4-.2-.6-.2-.5 0-.1-.1.1-.2.5-.6 1.8-2.4 8.6-7.7 3.2-2.8-2.9-1.5-5.8 3.6-6.7-2.9.5-6.1-.2-7-3.2C.3 10.3-.2 4.9-.2 4.1c0-3.7 3.2-2.5 5.4-1Z" transform="translate(.3 0) scale(.96)"/></svg>
        </a>
      </nav>
      <div class="home-portrait__contact">
        <p title="Academic email"><i class="fas fa-university" aria-hidden="true"></i><span>lastname (at) tu-berlin (dot) de</span></p>
        <p title="Personal email"><i class="fas fa-envelope" aria-hidden="true"></i><span>firstname (at) lastname (dot) net</span></p>
      </div>
    </div>
  </div>
</section>

<section class="home-news home-anchor" id="news" aria-labelledby="news-title">
  <div class="home-shell">
    <header class="home-section-heading home-section-heading--compact">
      <div><h2 id="news-title">Recent News</h2></div>
    </header>
    <div class="home-news__list">
      <article><p>I defended my PhD thesis, <em>Demand-Aware Networks: Design, Adjust &amp; Update</em>, at TU Berlin on 2 September 2026 and received the grade <strong>with distinction (summa cum laude).</strong> See my slides, presentation video, and my thesis <a href="/talks/thesis/">here</a>.</p></article>
      <article><p>Our project, BeeFAIRChain, has just been fully accepted as part of DATIpilot <a href="https://bioblock-community.org/event-cp3-cp5.html">BioBlock Innovationscommunity</a>, funded by Federal Ministry for Research, Technology and Space (BMFTR) in Germany.</p></article>
      <article><p>We have just been awarded <a href="https://www.berlin-university-alliance.de/en/commitments/international/oxford/news/251106-FFIX.html">Oxford Berlin Research Partnership Flexible Funds 2026</a>!</p></article>
      <article><p>Our paper "Rethinking Fronthaul Topologies for Cell-Free 6G Networks" has been accepted in <a href="https://icc2026.ieee-icc.org/">IEEE ICC 2026</a>!</p></article>
    </div>
  </div>
</section>

<section class="home-content-section home-anchor" id="publications" aria-labelledby="publications-title">
  <div class="home-shell">
    <header class="home-section-heading">
      <div>
        <h2 id="publications-title">Publications</h2>
        <div class="topic-selector publication-topic-selector" aria-label="Filter publications by topic">
          <span class="topic-selector__label">Browse by topic</span>
          <div class="topic-selector__options" role="group" aria-label="Publication topics">
            <button type="button" class="topic-selector__button is-active" data-publication-topic="all" aria-pressed="true">All topics</button>
            {% for section in publications.sections %}
              <button type="button" class="topic-selector__button" data-publication-topic="{{ section.title | slugify }}" aria-pressed="false">{{ section.title }}</button>
            {% endfor %}
          </div>
        </div>
      </div>
    </header>
    <div class="home-section-embed home-section-embed--publications">{{ includePage('/publications/') }}</div>
  </div>
</section>

<section class="home-content-section home-anchor" id="supervision" aria-labelledby="supervision-title">
  <div class="home-shell">
    <header class="home-section-heading">
      <div>
        <h2 id="supervision-title">Supervision</h2>
        <div class="topic-selector supervision-topic-selector" aria-label="Filter supervision by group">
          <span class="topic-selector__label">Browse by group</span>
          <div class="topic-selector__options" role="group" aria-label="Supervision groups">
            <button type="button" class="topic-selector__button is-active" data-supervision-group="all" aria-pressed="true">All students</button>
            <button type="button" class="topic-selector__button" data-supervision-group="theses" aria-pressed="false">Thesis supervision</button>
            <button type="button" class="topic-selector__button" data-supervision-group="interns" aria-pressed="false">Research interns</button>
          </div>
        </div>
      </div>
    </header>
    <div class="home-section-embed">{{ includePage('/supervision/') }}</div>
  </div>
</section>

<section class="home-content-section home-anchor" id="teaching" aria-labelledby="teaching-title">
  <div class="home-shell">
    <header class="home-section-heading"><div><h2 id="teaching-title">Teaching</h2></div></header>
    <div class="home-section-embed">{{ includePage('/teaching/') }}</div>
  </div>
</section>

<section class="home-content-section home-anchor" id="service" aria-labelledby="service-title">
  <div class="home-shell">
    <header class="home-section-heading"><div><h2 id="service-title">Service</h2></div></header>
    <div class="home-section-embed">{{ includePage('/service/') }}</div>
  </div>
</section>

<section class="home-content-section home-anchor" id="talks" aria-labelledby="talks-title">
  <div class="home-shell">
    <header class="home-section-heading"><div><h2 id="talks-title">Talks</h2></div></header>
    <div class="home-section-embed">{{ includePage('/talks/') }}</div>
  </div>
</section>

<section class="home-content-section home-anchor" id="grants" aria-labelledby="grants-title">
  <div class="home-shell">
    <header class="home-section-heading"><div><h2 id="grants-title">Grants &amp; Awards</h2></div></header>
    <div class="home-section-embed">{{ includePage('/grants/') }}</div>
  </div>
</section>

<section class="home-content-section home-content-section--tools home-anchor" id="tools" aria-labelledby="tools-title">
  <div class="home-shell">
    <header class="home-section-heading"><div><h2 id="tools-title">Tools</h2></div></header>
    <div class="home-section-embed">{% include "home-tools.njk" %}</div>
  </div>
</section>

<section class="home-content-section home-content-section--cv home-anchor" id="cv" aria-labelledby="cv-title">
  <div class="home-shell">
    <header class="home-section-heading"><div><h2 id="cv-title">CV</h2></div></header>
    <div class="home-section-embed">{{ includePage('/cv/') }}</div>
  </div>
</section>
