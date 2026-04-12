import utils from "./utils.js";
import { getHeader } from "./header.js";

export const displayAllFormats = (rows, term) => {
  // if no results, show msg
  if (rows.length === 0) {
    utils.displayNotFound(`No matching results found for: ${term}`);
    return;
  }

  utils.clearResults();

  if (rows[0] === "error") {
    utils.displayNotFound(rows[1]);
    return;
  }

  // get and append the header if its a fresh search
  if (utils.resultPage === 0) {
    utils.resultsElement.append(getHeader("all"));
  }

  // loop through the results, make and append elements to display the data
  rows.forEach((row) => {
    const p = utils.makeP();

    Object.values(row).forEach((val, idx) => {
      p.append(utils.createLoadedSpan(val, idx));
    });

    utils.resultsElement.append(p);
  });

  utils.setArtistColWidths();

  console.log(`for the term ${term}:`);
  console.log(rows);
};

/**
 * this gets and displays the cds main query results
 * @param {QueryResultRow} rows
 * @param {String} term
 * @returns {void}
 */
export const displayCds = (rows, term) => {
  // if no results, show msg
  if (rows.length === 0) {
    utils.displayNotFound(`No matching results found for: ${term}`);
    return;
  }

  utils.clearResults();

  // get and append the header if its a fresh search
  if (utils.resultPage === 0) {
    utils.resultsElement.append(getHeader("Cds"));
  }
  // loop through the results, make and append elements to display the data
  rows.forEach((row) => {
    const p = utils.makeP();

    Object.values(row).forEach((val, idx) => {
      p.append(utils.createLoadedSpan(val, idx));
    });

    utils.resultsElement.append(p);
  });

  utils.setArtistColWidths();
};
/**
 * this gets and displays the records query results
 * @param {QueryResultRow} rows
 * @param {String} term
 * @returns {void}
 */
export const displayRecords = (rows, term = null) => {
  // if no results, show msg
  if (rows.length === 0) {
    utils.displayNotFound(`No matching results found for: ${term}`);
    return;
  }

  utils.clearResults();

  // get and append the header if its a fresh search
  if (utils.resultPage === 0) {
    utils.resultsElement.append(getHeader("Records"));
  }

  // loop through data and create elements
  rows.forEach((row) => {
    const p = utils.makeP();
    // add the data to be always visible
    p.append(
      utils.createLoadedSpan(row.id, 0),
      utils.createLoadedSpan(row.artist, 1),
      utils.createLoadedSpan(row.title, 2),
      utils.createLoadedSpan(row.location, 3),
    );

    p.className = `item-idx-${row.id}`;
    p.tabIndex = "0";

    // add the listeners to the row that will load and open the tracks popover
    p.addEventListener("click", (e) => {
      utils.populatePopover(row.id, "records");
      utils.resultPopover.showPopover();
    });
    p.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        utils.populatePopover(row.id, "records");
        utils.resultPopover.showPopover();
      }
    });
    utils.resultsElement.append(p);
  });
  // adjust the second column widths for centering
  utils.setArtistColWidths();
};
/**
 * this gets and displays the tapes query results
 * @param {QueryResultRow} rows
 * @param {String} term
 * @returns {void}
 */
export const displayTapes = (rows, term) => {
  // if no results, show msg
  if (rows.length === 0) {
    utils.displayNotFound(`No matching results found for: ${term}`);
    return;
  }

  utils.clearResults();

  // get and append the header if its a fresh search
  if (utils.resultPage === 0) {
    utils.resultsElement.append(getHeader("Tapes"));
  }

  // loop through the data and create and append the elements
  rows.forEach((row) => {
    const p = utils.makeP();

    // add the always visible fields
    p.append(
      utils.createLoadedSpan(row.id, 0),
      utils.createLoadedSpan(row.artist, 1),
      utils.createLoadedSpan(row.title, 2),
      utils.createLoadedSpan(row.location, 3),
    );
    p.className = `item-idx-${row.id}`;
    p.tabIndex = "0";

    // add the listeners to the row that will load and open the tracks popover
    p.addEventListener("click", (e) => {
      utils.populatePopover(row.id, "tapes");
      utils.resultPopover.showPopover();
    });
    p.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        utils.populatePopover(row.id, "tapes");
        utils.resultPopover.showPopover();
      }
    });

    utils.resultsElement.append(p);
  });

  // adjust the second column widths for centering
  utils.setArtistColWidths();
};
export const displayCdComps = (rows, term) => {
  // if no results, show msg
  if (rows.length === 0) {
    utils.displayNotFound(`No matching results found for: ${term}`);
    return;
  }

  utils.clearResults();

  // get and append the header if its a fresh search
  if (utils.resultPage === 0) {
    utils.resultsElement.append(getHeader("CdComps"));
  }

  rows.forEach((row) => {
    const p = utils.makeP();
    // add the data to be always visible
    p.append(
      utils.createLoadedSpan(row[Object.keys(row)[0]].titleId, 0),
      utils.createLoadedSpan(row[Object.keys(row)[0]].title, 1),
      utils.createLoadedSpan(row[Object.keys(row)[0]].year, 2),
      utils.createLoadedSpan(row[Object.keys(row)[0]].location, 3),
    );

    p.className = `cd-comps item-idx-${row[Object.keys(row)[0]].titleId}`;
    p.tabIndex = "0";

    // add the listeners to the row that will load and open the tracks popover
    p.addEventListener("click", (e) => {
      utils.populatePopover(row[Object.keys(row)[0]].titleId, "comps");
      utils.resultPopover.showPopover();
    });
    p.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        utils.populatePopover(row[Object.keys(row)[0]].titleId, "comps");
        utils.resultPopover.showPopover();
      }
    });

    utils.resultsElement.append(p);
  });

  document.querySelector(".result-header").classList.add("cd-comps");
};
export const displayCdSingles = (rows, term) => {
  // if no results, show msg
  if (rows.length === 0) {
    utils.displayNotFound(`No matching results found for: ${term}`);
    return;
  }

  utils.clearResults();

  // get and append the header if its a fresh search
  if (utils.resultPage === 0) {
    utils.resultsElement.append(getHeader("CdSingles"));
  }

  rows.forEach((row) => {
    const p = utils.makeP();

    // add the data to be always visible
    p.append(
      utils.createLoadedSpan(row[Object.keys(row)[0]].singleId, 0),
      utils.createLoadedSpan(row[Object.keys(row)[0]].artist, 1),
      utils.createLoadedSpan(row[Object.keys(row)[0]].title, 2),
      utils.createLoadedSpan(row[Object.keys(row)[0]].year, 3),
      utils.createLoadedSpan(row[Object.keys(row)[0]].case_type, 4),
    );

    p.className = `cd-singles item-idx-${row[Object.keys(row)[0]].singleId}`;
    p.tabIndex = "0";

    // add the listeners to the row that will load and open the tracks popover
    p.addEventListener("click", (e) => {
      utils.populatePopover(row[Object.keys(row)[0]].singleId, "singles");
      utils.resultPopover.showPopover();
    });
    p.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        utils.populatePopover(row[Object.keys(row)[0]].singleId, "singles");
        utils.resultPopover.showPopover();
      }
    });

    utils.resultsElement.append(p);

    // adjust the second column widths for centering
    utils.setArtistColWidths();
  });
};
