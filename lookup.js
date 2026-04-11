import utils from "./utils.js";
import {
  displayCdComps,
  displayCdSingles,
  displayCds,
  displayRecords,
  displayTapes,
} from "./display-functions.js";

/**
 * prob need to be adjusted later
 * this takes the query vals and sends them to main.js
 * the results are then added to the results element
 * @param {Event} e
 * @param {String} format
 * @param {String} field
 * @param {String} term
 */
export const handleLookupBtn = async (e, format, field, term) => {
  e.preventDefault();
  const vals = { format: format, field: field, term: term };
  if (!field) {
    utils.displayNotFound("Please select a field to search.");
    return;
  }

  // validate id or year are numbers
  if (
    (field === "id" ||
      field === "year" ||
      field === "title_id" ||
      field === "track_id" ||
      field === "single_id") &&
    !parseInt(term)
  ) {
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

    if (
      (1885 > parsedYear || parsedYear > currentYear) &&
      parsedYear !== 1234
    ) {
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

  try {
    let res;
    // send data to main.js
    if (format !== "all-formats") {
      res = await handleQueryValues.handleQueryValues(
        "handleQueryValues",
        vals,
      );
    } else {
      res = await handleAllFormatQuery.handleAllFormatQuery(
        "handleAllFormatQuery",
        term,
      );
    }

    // reset the "page" counter for a fresh search
    utils.resultPage = 0;

    switch (format) {
      case "cds":
        utils.resQtyEl.innerText = `${res.length} result${res.length > 1 ? "s" : ""}`;
        utils.currentCdsData = res;
        displayCds(res.slice(utils.resultStart(), utils.resultEnd()), term);
        break;
      case "records":
        utils.resQtyEl.innerText = `${res.length} result${res.length > 1 ? "s" : ""}`;
        utils.currentRecordsData = res;
        displayRecords(res.slice(utils.resultStart(), utils.resultEnd()), term);
        break;
      case "tapes":
        utils.resQtyEl.innerText = `${res.length} result${res.length > 1 ? "s" : ""}`;
        utils.currentTapesData = res;
        displayTapes(res.slice(utils.resultStart(), utils.resultEnd()), term);
        break;
      case "cd-compilations":
        const titles = [];
        // assemble a title obj if this title not in titles
        res.forEach((title) => {
          if (!titles.some((t) => title.title_id in t)) {
            titles.push({
              [title.title_id]: {
                titleId: title.title_id,
                title: title.title,
                year: title.year,
                location: title.location,
                tracks: {
                  [title.track_id]: {
                    artist: title.artist,
                    trackName: title.track_name,
                  },
                },
              },
            });
          } else {
            // keep adding the tracks to a title if title is in titles
            titles[titles.length - 1][title.title_id].tracks[title.track_id] = {
              artist: title.artist,
              trackName: title.track_name,
            };
          }
        });
        utils.resQtyEl.innerText = `${titles.length} result${titles.length > 1 ? "s" : ""}`;
        utils.currentCdCompsData = titles;
        displayCdComps(
          titles.slice(utils.resultStart(), utils.resultEnd()),
          term,
        );
        // console.log("num titles: ", titles.length);
        break;
      case "cd-singles":
        utils.resQtyEl.innerText = `${res.length} result${res.length > 1 ? "s" : ""}`;
        const singles = [];
        res.forEach((sing) => {
          // on the first iteration, set up a single including the first track
          if (!singles.some((s) => sing.single_id in s)) {
            singles.push({
              [sing.single_id]: {
                singleId: sing.single_id,
                artist: sing.artist,
                title: sing.title,
                year: sing.year,
                case_type: sing.case_type,
                tracks: {
                  [sing.track_id]: sing.track_name,
                },
              },
            });
          } else {
            // add the rest of the tracks
            singles[singles.length - 1][sing.single_id].tracks[sing.track_id] =
              sing.track_name;
          }
        });
        utils.resQtyEl.innerText = `${singles.length} result${singles.length > 1 ? "s" : ""}`;
        utils.currentCdSinglesData = singles;
        displayCdSingles(
          singles.slice(utils.resultStart(), utils.resultEnd()),
          term,
        );
        // console.log("num titles: ", singles.length);
        break;
      default:
        break;
    }
  } catch (error) {
    console.log(error);
  }
};
