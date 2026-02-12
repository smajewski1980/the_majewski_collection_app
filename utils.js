const utils = {
  /**
   * takes an HTML Element and toggle an inert state
   * @param {HTMLElement} el
   * @param {boolean} makeInert
   * @returns
   */
  toggleInertEl: (el, makeInert) => {
    if (makeInert) {
      el.inert = true;
      el.parentElement.style.opacity = ".5";
      return;
    }
    el.inert = false;
    el.parentElement.style.opacity = "1";
  },
  /**
   * this populates a select list with options created from a given array
   * @param {Array} arr
   * @param {HTMLSelectElement} selEl
   */
  populateSelectOptions: (arr, selEl) => {
    selEl.innerHTML = "";
    const opt = () => document.createElement("option");
    const emptyOpt = opt();
    selEl.appendChild(emptyOpt);

    arr.forEach((field) => {
      const newOpt = opt();
      if (field.includes("_")) {
        newOpt.value = field;
        newOpt.textContent = field.replace("_", " ").toUpperCase();
      } else {
        newOpt.value = field;
        newOpt.textContent = field.toUpperCase();
      }
      selEl.appendChild(newOpt);
    });
  },
  /**
   * this handles loading the options for the field
   * HTML select element when a format is selected
   * @param {Event} e
   * @param {HTMLSelectElement} field
   */
  handleFormatSelection: async (e, field) => {
    switch (e.target.value) {
      case "records":
        const recRes =
          await getFormatFields.getRecordsFields("getRecordsFields");
        utils.populateSelectOptions(recRes, field);
        utils.toggleInertEl(field, false);
        break;
      case "tapes":
        const tapesRes = await getFormatFields.getTapesFields("getTapesFields");
        utils.populateSelectOptions(tapesRes, field);
        utils.toggleInertEl(field, false);
        break;
      case "cds":
        const cdsRes = await getFormatFields.getCdsFields("getCdsFields");
        utils.populateSelectOptions(cdsRes, field);
        utils.toggleInertEl(field, false);
        break;
      case "cd_compilations":
        const cdCompilationsRes =
          await getFormatFields.getCdCompsFields("getCdCompsFields");
        utils.populateSelectOptions(cdCompilationsRes, field);
        utils.toggleInertEl(field, false);
        break;
      case "cd_singles":
        const cdSingRes =
          await getFormatFields.getCdSinglesFields("getCdSinglesFields");
        utils.populateSelectOptions(cdSingRes, field);
        utils.toggleInertEl(field, false);
        break;
      default:
        break;
    }
  },
  /**
   * prob need to be adjusted later
   * this takes the query vals and sends them to main.js
   * the results are then added to the results element
   * @param {Event} e
   * @param {String} format
   * @param {String} field
   * @param {String} term
   */
  handleLookupBtn: async (e, format, field, term, termEl) => {
    e.preventDefault();
    const vals = { format: format, field: field, term: term };

    // validate id or year are numbers
    if ((field === "id" || field === "year") && !parseInt(term)) {
      utils.displayNotFound(
        "Please enter a valid number to search by that field.",
      );
      return;
    }
    // validate that the year is lower than the current year and higher than 1885
    // (1885?... maybe have some grammophone discs someday...)
    if (field === "year") {
      const parsedYear = parseInt(term);
      const currentYear = new Date().getFullYear();

      if (1885 > parsedYear || parsedYear > currentYear) {
        utils.displayNotFound("Please enter a valid 4 digit year.");
        return;
      }
    }
    // check that the condition field only consists of 1-5 asterisks
    if (
      (field === "sleeve_condition" || field === "record_condition") &&
      !/^\*{1,5}$/.test(term)
    ) {
      utils.displayNotFound("Please enter 1-5 *'s to search by condition.");
      return;
    }

    // the needs repair field should only be a yes or no search term
    const needs_repair_valid = ["y", "yes", "n", "no"];
    if (
      format === "tapes" &&
      field === "needs_repair" &&
      !needs_repair_valid.includes(term.toLowerCase())
    ) {
      utils.displayNotFound("For that field, term must be yes(y) or no(n).");
      return;
    }

    // send data to main.js
    const res = await handleQueryValues.handleQueryValues(
      "handleQueryValues",
      vals,
    );
    // clear the results div
    utils.resultsElement.innerHTML = "";
    switch (format) {
      case "cds":
        utils.displayCdsMain(res, termEl);
        utils.currentCdsMainData = res;
        break;
      case "records":
        utils.displayRecords(res, termEl);
        utils.currentRecordsData = res;
        break;
      case "tapes":
        utils.displayTapes(res, termEl);
        utils.currentTapesData = res;
        break;
      default:
        break;
    }
  },
  /**
   * this gets and displays the cds main query results
   * @param {QueryResultRow} rows
   * @param {HTMLInputElement} termEl
   * @returns {void}
   */
  displayCdsMain: (rows, termEl) => {
    // if no results, show msg
    if (rows.length === 0) {
      utils.displayNotFound(`No matching results found for: ${termEl.value}`);
      return;
    }
    if (!termEl) {
      utils.resultsElement.innerHTML = "";
    }

    utils.resultsElement.append(utils.getHeader("CdsMain"));
    // loop through the results, make and append elements to display the data
    rows.forEach((row) => {
      const p = utils.makeP();

      Object.values(row).forEach((val, idx) => {
        p.append(utils.createLoadedSpan(val, idx));
      });

      utils.resultsElement.append(p);
    });

    utils.setArtistColWidths();
  },
  /**
   * this gets and displays the records query results
   * @param {QueryResultRow} rows
   * @param {HTMLInputElement} termEl
   * @returns {void}
   */
  displayRecords: (rows, termEl = null) => {
    // if no results, show msg
    if (rows.length === 0) {
      utils.displayNotFound(`No matching results found for: ${termEl.value}`);
      return;
    }
    if (!termEl) {
      utils.resultsElement.innerHTML = "";
    }
    // get and append the header
    utils.resultsElement.append(utils.getHeader("Records"));
    // loop through data and create elements
    rows.forEach((row) => {
      const details = utils.makeDetails();
      const summary = utils.makeSummary();
      const p = utils.makeP();
      // add the data to be always visible
      summary.append(
        utils.createLoadedSpan(row.id, 0),
        utils.createLoadedSpan(row.artist, 1),
        utils.createLoadedSpan(row.title, 2),
        utils.createLoadedSpan(row.location, 3),
      );
      details.append(summary);
      // add the data that is only shown when open
      const span1 = utils.makeSpan();
      const span2 = utils.makeSpan();
      const span3 = utils.makeSpan();
      const span4 = utils.makeSpan();
      const span5 = utils.makeSpan();
      span1.textContent = row.year;
      // if the label name doesnt end with the word records, add it. 78s exempt
      span2.textContent =
        !row.label.toLowerCase().includes("records") &&
        !row.location.includes("78s")
          ? row.label + " Records"
          : row.label;
      span3.textContent = row.diameter;
      span4.textContent = `Record Condition: ${row.record_condition}`;
      span5.textContent = `Sleeve Condition: ${row.sleeve_condition}`;
      p.append(span1, span2, span3, span4, span5);
      details.append(p);
      utils.resultsElement.append(details);
    });
    // adjust the second column widths for centering
    utils.setArtistColWidths();
  },
  /**
   * this gets and displays the tapes query results
   * @param {QueryResultRow} rows
   * @param {HTMLInputElement} termEl
   * @returns {void}
   */
  displayTapes: (rows, termEl) => {
    // if no results, show msg
    if (rows.length === 0) {
      utils.displayNotFound(`No matching results found for: ${termEl.value}`);
      return;
    }
    if (!termEl) {
      utils.resultsElement.innerHTML = "";
    }
    // get and append the header
    utils.resultsElement.append(utils.getHeader("Tapes"));
    // loop throught the data and create and append the elements
    rows.forEach((row) => {
      const details = utils.makeDetails();
      const summary = utils.makeSummary();
      const p = utils.makeP();

      // add the always visible fields
      summary.append(
        utils.createLoadedSpan(row.id, 0),
        utils.createLoadedSpan(row.artist, 1),
        utils.createLoadedSpan(row.title, 2),
        utils.createLoadedSpan(row.location, 3),
      );
      details.append(summary);
      // add the data that is only shown when open
      const span1 = utils.makeSpan();
      const span2 = utils.makeSpan();
      const span3 = utils.makeSpan();
      span1.textContent = row.year;
      span2.textContent = `Needs Repair: ${row.needs_repair}`;
      span3.textContent = row.speed ? row.speed : "n/a";
      p.append(span1, span2, span3);
      details.append(p);
      utils.resultsElement.append(details);
    });

    // adjust the second column widths for centering
    utils.setArtistColWidths();
  },
  /**
   * this takes the current term value and displays an error msg
   * @param {HTMLInputElement} termEl
   */
  displayNotFound: (msg) => {
    const md = utils.messageDiv;
    // const msg = `No matching results found for: ${termEl.value}`;
    document.startViewTransition(() => {
      md.innerText = msg;
    });
    // make it go away
    setTimeout(() => {
      document.startViewTransition(() => {
        md.innerText = "";
      });
    }, 3500);
  },
  /**
   * constructs and return the p element that is the results header
   * @returns {HTMLParagraphElement}
   */
  getHeader: (format = undefined) => {
    const p = utils.makeP();
    p.className = "result-header";

    const span1 = utils.makeSpan();
    span1.className = "span1";
    span1.textContent = "ID";
    span1.addEventListener("click", (e) => {
      if (format) {
        // format will need capital letter
        utils.sortResults("id", format);
        // utils[`sort${format}`]("id");
      }
    });
    const span2 = utils.makeSpan();
    span2.className = "span2";
    span2.textContent = "ARTIST";
    span2.addEventListener("click", (e) => {
      if (format) {
        utils.sortResults("artist", format);
      }
    });
    const span3 = utils.makeSpan();
    span3.className = "span3";
    span3.textContent = "TITLE";
    span3.addEventListener("click", (e) => {
      if (format) {
        utils.sortResults("title", format);
      }
    });
    const span4 = utils.makeSpan();
    span4.className = "span4";
    span4.textContent = "LOCATION";
    span4.addEventListener("click", (e) => {
      if (format) {
        utils.sortResults("location", format);
      }
    });

    p.append(span1, span2, span3, span4);

    return p;
  },
  /**
   * for styling, the title field fills the available space, this finds
   * the max width of values in the artist column and sets the width of all
   * values in that column to that width or a max of 600px,
   * everything is centered nicely
   */
  setArtistColWidths: () => {
    // get the spans and create an empty set
    const secondSpans = document.querySelectorAll("#query-results .span2");
    const secondSpanWidths = new Set();
    // get the width vals into the set
    secondSpans.forEach((span) => {
      secondSpanWidths.add(span.getBoundingClientRect().width);
    });
    // set the header and col vals to the max width
    const maxWidth = Math.max(...secondSpanWidths);
    document.querySelector(".result-header .span2").style.width =
      `${maxWidth > 600 ? 600 : maxWidth}px`;
    secondSpans.forEach((span) => {
      span.style.width = `${maxWidth > 600 ? 600 : maxWidth}px`;
    });
  },
  /**
   * creates and sets attributes then returns a span
   * @param {String} val
   * @param {Number} idx
   * @returns {HTMLSpanElement}
   */
  createLoadedSpan: (val, idx) => {
    const span = utils.makeSpan();
    span.className = `span${idx + 1}`;
    span.textContent = val;
    span.title = val;
    return span;
  },
  /**
   * sorts and displays the current records data sorted by the given field
   * @param {String} field
   */
  sortResults: (field, format) => {
    let sorted;
    // determine which dataset needs to be sorted
    sorted = utils[`current${format}Data`];

    // sort the string data, ids are numeric
    sorted.sort((a, b) => {
      if (field !== "id") {
        return a[field].localeCompare(b[field]);
      } else {
        return a[field] - b[field];
      }
    });
    // display the results
    if (format === "Records") {
      utils.displayRecords(sorted);
    } else if (format === "Tapes") {
      utils.displayTapes(sorted);
    } else if (format === "CdsMain") {
      utils.displayCdsMain(sorted);
    }
  },
  resultsElement: document.getElementById("query-results"),
  messageDiv: document.getElementById("message"),
  makeSpan: () => document.createElement("span"),
  makeP: () => document.createElement("p"),
  makeDetails: () => document.createElement("details"),
  makeSummary: () => document.createElement("summary"),
  currentRecordsData: null,
  currentCdsMainData: null,
  currentTapesData: null,
};

export default utils;
