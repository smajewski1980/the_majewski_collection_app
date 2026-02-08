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
    const md = utils.messageDiv;
    const msg = `No matching results found for: ${termEl.value}`;
    // if no results, show msg
    if (rows.length === 0) {
      document.startViewTransition(() => {
        md.innerText = msg;
      });
      // make it go away
      setTimeout(() => {
        document.startViewTransition(() => {
          md.innerText = "";
        });
      }, 3500);
      return;
    }
    // funcs to create the needed elements
    const makeSpan = () => document.createElement("span");
    const makeP = () => document.createElement("p");
    // create a header for the result data
    const p = makeP();
    p.className = "result-header";

    const span1 = makeSpan();
    span1.className = "span1";
    span1.textContent = "ID";
    const span2 = makeSpan();
    span2.className = "span2";
    span2.textContent = "ARTIST";
    const span3 = makeSpan();
    span3.className = "span3";
    span3.textContent = "TITLE";
    const span4 = makeSpan();
    span4.className = "span4";
    span4.textContent = "LOCATION";

    p.append(span1, span2, span3, span4);

    utils.resultsElement.append(p);
    // loop through the results, make and append elements to display the data
    rows.forEach((row) => {
      const p = makeP();
      Object.values(row).forEach((val, idx) => {
        const span = makeSpan();
        span.className = `span${idx + 1}`;
        span.textContent = val;
        p.append(span);
      });
      utils.resultsElement.append(p);
    });

    // for styling, the title field fills the available space, this finds
    // the max width of values in the artist column and sets the width of all
    // values in that column to that width, everything is centered nicely

    // get the spans and create an empty set
    const secondSpans = document.querySelectorAll("#query-results .span2");
    const secondSpanWidths = new Set();
    // get the width vals into the set
    secondSpans.forEach((span) => {
      secondSpanWidths.add(span.getBoundingClientRect().width);
    });
    // set the header and col vals to the max width
    const maxWidth = Math.max(...secondSpanWidths);
    span2.style.width = `${maxWidth}px`;
    secondSpans.forEach((span) => {
      span.style.width = `${maxWidth}px`;
    });
  },
  resultsElement: document.getElementById("query-results"),
  messageDiv: document.getElementById("message"),
};

export default utils;
