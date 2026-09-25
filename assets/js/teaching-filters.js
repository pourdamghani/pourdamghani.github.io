(function () {
  "use strict";

  var section = document.querySelector(".filterable-teaching-section");
  if (!section) return;

  var entries = Array.prototype.slice.call(
    section.querySelectorAll(".supervision-entry")
  );
  var activeFilter = "";

  entries.forEach(function (entry) {
    var metaTags = entry.querySelectorAll(".supervision-entry__meta span");
    var typeTag = metaTags[metaTags.length - 1];
    if (!typeTag || metaTags.length < 2) return;

    var button = document.createElement("button");
    button.type = "button";
    button.className = "supervision-tag teaching-tag";
    button.textContent = typeTag.textContent.trim();
    button.setAttribute("aria-pressed", "false");
    button.setAttribute("aria-label", "Show teaching events tagged " + button.textContent);
    typeTag.replaceWith(button);
  });

  var controls = document.createElement("div");
  controls.className = "teaching-filter-status";
  controls.setAttribute("aria-live", "polite");
  controls.hidden = true;

  var status = document.createElement("span");
  var clearButton = document.createElement("button");
  clearButton.type = "button";
  clearButton.className = "teaching-filter-clear";
  clearButton.textContent = "Show all";
  controls.appendChild(status);
  controls.appendChild(clearButton);
  section.querySelector(".supervision-list").insertAdjacentElement("beforebegin", controls);

  function applyFilter(filter) {
    activeFilter = filter;
    var visibleCount = 0;

    entries.forEach(function (entry) {
      var type = entry.querySelector(".teaching-tag").textContent.trim();
      var matches = !activeFilter || type === activeFilter;
      entry.hidden = !matches;
      if (matches) visibleCount += 1;
    });

    section.querySelectorAll(".teaching-tag").forEach(function (tag) {
      var selected = activeFilter && tag.textContent.trim() === activeFilter;
      tag.setAttribute("aria-pressed", selected ? "true" : "false");
    });

    controls.hidden = !activeFilter;
    status.textContent = activeFilter
      ? "Showing " + visibleCount + " of " + entries.length +
        " events tagged “" + activeFilter + "”."
      : "";
  }

  section.addEventListener("click", function (event) {
    var tag = event.target.closest(".teaching-tag");
    if (!tag || !section.contains(tag)) return;

    var selectedFilter = tag.textContent.trim();
    applyFilter(selectedFilter === activeFilter ? "" : selectedFilter);
  });

  clearButton.addEventListener("click", function () {
    applyFilter("");
    section.querySelector(".teaching-tag").focus();
  });
})();
