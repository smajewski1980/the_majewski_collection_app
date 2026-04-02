import { toasty, getFormClassStr } from "./add-utils.js";

/**
 * sort numerically instead of lexicographically
 * @param {string} a
 * @param {string} b
 * @returns {number}
 */
function customSort(a, b) {
  return a.localeCompare(b, undefined, {
    numeric: true,
    sensitivity: "base",
  });
}

/**
 * filters a datalist to only have options that start with a given value
 * @param {HTMLDataListElement} datalist - the datalist to work on
 * @param {string} value - the string to filter on
 */
function filterOptionList(datalist, value) {
  currOptionIdx = -1;
  datalist.querySelectorAll("option").forEach((opt) => {
    opt.style.display = "block";

    if (!opt.value.toLowerCase().startsWith(value.toLowerCase())) {
      opt.remove();
    }

    const options = datalist.querySelectorAll("option");

    options.forEach((opt) => {
      opt.style.top =
        "calc(var(--btn-height) * calc(sibling-index() - 1) + calc(sibling-index() - 1) * .5rem)";
      opt.style.rotate = "0deg";
    });
  });
}

/**
 * reset option styles then 'highlight' the current option
 * @param {HTMLOptionElement[]} options - an array of options
 * @return {void}
 */
function highlightCurrOption(options) {
  options.forEach((opt) => {
    opt.style.backgroundColor = "var(--bg-color)";
    opt.style.color = "";
  });
  options[currOptionIdx].style.backgroundColor =
    "var(--accent-purple) !important";
  options[currOptionIdx].style.color = "var(--outline-purple)";

  // if there are more than n options in the list
  // scroll the window so they are all on screen
  if (currOptionIdx > 14) {
    options[currOptionIdx].scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
    return;
  }
  if (currOptionIdx > 2) {
    options[currOptionIdx].scrollIntoView({ behavior: "smooth" });
    return;
  }
}

/**
 * update the locations datalist based on the active form
 * @returns {void}
 */
function handlePopulateListForCurrForm() {
  // we get the form id to know curr format
  const formId = document.querySelector(".active-form");
  // clear and populate the appropriate datalist
  switch (formId.id) {
    case "cd-comps-form":
      cdCompsSelect.innerHTML = "";
      populateSelectList(currCdComps, cdCompsSelect);
      break;
    case "cd-singles-form":
      cdSinglesSelect.innerHTML = "";
      populateSelectList(currCdSinglesLocs, cdSinglesSelect);
      break;
    case "cd-main-form":
      cdsMainSelect.innerHTML = "";
      populateSelectList(currCdsMain, cdsMainSelect);
      break;
    case "records-form":
      recordsSelect.innerHTML = "";
      populateSelectList(currRecordsLocs, recordsSelect);
      break;
    case "tapes-form":
      tapesSelect.innerHTML = "";
      populateSelectList(currTapeLoc, tapesSelect);
      break;
    default:
      break;
  }
}

/**
 * takes an input and a datalist and adds event
 * listeners to create our custom datalist
 * @param {HTMLInputElement} input - the input to type the option names
 * @param {HTMLDataListElement} datalist - the list that contains the location options
 * @returns {void}
 */
function addCustomDatalistListeners(input, datalist) {
  // when  the input gains focus, populate and show the datalist
  input.addEventListener("focus", (e) => {
    handlePopulateListForCurrForm();
    datalist.style.display = "block";

    const options = e.target.nextElementSibling.querySelectorAll("option");

    setTimeout(() => {
      options.forEach((opt) => {
        opt.style.top =
          "calc(var(--btn-height) * calc(sibling-index() - 1) + calc(sibling-index() - 1) * .5rem)";
        opt.style.rotate = "0deg";
      });
    }, 50);
  });
  // only show the correct option(s) for the input value
  input.addEventListener("input", (e) => {
    // if the input gets cleared, show the original list again
    if (!e.target.value.length) {
      handlePopulateListForCurrForm();
      datalist.style.display = "block";
      filterOptionList(datalist, e.target.value);

      return;
    }
    handlePopulateListForCurrForm();
    filterOptionList(datalist, e.target.value);
  });

  // hide the list when the input loses focus
  input.addEventListener("blur", (e) => {
    setTimeout(() => {
      const options = e.target.nextElementSibling.querySelectorAll("option");
      options.forEach((opt) => {
        opt.style.top = "";
      });
      setTimeout(() => {
        datalist.style.display = "none";
        currOptionIdx = -1;
      }, 750);
    }, 100);
  });

  input.addEventListener("keydown", (e) => {
    const options = datalist.querySelectorAll("option");

    if (e.key === "ArrowDown" && currOptionIdx < options.length - 1) {
      currOptionIdx++;
      highlightCurrOption(options);
    }

    if (e.key === "ArrowUp" && currOptionIdx > 0) {
      currOptionIdx--;
      highlightCurrOption(options);
    }

    if (e.key === "Enter" || (e.key === "Tab" && currOptionIdx > -1)) {
      e.preventDefault();

      // if an invalid input val is submitted
      if (!options[currOptionIdx]?.value) {
        toasty("that is not a valid option", null);
        currOptionIdx = -1;
        return;
      }

      const selectedVal = options[currOptionIdx].value;
      e.target.value = selectedVal;
      currOptionIdx = -1;
      options.forEach((opt) => {
        opt.style.backgroundColor = "transparent";
        opt.style.color = "var(--accent-purple)";
        opt.style.top = "";
      });
      setTimeout(() => {
        e.target.nextElementSibling.style.display = "none";
      }, 750);

      // focus the next item after the option is selected
      const formId = document.querySelector(".active-form").id;
      if (formId !== "cd-main-form") {
        e.target.parentElement.nextElementSibling
          .querySelector("label")
          .focus();
      } else {
        e.target.parentElement.nextElementSibling.focus();
      }

      return;
    }
  });
}

/**
 * sort the given cd main catalog locations and return currents
 * @param {Object[]} locations array of location objects to be sorted
 * @param {string} locations[].location - location string
 * @returns {string[]} returns an array of current locations
 */
function getMostCurrentCdsMainLoc(locations) {
  const misc = [];
  const classical = [];
  const country = [];
  const hipHop = [];
  const jazz = [];
  const nature = [];
  const pop = [];
  const world = [];
  const xmas = [];

  // sort out by category
  locations.forEach((loc) => {
    if (loc.location.includes("Classical")) {
      classical.push(loc.location);
    } else if (loc.location.includes("Country")) {
      country.push(loc.location);
    } else if (loc.location.includes("Hip Hop")) {
      hipHop.push(loc.location);
    } else if (loc.location.includes("Jazz")) {
      jazz.push(loc.location);
    } else if (loc.location.includes("Nature")) {
      nature.push(loc.location);
    } else if (loc.location.includes("Pop/Rock")) {
      pop.push(loc.location);
    } else if (loc.location.includes("World")) {
      world.push(loc.location);
    } else if (loc.location.includes("X-mas")) {
      xmas.push(loc.location);
    } else {
      misc.push(loc.location);
    }
  });

  // get current sorted vals
  const currClassical = classical.sort(customSort);
  const currCountry = country.sort(customSort);
  const currHipHop = hipHop.sort(customSort);
  const currJazz = jazz.sort(customSort);
  const currNature = nature.sort(customSort);
  const currPop = pop.sort(customSort);
  const currWorld = world.sort(customSort);
  const currXmas = xmas.sort(customSort);

  // return vals
  return [
    currClassical.at(-1),
    currCountry.at(-1),
    currHipHop.at(-1),
    currJazz.at(-1),
    currNature.at(-1),
    currPop.at(-1),
    currWorld.at(-1),
    currXmas.at(-1),
    ...misc,
  ];
}

/**
 * sort the given cd comps locations and return currents
 * @param {Object[]} locations the locations to be sorted
 * @param {string} locations[].location - location string
 * @returns {string[]} returns an array of current locations
 */
function getMostCurrentCdComps(locations) {
  // sort out by category
  const classical = [];
  const soundtracks = [];
  const va = [];
  const xmas = [];

  locations.forEach((loc) => {
    if (loc.location.includes("Classical")) {
      classical.push(loc.location);
    }
    if (loc.location.includes("Soundtrack")) {
      soundtracks.push(loc.location);
    }
    if (loc.location.includes("Various")) {
      va.push(loc.location);
    }
    if (loc.location.includes("X-mas")) {
      xmas.push(loc.location);
    }
  });

  // get current sorted vals
  const currClassical = classical.sort(customSort);
  const currSoundtracks = soundtracks.sort(customSort);
  const currVarious = va.sort(customSort);
  const currXmas = xmas.sort(customSort);

  return [
    currClassical.at(-1),
    currSoundtracks.at(-1),
    currVarious.at(-1),
    currXmas.at(-1),
  ];
}

/**
 * format the cd singles locations to be consistent with the others
 * @param {Object[]} singlesLocs [{case_type: '<case_type>'}]
 * @param {string} singlesLocs[].case_type - the location/case type
 * @returns {string[]} returns an array of cd singles locations
 */
function formatCdSinglesLocs(singlesLocs) {
  const singleLocsArr = [];

  singlesLocs.forEach((loc) => {
    singleLocsArr.push(loc.case_type);
  });

  return singleLocsArr;
}

/**
 * sort the given 33s locations and return currents
 * @param {string[]} loc33s the locations to be sorted
 * @returns {string[]} returns an array of current locations
 */
function getMostCurrent33sLoc(loc33s) {
  const misc = [];
  const classical = [];
  const comedy = [];
  const country = [];
  const jazz = [];
  const unopened = [];
  const pop = [];
  const soundtracks = [];
  const various = [];

  // sort out by category
  loc33s.forEach((loc) => {
    const currLoc = loc.split(" ")[1];
    if (currLoc === "Classical") {
      classical.push(loc);
    } else if (currLoc === "Country") {
      country.push(loc);
    } else if (currLoc === "Comedy") {
      comedy.push(loc);
    } else if (currLoc === "Jazz") {
      jazz.push(loc);
    } else if (currLoc === "NEW") {
      unopened.push(loc);
    } else if (currLoc === "Pop/Rock") {
      pop.push(loc);
    } else if (currLoc === "Soundtracks") {
      soundtracks.push(loc);
    } else if (currLoc === "Various") {
      various.push(loc);
    } else {
      misc.push(loc);
    }
  });

  // get current vals
  const currClassical = classical.sort(customSort);
  const currCountry = country.sort(customSort);
  const currComedy = comedy.sort(customSort);
  const currJazz = jazz.sort(customSort);
  const currUnopened = unopened.sort(customSort);
  const currPop = pop.sort(customSort);
  const currSoundtracks = soundtracks.sort(customSort);
  const currVarious = various.sort(customSort);

  // return array with the vals
  return [
    currClassical.at(-1),
    currCountry.at(-1),
    currComedy.at(-1),
    currJazz.at(-1),
    currUnopened.at(-1),
    currPop.at(-1),
    currSoundtracks.at(-1),
    currVarious.at(-1),
    ...misc,
  ];
}

/**
 * sort the given records locations and return currents
 * @param {Object[]} locations the locations to be sorted
 * @param {string} locations[].location - the record location string
 * @returns {string[]} returns an array of current locations
 */
function getMostCurrentRecordsLoc(locations) {
  const rec45s = [];
  const rec33s = [];
  const rec78s = [];
  // when we switch over to this app, we will change the name of the herb loc to start with 33s in the db
  const misc = ["Herb Alpert Records", '12" Singles'];

  // distibute the values to the appropriate array
  locations.forEach((loc) => {
    if (loc.location.includes("45s ")) {
      rec45s.push(loc.location);
    }
    if (loc.location.includes("33s ")) {
      rec33s.push(loc.location);
    }
    if (loc.location.includes("78s ")) {
      rec78s.push(loc.location);
    }
  });

  // sort the sortables and get currents
  const sorted45s = rec45s.sort(customSort);
  const sorted78s = rec78s.sort(customSort);

  const curren33sLocs = getMostCurrent33sLoc(rec33s);
  const current45sLoc = sorted45s.at(-1);
  const current78sLoc = sorted78s.at(-1);

  return [...curren33sLocs, current45sLoc, current78sLoc, ...misc];
}

/**
 * sort the given tapes locations and return currents
 * @param {Object[]} locations the locations to be sorted
 * @param {string} locations[].location - the tapes location string
 * @returns {string[]} returns an array of current locations
 */
function getMostCurrentTapeLoc(locations) {
  const eightTracks = [];
  const reelToReel = [];
  const cassettes = [];

  // distribute the values to the appropriate array
  locations.forEach((loc) => {
    if (loc.location.includes("8-Track")) {
      eightTracks.push(loc.location);
    }
    if (loc.location.includes("Reel")) {
      reelToReel.push(loc.location);
    }
    if (loc.location.includes("Cassette")) {
      cassettes.push(loc.location);
    }
  });

  // sort the arrays
  const sortedEightTracks = eightTracks.sort(customSort);
  const sortedReelToReel = reelToReel.sort(customSort);
  const sortedCassettes = cassettes.sort(customSort);

  // set the highest value as current
  const currEightLoc = sortedEightTracks.at(-1);
  const currReelLoc = sortedReelToReel.at(-1);
  const currCassLoc = sortedCassettes.at(-1);

  return [currEightLoc, currCassLoc, currReelLoc];
}

/**
 * takes locations and a format and feeds them to the appropriate function
 * @param {Object[]} locations the locations to be sorted
 * @param {string} locations[].location - location string
 * @param {string} format - format string
 * @returns {string[]} returns an array of current locations
 */
function getMostCurrentLoc(locations, format) {
  switch (format) {
    case "tapes":
      return getMostCurrentTapeLoc(locations);
    case "records":
      return getMostCurrentRecordsLoc(locations);
    case "cds":
      return getMostCurrentCdsMainLoc(locations);
    case "cdSingles":
      return formatCdSinglesLocs(locations);
    case "cdComps":
      return getMostCurrentCdComps(locations);
    default:
      return [];
  }
}

// the HTML datalist elements
const cdCompsSelect = document.getElementById("cd-comps-datalist");
const cdsMainSelect = document.getElementById("cds-main-datalist");
const tapesSelect = document.getElementById("tapes-datalist");
const recordsSelect = document.getElementById("records-datalist");
const cdSinglesSelect = document.getElementById("cd-singles-datalist");
// the HTML input elements
const cdCompsInput = document.getElementById("cd-comps-location");
const cdSinglesInput = document.getElementById("cd-singles-case-type");
const cdsMainInput = document.getElementById("cds-main-location");
const recordsInput = document.getElementById("records-location");
const tapesInput = document.getElementById("tapes-location");

// make a datalist manually so we can style the options
// this acts as the index for the open list options for using keyboard input
let currOptionIdx = -1;
// add all the event listeners to make the custom datalist work
addCustomDatalistListeners(cdCompsInput, cdCompsSelect);
addCustomDatalistListeners(cdSinglesInput, cdSinglesSelect);
addCustomDatalistListeners(cdsMainInput, cdsMainSelect);
addCustomDatalistListeners(recordsInput, recordsSelect);
addCustomDatalistListeners(tapesInput, tapesSelect);

/**
 * create the option elements for locations and add to DOM
 * @param {string[]} locations - an array of location strings
 * @param {HTMLDataListElement} datalist - HTML datalist to populate
 * @returns {void}
 */
function populateSelectList(locations, datalist) {
  const currFormId = datalist.closest("form").id;
  const currFormClassStr = getFormClassStr(currFormId);

  locations.forEach((loc) => {
    const option = document.createElement("option");
    option.value = loc;
    option.textContent = loc;
    option.style.backgroundColor = "var(--body-bg)";
    option.classList.add(currFormClassStr);
    datalist.appendChild(option);

    // the below listener is for the custom datalist
    option.addEventListener("click", (e) => {
      //this is not working
      // make list go away after selection is made, update the input val
      e.target.parentElement.style.display = "none";
      e.target.parentElement.previousElementSibling.value = loc;
    });
  });
}

let currTapeLoc;
let currRecordsLocs;
let currCdSinglesLocs;
let currCdComps;
let currCdsMain;
// sort out the data from the fetch by type and give to the getMostCurrentLoc func
/**
 * @typedef {Object} LocationData - the main location data object
 * @property {Array} tapes - An array of tape locataions.
 * @property {Array} records - An array of record locataions.
 * @property {Array} cds - An array of CD locataions.
 * @property {Array} cdComps - An array of CD compilation locataions.
 * @property {Array} cdSingles - An array of CD single locataions.
 */

/**
 * sort location data, get most curr locs, populate lists.
 * @param {LocationData} locationData - The location data for all formats.
 */
function processLocations(locationData) {
  // sort the locationData
  const tapesLocs = locationData.tapes;
  const recordsLocs = locationData.records;
  const cdsLocs = locationData.cds;
  const cdCompsLocs = locationData.cdComps;
  const cdSinglesLocs = locationData.cdSingles;

  // get the most current locations and set variable vals
  currTapeLoc = getMostCurrentLoc(tapesLocs, "tapes");
  currRecordsLocs = getMostCurrentLoc(recordsLocs, "records");
  currCdSinglesLocs = getMostCurrentLoc(cdSinglesLocs, "cdSingles");
  currCdComps = getMostCurrentLoc(cdCompsLocs, "cdComps");
  currCdsMain = getMostCurrentLoc(cdsLocs, "cds");
}

// fetch the data
/**
 * this is the main function that does the initial
 * fetch of the location data and feeds it to the processLocations function
 * @returns {void}
 */
export async function getLocations() {
  try {
    const res = await getCurrentLocations.getCurrentLocations(
      "getCurrentLocations",
    );
    const data = JSON.parse(await res);
    processLocations(data);
  } catch (error) {
    console.log(error);
  }
}

getLocations();
