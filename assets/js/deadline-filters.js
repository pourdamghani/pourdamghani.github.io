(function () {
  "use strict";

  var form = document.getElementById("deadline-filters");
  if (!form) return;

  var queryInput = document.getElementById("deadline-search");
  var fromInput = document.getElementById("deadline-from");
  var toInput = document.getElementById("deadline-to");
  var rankInput = document.getElementById("deadline-rank");
  var currentOnlyInput = document.getElementById("deadline-current-only");
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
  var refreshTimer;

  // A deadline dated YYYY-MM-DD remains current until 23:59:59 in AoE
  // (UTC-12). Its first passed instant is therefore 12:00 UTC the next day.
  function aoeExpiry(isoDate) {
    var match = String(isoDate || "").match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!match) return null;

    return Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]) + 1, 12, 0, 0);
  }

  function markDeadlinePassed(row) {
    var topic = row.closest("[data-deadline-topic]");
    var futureBody = topic && topic.querySelector('[data-deadline-group="future"] tbody');
    var deadlineCell = row.querySelector(".deadline-row__deadline");
    var previousCell = row.querySelector(".deadline-row__previous");
    var expiredDeadline = row.dataset.deadline;
    var deadlineSource = row.dataset.deadlineSource;

    if (!futureBody || !deadlineCell || !expiredDeadline) return;

    row.dataset.deadlineKind = "future";
    row.dataset.deadline = "";
    row.dataset.deadlinePassed = "true";
    deadlineCell.textContent = "Not announced";

    var verification = document.createElement("span");
    verification.className = "deadline-estimate";
    verification.appendChild(document.createTextNode("Last verified: "));

    var sourceLink = document.createElement("a");
    sourceLink.href = deadlineSource;
    var date = document.createElement("time");
    date.dateTime = expiredDeadline;
    date.textContent = expiredDeadline;
    sourceLink.appendChild(date);
    verification.appendChild(sourceLink);
    deadlineCell.appendChild(verification);

    if (previousCell) previousCell.remove();
    futureBody.appendChild(row);
  }

  function refreshDeadlineKinds() {
    var now = Date.now();
    var nextExpiry = null;

    rows.forEach(function (row) {
      if (row.dataset.deadlineKind !== "current") return;

      var expiry = aoeExpiry(row.dataset.deadline);
      if (expiry !== null && now >= expiry) {
        markDeadlinePassed(row);
      } else if (expiry !== null && (nextExpiry === null || expiry < nextExpiry)) {
        nextExpiry = expiry;
      }
    });

    window.clearTimeout(refreshTimer);
    var untilNextCheck = nextExpiry === null ? 86400000 : Math.min(86400000, Math.max(1000, nextExpiry - now + 1000));
    refreshTimer = window.setTimeout(function () {
      refreshDeadlineKinds();
      applyFilters();
    }, untilNextCheck);
  }

  function normalize(value) {
    return String(value || "").toLocaleLowerCase().trim();
  }

  function clearResults(container) {
    while (container.firstChild) container.removeChild(container.firstChild);
  }

  function setHidden(element, hidden) {
    element.hidden = hidden;
    element.style.display = hidden ? "none" : "";
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
    var currentOnly = currentOnlyInput.checked;
    var hasInvalidRange = Boolean(from && to && from > to);
    var isFiltering = Boolean(query || from || to || rank || currentOnly);
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
      var matchesKind = !currentOnly || row.dataset.deadlineKind === "current";
      var deadline = row.dataset.deadline;
      var matchesDate = hasInvalidRange || ((!from || (deadline && deadline >= from)) && (!to || (deadline && deadline <= to)));
      var matches = matchesName && matchesRank && matchesKind && matchesDate;

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
      setHidden(group, groupRows.length === 0);
    });

    if (isFiltering && !wasFiltering) {
      openBeforeFiltering = topics.map(function (topic) { return topic.open; });
    }

    topics.forEach(function (topic, index) {
      setHidden(topic, isFiltering);

      if (!isFiltering && wasFiltering) {
        topic.open = openBeforeFiltering[index];
      }
    });

    setHidden(results, !isFiltering);
    setHidden(currentResults, currentCount === 0);
    setHidden(futureResults, futureCount === 0);
    wasFiltering = isFiltering;
    setHidden(emptyState, !isFiltering || visibleCount !== 0);

    if (hasInvalidRange) {
      status.textContent = "Start date must be on or before end date. Showing matches for the other filters only.";
    } else {
      status.textContent = "Showing " + visibleCount + " of " + rows.length + " deadlines.";
    }
  }

  form.addEventListener("input", applyFilters);
  form.addEventListener("change", applyFilters);
  form.addEventListener("reset", function () {
    window.setTimeout(applyFilters, 0);
  });

  refreshDeadlineKinds();
  applyFilters();
})();
