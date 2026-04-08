import {
  displayCdComps,
  displayCdSingles,
  displayCds,
  displayRecords,
  displayTapes,
} from "./display-functions.js";

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
      case "cd-compilations":
        const cdCompilationsRes =
          await getFormatFields.getCdCompsFields("getCdCompsFields");
        utils.populateSelectOptions(cdCompilationsRes, field);
        utils.toggleInertEl(field, false);
        break;
      case "cd-singles":
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
   * this takes the current term value and displays an error msg
   * @param {String} msg
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
    const inner1 = utils.makeSpan();
    if (format === "CdComps") {
      inner1.textContent = "TITLE ID";
    } else if (format === "CdSingles") {
      inner1.textContent = "SINGLE ID";
    } else {
      inner1.textContent = "ID";
    }
    span1.append(inner1);
    inner1.addEventListener("click", (e) => {
      if (format) {
        // format will need capital letter
        switch (format) {
          case "CdComps":
            utils.sortResults("title_id", format);
            break;
          case "CdSingles":
            utils.sortResults("single_id", format);
            break;
          default:
            utils.sortResults("id", format);
        }
        // utils[`sort${format}`]("id");
      }
    });
    const span2 = utils.makeSpan();
    span2.className = "span2";
    const inner2 = utils.makeSpan();
    if (format === "CdComps") {
      inner2.textContent = "TITLE";
    } else {
      inner2.textContent = "ARTIST";
    }
    span2.append(inner2);
    inner2.addEventListener("click", (e) => {
      if (format === "CdComps") {
        utils.sortResults("title", format);
      } else if (format) {
        utils.sortResults("artist", format);
      }
    });
    const span3 = utils.makeSpan();
    span3.className = "span3";
    const inner3 = utils.makeSpan();
    if (format === "CdComps") {
      inner3.textContent = "YEAR";
    } else {
      inner3.textContent = "TITLE";
    }
    span3.append(inner3);
    inner3.addEventListener("click", (e) => {
      if (format === "CdComps") {
        utils.sortResults("year", format);
      } else if (format) {
        utils.sortResults("title", format);
      }
    });
    const span4 = utils.makeSpan();
    span4.className = "span4";
    const inner4 = utils.makeSpan();
    inner4.textContent = format === "CdSingles" ? "YEAR" : "LOCATION";
    span4.append(inner4);
    inner4.addEventListener("click", (e) => {
      if (format === "CdSingles") {
        utils.sortResults("year", format);
      } else if (format) {
        utils.sortResults("location", format);
      }
    });

    p.append(span1, span2, span3, span4);

    if (format === "CdSingles") {
      const span5 = utils.makeSpan();
      span5.className = "span5";
      const inner5 = utils.makeSpan();
      inner5.textContent = "CASE TYPE";
      span5.append(inner5);
      inner5.addEventListener("click", (e) => {
        if (format) {
          utils.sortResults("case_type", format);
        }
      });
      p.append(span5);
      p.classList.add("cd-singles");
    }

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
   * @param {String} format
   */
  sortResults: (field, format) => {
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
            const aComponents = utils.extractComponents(a[field]);
            const bComponents = utils.extractComponents(b[field]);

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
            const aComponents = utils.extractComponents(a[field]);
            const bComponents = utils.extractComponents(b[field]);

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
        utils.currentCdSinglesData.slice(
          utils.resultStart(),
          utils.resultEnd(),
        ),
      );
    }
  },
  resultsElement: document.getElementById("query-results"),
  messageDiv: document.getElementById("message"),
  resQtyEl: document.getElementById("result-qty"),
  makeSpan: () => document.createElement("span"),
  makeP: () => document.createElement("p"),
  makeDetails: () => document.createElement("details"),
  makeSummary: () => document.createElement("summary"),
  currentRecordsData: null,
  currentCdsData: null,
  currentTapesData: null,
  currentCdCompsData: null,
  currentCdSinglesData: null,
  sortDirectionRev: {
    Records: {
      artist: false,
      diameter: false,
      id: false,
      label: false,
      location: false,
      record_condition: false,
      sleeve_condition: false,
      title: false,
      year: false,
    },
    Tapes: {
      artist: false,
      id: false,
      location: false,
      needs_repair: false,
      speed: false,
      title: false,
      year: false,
    },
    Cds: {
      artist: false,
      id: false,
      location: false,
      title: false,
    },
    CdComps: {
      title_id: false,
      title: false,
      year: false,
      location: false,
    },
    CdSingles: {
      single_id: false,
      artist: false,
      title: false,
      year: false,
      case_type: false,
    },
  },
  /**
   * takes in an id and populates the popover with the
   * appropriate info for that id
   * @param {Number} id
   * @param {String} fmt
   */
  populatePopover: (id, fmt) => {
    // empty existing content
    utils.resultPopover.innerHTML = "";
    // label for which title these tracks are for
    const popHeading = document.createElement("h3");
    utils.resultPopover.append(popHeading);

    if (fmt === "comps") {
      // filter out the needed title for this title id
      let title = utils.currentCdCompsData.filter((t) => {
        return parseInt(Object.keys(t)[0]) === id;
      })[0];

      // populate the heading text
      popHeading.innerText = `${title[id].title}:`;

      // loop through the tracks and append to popover
      const tracks = title[id].tracks;
      let trackCounter = 1;
      for (let tr in tracks) {
        const artist = tracks[tr].artist;
        const track = tracks[tr].trackName;
        const p = utils.makeP();
        p.textContent = `${trackCounter} ${artist} - ${track}`;
        p.className = "comp-tracks";
        utils.resultPopover.append(p);
        trackCounter++;
      }
    } else if (fmt === "singles") {
      // get the data for the single of the given id
      const single = utils.currentCdSinglesData.filter((s) => {
        return parseInt(Object.keys(s)[0]) === id;
      })[0];

      let artist = single[id].artist;
      let title = single[id].title;

      // set the text for the popover heading
      popHeading.innerText = `${artist} - ${title}:`;

      const trackNames = Object.values(single[id].tracks);

      // loop through the track names and append
      let trackCounter = 1;
      trackNames.forEach((tr) => {
        const p = utils.makeP();
        p.textContent = `${trackCounter} - ${tr}`;
        utils.resultPopover.append(p);
        trackCounter++;
      });
    } else if (fmt === "records") {
      const currentRecord = utils.currentRecordsData.filter((r) => {
        return r.id === id;
      })[0];

      // set the text for the popover heading
      popHeading.innerText = `${currentRecord.artist}:`;

      // record label info will be formatted different for 78s
      let formattedLabel = "";
      // if the label name doesnt end with the word records, add it. 78s exempt
      !currentRecord.label.toLowerCase().includes("records") &&
      !currentRecord.location.includes("78s")
        ? (formattedLabel = currentRecord.label + " Records")
        : (formattedLabel = currentRecord.label);

      // create elements and set text
      const pTitle = utils.makeP();
      pTitle.innerText = currentRecord.title;
      pTitle.style.marginBlockEnd = "1rem";
      const pYearAndLabel = utils.makeP();
      pYearAndLabel.innerText = `${currentRecord.year} - ${formattedLabel}`;
      const pSleeveCond = utils.makeP();
      const pRecordCond = utils.makeP();
      pSleeveCond.innerText = `Sleeve Condition: ${currentRecord.sleeve_condition}`;
      pRecordCond.innerText = `Record Condition: ${currentRecord.record_condition}`;

      // append elements
      utils.resultPopover.append(
        pTitle,
        pYearAndLabel,
        pSleeveCond,
        pRecordCond,
      );
    } else {
      const currentTape = utils.currentTapesData.filter((t) => {
        return t.id === id;
      })[0];

      // set the text for the popover heading
      popHeading.innerText = `${currentTape.artist}:`;

      // create elements and set text
      const pTitle = utils.makeP();
      pTitle.innerText = currentTape.title;
      pTitle.style.marginBlockEnd = "1rem";
      const pYear = utils.makeP();
      pYear.innerText = `Year: ${currentTape.year}`;
      const pRepair = utils.makeP();
      pRepair.innerText = `Needs repair: ${currentTape.needs_repair}`;
      const pSpeed = utils.makeP();
      pSpeed.innerText = `Speed: ${currentTape.speed}`;
      // append elements
      utils.resultPopover.append(pTitle, pYear, pRepair, pSpeed);
    }
  },
  /**
   * this is used to extract the parts of the location names
   * so they may be ordered numerically not lexicographically
   * @param {String} str
   * @returns {{firstNumber: Number, alphaPart: String, lastNumber: Number}}
   */
  extractComponents: (str) => {
    const parts = str.match(/(\d+)?\s*([A-Za-z/"\- ]+)?\s*(\d+)?/);
    const firstNumber = parts[1] ? parseInt(parts[1], 10) : Infinity; // Use Infinity for missing first number
    const alphaPart = parts[2] ? parts[2].trim() : "";
    const lastNumber = parts[3] ? parseInt(parts[3], 10) : Infinity; // Use Infinity for missing last number
    return { firstNumber, alphaPart, lastNumber };
  },
  resultOffset: 200,
  resultPage: 0,
  resultStart: () => utils.resultPage * utils.resultOffset,
  resultEnd: () => utils.resultStart() + utils.resultOffset,
  resultTotalPages: (data) =>
    data ? Math.ceil(data.length / utils.resultOffset) : 0,
  clearResults: () => {
    if (utils.resultPage === 0) {
      utils.resultsElement.innerHTML = "";
    }
  },
  resultPopover: document.getElementById("info-popover"),
};

export default utils;
