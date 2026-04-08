import {
  displayCdComps,
  displayCdSingles,
  displayCds,
  displayRecords,
  displayTapes,
} from "./display-functions.js";
import utils from "./utils.js";

/**
 * this is used to extract the parts of the location names
 * so they may be ordered numerically not lexicographically
 * @param {String} str
 * @returns {{firstNumber: Number, alphaPart: String, lastNumber: Number}}
 */
function extractComponents(str) {
  const parts = str.match(/(\d+)?\s*([A-Za-z/"\- ]+)?\s*(\d+)?/);
  const firstNumber = parts[1] ? parseInt(parts[1], 10) : Infinity; // Use Infinity for missing first number
  const alphaPart = parts[2] ? parts[2].trim() : "";
  const lastNumber = parts[3] ? parseInt(parts[3], 10) : Infinity; // Use Infinity for missing last number
  return { firstNumber, alphaPart, lastNumber };
}

/**
 * sorts and displays the current records data sorted by the given field
 * @param {String} field
 * @param {String} format
 */
export const sortResults = (field, format) => {
  let sorted;
  // determine which dataset needs to be sorted
  sorted = utils[`current${format}Data`];
  // an obj having flags for sort direction
  const isRev = utils.sortDirectionRev;

  // sort the data, ids are numeric
  if (isRev[format][field]) {
    sorted.sort((a, b) => {
      if (field !== "id" && field !== "title_id" && field !== "single_id") {
        if (field === "location" && format === "CdComps") {
          return Object.values(b)[0].location.localeCompare(
            Object.values(a)[0].location,
          );
        }
        if (field === "title" && format === "CdComps") {
          return Object.values(b)[0].title.localeCompare(
            Object.values(a)[0].title,
          );
        }
        if (field === "year" && format === "CdComps") {
          return Object.values(b)[0].year - Object.values(a)[0].year;
        }
        if (field === "case_type" && format === "CdSingles") {
          return Object.values(b)[0].case_type.localeCompare(
            Object.values(a)[0].case_type,
          );
        }
        if (field === "artist" && format === "CdSingles") {
          return Object.values(b)[0].artist.localeCompare(
            Object.values(a)[0].artist,
          );
        }
        if (field === "title" && format === "CdSingles") {
          return Object.values(b)[0].title.localeCompare(
            Object.values(a)[0].title,
          );
        }
        if (field === "year" && format === "CdSingles") {
          return Object.values(b)[0].year - Object.values(a)[0].year;
        }

        if (field === "location") {
          const aComponents = extractComponents(a[field]);
          const bComponents = extractComponents(b[field]);

          // Compare first number
          if (aComponents.firstNumber !== bComponents.firstNumber) {
            return bComponents.firstNumber - aComponents.firstNumber;
          }

          // Compare alphabetical part
          if (aComponents.alphaPart !== bComponents.alphaPart) {
            return bComponents.alphaPart.localeCompare(aComponents.alphaPart);
          }

          // Compare last number
          return bComponents.lastNumber - aComponents.lastNumber;
        }
        return b[field].localeCompare(a[field]);
      } else {
        if (format === "CdComps") {
          return Object.values(b)[0].titleId - Object.values(a)[0].titleId;
        }

        if (format === "CdSingles") {
          return Object.values(b)[0].singleId - Object.values(a)[0].singleId;
        }
        return b[field] - a[field];
      }
    });
    // set flag
    isRev[format][field] = !isRev[format][field];
  } else {
    sorted.sort((a, b) => {
      if (field !== "id" && field !== "title_id" && field !== "single_id") {
        if (field === "location" && format === "CdComps") {
          return Object.values(a)[0].location.localeCompare(
            Object.values(b)[0].location,
          );
        }
        if (field === "title" && format === "CdComps") {
          return Object.values(a)[0].title.localeCompare(
            Object.values(b)[0].title,
          );
        }
        if (field === "year" && format === "CdComps") {
          return Object.values(a)[0].year - Object.values(b)[0].year;
        }
        if (field === "case_type" && format === "CdSingles") {
          return Object.values(a)[0].case_type.localeCompare(
            Object.values(b)[0].case_type,
          );
        }
        if (field === "artist" && format === "CdSingles") {
          return Object.values(a)[0].artist.localeCompare(
            Object.values(b)[0].artist,
          );
        }
        if (field === "title" && format === "CdSingles") {
          return Object.values(a)[0].title.localeCompare(
            Object.values(b)[0].title,
          );
        }
        if (field === "year" && format === "CdSingles") {
          return Object.values(a)[0].year - Object.values(b)[0].year;
        }

        if (field === "location") {
          const aComponents = extractComponents(a[field]);
          const bComponents = extractComponents(b[field]);

          // Compare first number
          if (aComponents.firstNumber !== bComponents.firstNumber) {
            return aComponents.firstNumber - bComponents.firstNumber;
          }

          // Compare alphabetical part
          if (aComponents.alphaPart !== bComponents.alphaPart) {
            return aComponents.alphaPart.localeCompare(bComponents.alphaPart);
          }

          // Compare last number
          return aComponents.lastNumber - bComponents.lastNumber;
        }
        return a[field].localeCompare(b[field]);
      } else {
        if (format === "CdComps") {
          return Object.values(a)[0].titleId - Object.values(b)[0].titleId;
        }

        if (format === "CdSingles") {
          return Object.values(a)[0].singleId - Object.values(b)[0].singleId;
        }

        return a[field] - b[field];
      }
    });
    // set flag
    isRev[format][field] = !isRev[format][field];
  }

  utils.resultPage = 0;

  // display the results
  if (format === "Records") {
    utils.currentRecordsData = sorted;
    displayRecords(
      utils.currentRecordsData.slice(utils.resultStart(), utils.resultEnd()),
    );
  } else if (format === "Tapes") {
    utils.currentTapesData = sorted;
    displayTapes(
      utils.currentTapesData.slice(utils.resultStart(), utils.resultEnd()),
    );
  } else if (format === "Cds") {
    utils.currentCdsData = sorted;
    displayCds(
      utils.currentCdsData.slice(utils.resultStart(), utils.resultEnd()),
    );
  } else if (format === "CdComps") {
    utils.currentCdCompsData = sorted;
    displayCdComps(
      utils.currentCdCompsData.slice(utils.resultStart(), utils.resultEnd()),
    );
  } else if (format === "CdSingles") {
    utils.currentCdSinglesData = sorted;
    displayCdSingles(
      utils.currentCdSinglesData.slice(utils.resultStart(), utils.resultEnd()),
    );
  }
};
