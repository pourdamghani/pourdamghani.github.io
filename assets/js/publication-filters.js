(function () {
  "use strict";

  var selectors = document.querySelectorAll(".publication-topic-selector");

  selectors.forEach(function (selector) {
    var container = selector.nextElementSibling;
    if (!container || !container.classList.contains("publication-filter-root")) return;

    var buttons = selector.querySelectorAll("[data-publication-topic]");
    var sections = container.querySelectorAll("[data-publication-section]");

    selector.addEventListener("click", function (event) {
      var button = event.target.closest("[data-publication-topic]");
      if (!button || !selector.contains(button)) return;

      var topic = button.dataset.publicationTopic;

      buttons.forEach(function (candidate) {
        var selected = candidate === button;
        candidate.classList.toggle("is-active", selected);
        candidate.setAttribute("aria-pressed", selected ? "true" : "false");
      });

      sections.forEach(function (section) {
        section.hidden = topic !== "all" && section.dataset.publicationSection !== topic;
      });
    });
  });
})();
