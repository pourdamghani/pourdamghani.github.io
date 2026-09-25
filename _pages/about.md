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
        <p>I am Arash, a postdoctoral researcher at the <a href="https://inet-tub.github.io/">INET</a> research group at the Technical University of Berlin, Germany, working with <a href="https://schmiste.github.io/">Prof. Stefan Schmid</a>. Furthermore, I am an associated researcher with the PLAMADISO research group at the Weizenbaum Institute for the Networked Society. I received my PhD in Computer Science from TU Berlin in September 2026. Previously I was a researcher at the University of Vienna and completed research internships at IST Austria and CUHK Hong Kong.</p>
        <p>I have been previously received awards such as MacCracken PhD Fellowship, Oxford Berlin Research Partnership Flexible Funds, and has been partner in GeCo seed funding and BeeFAIRChain praxis-sprint funding from German agencies, among others.</p>
        <p class="home-hero__intro">I am interested in algorithm design and analysis with applications in networks, distributed systems, and blockchains. My particular focus is on demand-aware and self-adjusting networks.</p>
        <p>Academic email: lastname (at) tu-berlin (dot) de</p>
        <p>Personal email: firstname (at) lastname (dot) net</p>
      </div>
      <div class="home-hero__actions">
        <a class="home-button home-button--primary" href="#publications">Selected Publications <span aria-hidden="true">→</span></a>
        <a class="home-button" href="/Arash_Pourdamghani_CV.pdf">Download my CV <span aria-hidden="true">↓</span></a>
      </div>
      <nav class="home-profile-links" aria-label="Academic and social profiles">
        <a href="{{ metadata.author.googlescholar }}">Google Scholar</a>
        <a href="{{ metadata.author.orcid }}">ORCID</a>
        <a href="https://github.com/{{ metadata.author.github }}">Github</a>
        <a href="https://www.linkedin.com/in/{{ metadata.author.linkedin }}">LinkedIn</a>
      </nav>
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
    <header class="home-section-heading"><div><h2 id="publications-title">Publications</h2></div></header>
    <div class="home-section-embed home-section-embed--publications">{{ includePage('/publications/') }}</div>
  </div>
</section>

<section class="home-content-section home-anchor" id="supervision" aria-labelledby="supervision-title">
  <div class="home-shell">
    <header class="home-section-heading"><div><h2 id="supervision-title">Supervision</h2></div></header>
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
    <div class="home-section-embed">{{ includePage('/tools/') }}</div>
  </div>
</section>

<section class="home-content-section home-content-section--cv home-anchor" id="cv" aria-labelledby="cv-title">
  <div class="home-shell">
    <header class="home-section-heading"><div><h2 id="cv-title">CV</h2></div></header>
    <div class="home-section-embed">{{ includePage('/cv/') }}</div>
  </div>
</section>
