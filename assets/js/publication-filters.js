(function () {
  "use strict";

  var selectors = document.querySelectorAll(".publication-topic-selector");

  selectors.forEach(function (selector) {
    var homeSection = selector.closest("#publications");
    var container = homeSection
      ? homeSection.querySelector(".publication-filter-root")
      : selector.nextElementSibling;
    if (!container || !container.classList.contains("publication-filter-root")) return;

    var linkedSelectors = homeSection
      ? homeSection.querySelectorAll(".publication-topic-selector")
      : [selector];
    var sections = container.querySelectorAll("[data-publication-section]");

    selector.addEventListener("click", function (event) {
      var button = event.target.closest("[data-publication-topic]");
      if (!button || !selector.contains(button)) return;

      var topic = button.dataset.publicationTopic;

      linkedSelectors.forEach(function (linkedSelector) {
        linkedSelector.querySelectorAll("[data-publication-topic]").forEach(function (candidate) {
          var selected = candidate.dataset.publicationTopic === topic;
          candidate.classList.toggle("is-active", selected);
          candidate.setAttribute("aria-pressed", selected ? "true" : "false");
        });
      });

      sections.forEach(function (section) {
        section.hidden = topic !== "all" && section.dataset.publicationSection !== topic;
      });
    });
  });
})();
