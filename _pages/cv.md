---
layout: single
title: "CV"
permalink: /cv/
author_profile: true
redirect_from:
  - /resume
---

{% include base_path %}

{% assign cv_pdf = "/_pages/Arash_Pourdamghani_CV.pdf" | relative_url %}

<p>
  <a href="{{ cv_pdf }}" style="display:inline-block;padding:10px 20px;border-radius:6px;text-decoration:none;background-color:#5AB1C1;color:#fff;">Download my CV</a>
</p>

<object data="{{ cv_pdf }}" type="application/pdf" width="100%" height="1100" style="border:1px solid #ddd;">
  <iframe src="{{ cv_pdf }}" width="100%" height="1100" style="border:1px solid #ddd;">
    <p>Your browser cannot display the CV inline. Please use the download link above.</p>
  </iframe>
</object>

Above is a 4-page version of my CV. \
For an alternative or updated version, please email me.
