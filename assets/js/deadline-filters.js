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
  var results = document.getElementById("deadline-filter-results");
  var currentResults = document.getElementById("deadline-results-current");
  var futureResults = document.getElementById("deadline-results-future");
  var currentResultsBody = document.getElementById("deadline-results-current-body");
  var futureResultsBody = document.getElementById("deadline-results-future-body");
  var rows = Array.prototype.slice.call(document.querySelectorAll("[data-deadline-row]"));
  var groups = Array.prototype.slice.call(document.querySelectorAll("[data-deadline-group]"));
  var topics = Array.prototype.slice.call(document.querySelectorAll("[data-deadline-topic]"));
  var openBeforeFiltering = [];
  var wasFiltering = false;

  function normalize(value) {
    return String(value || "").toLocaleLowerCase().trim();
  }

  function clearResults(container) {
    while (container.firstChild) container.removeChild(container.firstChild);
  }

  function compareDeadlines(left, right) {
    var leftDeadline = left.dataset.deadline;
    var rightDeadline = right.dataset.deadline;

    if (!leftDeadline && rightDeadline) return 1;
    if (leftDeadline && !rightDeadline) return -1;
    if (leftDeadline !== rightDeadline) return leftDeadline < rightDeadline ? -1 : 1;

    return left.dataset.title.localeCompare(right.dataset.title);
  }

  function applyFilters() {
    var query = normalize(queryInput.value);
    var from = fromInput.value;
    var to = toInput.value;
    var rank = rankInput.value;
    var hasInvalidRange = Boolean(from && to && from > to);
    var isFiltering = Boolean(query || from || to || rank);
    var visibleCount = 0;
    var currentCount = 0;
    var futureCount = 0;
    var currentMatches = [];
    var futureMatches = [];

    toInput.setCustomValidity(hasInvalidRange ? "The end date must be on or after the start date." : "");
    clearResults(currentResultsBody);
    clearResults(futureResultsBody);

    rows.forEach(function (row) {
      var matchesName = !query || normalize(row.dataset.title).indexOf(query) !== -1 || normalize(row.dataset.acronym).indexOf(query) !== -1;
      var matchesRank = !rank || row.dataset.rank === rank;
      var deadline = row.dataset.deadline;
      var matchesDate = hasInvalidRange || ((!from || (deadline && deadline >= from)) && (!to || (deadline && deadline <= to)));
      var matches = matchesName && matchesRank && matchesDate;

      row.hidden = false;
      if (matches) {
        visibleCount += 1;

        if (isFiltering && row.dataset.deadlineKind === "current") {
          currentMatches.push(row);
        } else if (isFiltering) {
          futureMatches.push(row);
        }
      }
    });

    currentMatches.sort(compareDeadlines).forEach(function (row) {
      currentResultsBody.appendChild(row.cloneNode(true));
    });
    futureMatches.sort(compareDeadlines).forEach(function (row) {
      futureResultsBody.appendChild(row.cloneNode(true));
    });
    currentCount = currentMatches.length;
    futureCount = futureMatches.length;

    groups.forEach(function (group) {
      var body = group.querySelector("tbody");
      var groupRows = Array.prototype.slice.call(group.querySelectorAll("[data-deadline-row]"));

      groupRows.sort(compareDeadlines).forEach(function (row) {
        body.appendChild(row);
      });
      group.hidden = groupRows.length === 0;
    });

    if (isFiltering && !wasFiltering) {
      openBeforeFiltering = topics.map(function (topic) { return topic.open; });
    }

    topics.forEach(function (topic, index) {
      topic.hidden = isFiltering;

      if (!isFiltering && wasFiltering) {
        topic.open = openBeforeFiltering[index];
      }
    });

    results.hidden = !isFiltering;
    currentResults.hidden = currentCount === 0;
    futureResults.hidden = futureCount === 0;
    wasFiltering = isFiltering;
    emptyState.hidden = !isFiltering || visibleCount !== 0;

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
