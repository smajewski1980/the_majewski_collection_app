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
        newOpt.textContent = field.replace("_", " ");
      } else {
        newOpt.textContent = field;
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
        break;
      case "records":
        utils.displayRecords(res, termEl);
        break;
      case "tapes":
        utils.displayTapes(res, termEl);
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
      utils.displayNotFound(termEl);
      return;
    }

    utils.resultsElement.append(utils.getHeader());
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
  displayRecords: (rows, termEl) => {
    // if no results, show msg
    if (rows.length === 0) {
      utils.displayNotFound(termEl);
      return;
    }
    // get and append the header
    utils.resultsElement.append(utils.getHeader());
    // loop through data and create elements
    rows.forEach((row) => {
      const det = document.createElement("details");
      const sum = document.createElement("summary");
      const p = utils.makeP();
      // add the data to be always visible
      sum.append(
        utils.createLoadedSpan(row.id, 0),
        utils.createLoadedSpan(row.artist, 1),
        utils.createLoadedSpan(row.title, 2),
        utils.createLoadedSpan(row.location, 3),
      );
      det.append(sum);
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
      det.append(p);
      utils.resultsElement.append(det);
    });
    // adjust the second column widths for centering
    utils.setArtistColWidths();
  },
  displayTapes: (rows, termEl) => {
    // if no results, show msg
    if (rows.length === 0) {
      utils.displayNotFound(termEl);
      return;
    }
    console.log(rows);
  },
  /**
   * this takes the current term value and displays an error msg
   * @param {HTMLInputElement} termEl
   */
  displayNotFound: (termEl) => {
    const md = utils.messageDiv;
    const msg = `No matching results found for: ${termEl.value}`;
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
  getHeader: () => {
    const p = utils.makeP();
    p.className = "result-header";

    const span1 = utils.makeSpan();
    span1.className = "span1";
    span1.textContent = "ID";
    const span2 = utils.makeSpan();
    span2.className = "span2";
    span2.textContent = "ARTIST";
    const span3 = utils.makeSpan();
    span3.className = "span3";
    span3.textContent = "TITLE";
    const span4 = utils.makeSpan();
    span4.className = "span4";
    span4.textContent = "LOCATION";

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
  resultsElement: document.getElementById("query-results"),
  messageDiv: document.getElementById("message"),
  makeSpan: () => document.createElement("span"),
  makeP: () => document.createElement("p"),
};

export default utils;
