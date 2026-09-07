---
layout: page.njk
permalink: /talks/thesis/
title: Thesis
excerpt: "PhD defense: Demand-Aware Networks — Design, Adjust & Update."
author_profile: true
section_links:
  - Teaser
  - Slides
  - Video
  - Manuscript
  - Get in touch
  - References
# Set this to the video ID from your YouTube link (the part after v= or youtu.be/).
youtube_id: "Ad_5JZdkf1Q"
---

I defended my PhD thesis, *Demand-Aware Networks: Design, Adjust & Update*, at TU Berlin on 2 September 2026 and received the grade **very good with distinction (summa cum laude)**.

<h2 id="teaser">Teaser</h2>

Here is an overview of the chapters covered in the main body of the presentation.

<a href="/assets/thesis/lifecycle-overview.png"><img class="thesis-teaser" src="/assets/thesis/lifecycle-overview.png" alt="3×3 thesis summary: Design, Adjust, and Update, with their chapters, demand structures, and technological enablers." width="1920" height="1080"></a>

Here are the remaining chapters discussed during the Q&A session.

<a href="/assets/thesis/other-papers.png"><img class="thesis-teaser" src="/assets/thesis/other-papers.png" alt="Three further thesis papers: demand-aware multicast, SeedTree, and software-defined reconfigurable intelligent surfaces." width="1920" height="1080" loading="lazy"></a>

<h2 id="slides">Slides</h2>

These are the main slides used during my PhD thesis presentation.

Click inside the viewer and **use your keyboard’s ← and → arrow keys** to move back and forth between slides. You can also use the arrow buttons in the viewer. [Open the slides in a full window](/assets/thesis/slides/index.html).

<iframe class="thesis-embed" src="/assets/thesis/slides/index.html" title="Interactive PhD thesis slides" loading="lazy" allow="autoplay; fullscreen" allowfullscreen></iframe>

Created with [Manim Slides](https://manim-slides.eertmans.be/) and [Manim Community](https://www.manim.community/).

<h2 id="video">Video</h2>

I made this recording after my PhD defense, as recording during the defense was not permitted under TUB regulations.

The recording may be updated in the near future.

{% if youtube_id %}
<iframe class="thesis-embed fitvidsignore" src="https://www.youtube-nocookie.com/embed/{{ youtube_id | escape }}" title="PhD thesis defense recording" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
{% else %}
<div class="thesis-video-placeholder" role="img" aria-label="YouTube player placeholder. Presentation recording coming soon.">
  <svg viewBox="0 0 68 48" width="68" height="48" aria-hidden="true"><rect width="68" height="48" rx="12" fill="#f03"/><path d="M27 14v20l18-10z" fill="#fff"/></svg>
  <span>Presentation recording coming soon.</span>
</div>
{% endif %}

<h2 id="manuscript">Manuscript</h2>

The manuscript will be added soon, once the official procedures at TU Berlin are complete.

<h2 id="get-in-touch">Get in touch</h2>

If you are interested in this talk, please reach out to me. I would be more than happy to present it to your group or build on the ideas discussed here.

<h2 id="references">References</h2>

- [SpiderDAN: Matching Augmentation in Demand-Aware Networks](/ALENEX25.pdf). ALENEX 2025. ([Brief announcement, SPAA 2024](/spaa24ba.pdf).)
- [Hash & Adjust: Competitive Demand-Aware Consistent Hashing](/OPODIS24.pdf). OPODIS 2024.
- [The Augmentation-Speed Tradeoff for Consistent Network Updates](/SOSR22.pdf). SOSR 2022.
- [Demand-Aware Multi-Source IP-Multicast: Minimal Congestion via Link Weight Optimization](/IFIP25.pdf). IFIP NETWORKING 2025.
- [SeedTree: A Dynamically Optimal and Local Self-Adjusting Tree](/INFOCOM23SeedTree.pdf). INFOCOM 2023.
- [Software-Defined Reconfigurable Intelligent Surfaces: From Theory to End-to-End Implementation](/PIEEE22.pdf). Proceedings of the IEEE, 2022.
