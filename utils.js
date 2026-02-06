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
  handleLookupBtn: async (e, format, field, term) => {
    e.preventDefault();
    const vals = { format: format, field: field, term: term };
    // send data to main.js
    const res = await handleQueryValues.handleQueryValues(
      "handleQueryValues",
      vals,
    );
    // clear the results div
    utils.resultsElement.innerHTML = "";
    // loop through the rows to get vals on the page
    res.forEach((row) => {
      // create a p element and add the values to it
      const p = document.createElement("p");
      // loop through the vals and append to the p tag text
      Object.values(row).forEach((val) => {
        p.innerText += `${val} `;
      });
      // add the p element to the results element
      utils.resultsElement.appendChild(p);
    });
  },
  resultsElement: document.getElementById("query-results"),
};

export default utils;
