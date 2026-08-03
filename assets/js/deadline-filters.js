(function () {
  "use strict";

  var form = document.getElementById("deadline-filters");
  if (!form) return;

  var queryInput = document.getElementById("deadline-search");
  var fromInput = document.getElementById("deadline-from");
  var toInput = document.getElementById("deadline-to");
  var rankInput = document.getElementById("deadline-rank");
  var status = document.getElementById("deadline-filter-status");
  var emptyState = document.getElementById("deadline-filter-empty");
  var rows = Array.prototype.slice.call(document.querySelectorAll("[data-deadline-row]"));
  var groups = Array.prototype.slice.call(document.querySelectorAll("[data-deadline-group]"));
  var topics = Array.prototype.slice.call(document.querySelectorAll("[data-deadline-topic]"));
  var openBeforeFiltering = [];
  var wasFiltering = false;

  function normalize(value) {
    return String(value || "").toLocaleLowerCase().trim();
  }

  function applyFilters() {
    var query = normalize(queryInput.value);
    var from = fromInput.value;
    var to = toInput.value;
    var rank = rankInput.value;
    var hasInvalidRange = Boolean(from && to && from > to);
    var isFiltering = Boolean(query || from || to || rank);
    var visibleCount = 0;

    toInput.setCustomValidity(hasInvalidRange ? "The end date must be on or after the start date." : "");

    rows.forEach(function (row) {
      var matchesName = !query || normalize(row.dataset.title).indexOf(query) !== -1 || normalize(row.dataset.acronym).indexOf(query) !== -1;
      var matchesRank = !rank || row.dataset.rank === rank;
      var deadline = row.dataset.deadline;
      var matchesDate = hasInvalidRange || ((!from || (deadline && deadline >= from)) && (!to || (deadline && deadline <= to)));
      var matches = matchesName && matchesRank && matchesDate;

      row.hidden = !matches;
      if (matches) visibleCount += 1;
    });

    groups.forEach(function (group) {
      group.hidden = !group.querySelector("[data-deadline-row]:not([hidden])");
    });

    if (isFiltering && !wasFiltering) {
      openBeforeFiltering = topics.map(function (topic) { return topic.open; });
    }

    topics.forEach(function (topic, index) {
      var hasMatches = Boolean(topic.querySelector("[data-deadline-group]:not([hidden])"));
      topic.hidden = !hasMatches;

      if (isFiltering && hasMatches) {
        topic.open = true;
      } else if (!isFiltering && wasFiltering) {
        topic.open = openBeforeFiltering[index];
      }
    });

    wasFiltering = isFiltering;
    emptyState.hidden = visibleCount !== 0;

    if (hasInvalidRange) {
      status.textContent = "Start date must be on or before end date. Showing matches for name and rank only.";
    } else {
      status.textContent = "Showing " + visibleCount + " of " + rows.length + " deadlines.";
    }
  }

  form.addEventListener("input", applyFilters);
  form.addEventListener("change", applyFilters);
  form.addEventListener("reset", function () {
    window.setTimeout(applyFilters, 0);
  });

  applyFilters();
})();
