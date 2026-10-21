(function () {
  "use strict";

  var root = document.querySelector(".funding-filter-root");
  if (!root) return;

  var scope = root.closest("#grants") || root;
  var buttons = scope.querySelectorAll("[data-funding-type]");
  var sections = root.querySelectorAll("[data-funding-section]");

  scope.addEventListener("click", function (event) {
    var button = event.target.closest("[data-funding-type]");
    if (!button || !scope.contains(button)) return;

    var type = button.dataset.fundingType;

    buttons.forEach(function (candidate) {
      var selected = candidate.dataset.fundingType === type;
      candidate.classList.toggle("is-active", selected);
      candidate.setAttribute("aria-pressed", selected ? "true" : "false");
    });

    sections.forEach(function (section) {
      section.hidden = type !== "all" && section.dataset.fundingSection !== type;
    });
  });
})();
