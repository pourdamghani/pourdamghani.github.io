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
  var groupButtons = root.querySelectorAll("[data-supervision-group]");
  var activeFilter = "";
  var activeGroup = "all";

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
  var groupSelector = root.querySelector(".supervision-topic-selector");
  if (groupSelector) {
    groupSelector.insertAdjacentElement("afterend", controls);
  } else {
    root.insertBefore(controls, root.firstElementChild);
  }

  function applyFilter(filter) {
    activeFilter = filter;
    var visibleCount = 0;

    entries.forEach(function (entry) {
      var section = entry.closest("[data-supervision-section]");
      var matchesGroup = activeGroup === "all" ||
        (section && section.dataset.supervisionSection === activeGroup);
      var tags = Array.prototype.map.call(
        entry.querySelectorAll(".supervision-tag"),
        function (tag) {
          return tag.textContent.trim();
        }
      );
      var matchesTag = !activeFilter || tags.indexOf(activeFilter) !== -1;
      var matches = matchesGroup && matchesTag;
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

    groupButtons.forEach(function (button) {
      var selected = button.dataset.supervisionGroup === activeGroup;
      button.classList.toggle("is-active", selected);
      button.setAttribute("aria-pressed", selected ? "true" : "false");
    });

    controls.hidden = !activeFilter && activeGroup === "all";
    status.textContent = controls.hidden
      ? ""
      : "Showing " + visibleCount + " of " + entries.length + " students" +
        (activeFilter ? " tagged “" + activeFilter + "”" : "") + ".";
  }

  root.addEventListener("click", function (event) {
    var groupButton = event.target.closest("[data-supervision-group]");
    if (groupButton && root.contains(groupButton)) {
      activeGroup = groupButton.dataset.supervisionGroup;
      applyFilter(activeFilter);
      return;
    }

    var tag = event.target.closest(".supervision-tag");
    if (!tag || !root.contains(tag)) return;

    var selectedFilter = tag.textContent.trim();
    applyFilter(selectedFilter === activeFilter ? "" : selectedFilter);
  });

  clearButton.addEventListener("click", function () {
    var activeTag = root.querySelector('.supervision-tag[aria-pressed="true"]');
    activeGroup = "all";
    applyFilter("");
    (activeTag || root.querySelector(".supervision-tag")).focus();
  });

  applyFilter("");
})();
