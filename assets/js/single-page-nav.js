(function () {
  "use strict";

  var header = document.querySelector("[data-home-header]");
  var nav = document.querySelector(".home-nav");
  var links = Array.prototype.slice.call(document.querySelectorAll(".home-nav a, .home-header__cv[href^='#']"));
  var sections = links
    .map(function (link) {
      return document.querySelector(link.getAttribute("href"));
    })
    .filter(Boolean);
  var currentSection = "";
  var scrollTicking = false;

  if (!header || !links.length || !sections.length) return;

  function selectSection(id) {
    if (currentSection === id) return;
    currentSection = id;

    links.forEach(function (link) {
      var selected = link.getAttribute("href") === "#" + id;
      link.classList.toggle("is-active", selected);
      if (selected) {
        link.setAttribute("aria-current", "location");
        if (nav && nav.contains(link)) {
          nav.scrollTo({
            left: link.offsetLeft - (nav.clientWidth - link.offsetWidth) / 2,
            behavior: "smooth"
          });
        }
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  function syncSection() {
    var offset = header.offsetHeight + 36;
    var active = sections[0];

    sections.forEach(function (section) {
      if (section.getBoundingClientRect().top <= offset) active = section;
    });

    selectSection(active.id);
    header.classList.toggle("is-scrolled", window.scrollY > 12);
    scrollTicking = false;
  }

  links.forEach(function (link) {
    link.addEventListener("click", function (event) {
      var target = document.querySelector(link.getAttribute("href"));
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
        block: "start"
      });
      window.history.pushState(null, "", link.getAttribute("href"));
      selectSection(target.id);
    });
  });

  selectSection((window.location.hash || "#about").slice(1));
  syncSection();

  window.addEventListener("scroll", function () {
    if (scrollTicking) return;
    scrollTicking = true;
    window.requestAnimationFrame(syncSection);
  }, { passive: true });
})();
