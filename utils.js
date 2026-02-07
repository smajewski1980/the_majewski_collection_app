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
   * @returns {void}
   */
  displayCdsMain: (rows, termEl) => {
    if (rows.length === 0) {
      termEl.value = "No matching results found.";
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
    // this will only work if all the same artist...
    // check the width of the first row of data's span2
    // and set the header span 2 to that width so the
    // column is matched with text centered
    const secondSpan = document.querySelector(
      "#query-results p:nth-child(2) .span2",
    );
    const width = secondSpan.getBoundingClientRect().width;
    span2.style.width = `${width}px`;
  },
  resultsElement: document.getElementById("query-results"),
};

export default utils;
