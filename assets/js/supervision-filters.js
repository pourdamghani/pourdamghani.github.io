(function () {
  "use strict";

  var root = document.querySelector(".supervision-filter-root");

  if (!root) return;

  var sections = Array.prototype.slice.call(
    root.querySelectorAll(".filterable-supervision-section")
  );
  var entries = Array.prototype.slice.call(
    root.querySelectorAll(".supervision-entry")
  );
  var metaTags = root.querySelectorAll(".supervision-entry__meta span");
  var activeFilter = "";

  if (!entries.length || !metaTags.length) return;

  metaTags.forEach(function (tag) {
    var button = document.createElement("button");
    button.type = "button";
    button.className = "supervision-tag";
    button.textContent = tag.textContent.trim();
    button.setAttribute("aria-pressed", "false");
    button.setAttribute("aria-label", "Show students tagged " + button.textContent);
    tag.replaceWith(button);
  });

  var controls = document.createElement("div");
  controls.className = "supervision-filter-status";
  controls.setAttribute("aria-live", "polite");
  controls.hidden = true;

  var status = document.createElement("span");
  var clearButton = document.createElement("button");
  clearButton.type = "button";
  clearButton.className = "supervision-filter-clear";
  clearButton.textContent = "Clear filter";
  controls.appendChild(status);
  controls.appendChild(clearButton);
  root.insertBefore(controls, root.firstElementChild);

  function applyFilter(filter) {
    activeFilter = filter;
    var visibleCount = 0;

    entries.forEach(function (entry) {
      var tags = Array.prototype.map.call(
        entry.querySelectorAll(".supervision-tag"),
        function (tag) {
          return tag.textContent.trim();
        }
      );
      var matches = !activeFilter || tags.indexOf(activeFilter) !== -1;
      entry.hidden = !matches;
      if (matches) visibleCount += 1;
    });

    sections.forEach(function (section) {
      var hasVisibleEntry = Array.prototype.some.call(
        section.querySelectorAll(".supervision-entry"),
        function (entry) {
          return !entry.hidden;
        }
      );
      section.hidden = !hasVisibleEntry;
    });

    root.querySelectorAll(".supervision-tag").forEach(function (tag) {
      var selected = activeFilter && tag.textContent.trim() === activeFilter;
      tag.setAttribute("aria-pressed", selected ? "true" : "false");
    });

    controls.hidden = !activeFilter;
    status.textContent = activeFilter
      ? "Showing " + visibleCount + " of " + entries.length +
        " students tagged “" + activeFilter + "”."
      : "";
  }

  root.addEventListener("click", function (event) {
    var tag = event.target.closest(".supervision-tag");
    if (!tag || !root.contains(tag)) return;

    var selectedFilter = tag.textContent.trim();
    applyFilter(selectedFilter === activeFilter ? "" : selectedFilter);
  });

  clearButton.addEventListener("click", function () {
    var activeTag = root.querySelector('.supervision-tag[aria-pressed="true"]');
    applyFilter("");
    (activeTag || root.querySelector(".supervision-tag")).focus();
  });
})();
