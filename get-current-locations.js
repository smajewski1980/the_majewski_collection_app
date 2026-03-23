import { toasty } from "./add-utils.js";

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

// DOCS************************************
function filterOptionList(datalist, value) {
  datalist.querySelectorAll("option").forEach((opt) => {
    opt.style.display = "block";
    if (!opt.value.toLowerCase().startsWith(value.toLowerCase())) {
      // opt.style.display = "none";
      opt.remove();
    }
  });
}

function highlightCurrOption(options) {
  options.forEach((opt) => {
    opt.style.backgroundColor = "transparent";
    opt.style.color = "var(--accent-purple)";
  });
  options[currOptionIdx].style.backgroundColor =
    "var(--accent-purple) !important";
  options[currOptionIdx].style.color = "var(--outline-purple)";
}

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

function addCustomDatalistListeners(input, datalist) {
  // when  the input gains focus, populate and show the datalist
  input.addEventListener("focus", () => {
    handlePopulateListForCurrForm();
    datalist.style.display = "block";
  });
  // only show the correct option(s) for the input value
  input.addEventListener("input", (e) => {
    // if the input gets cleared, show the original list again
    if (!e.target.value.length) {
      handlePopulateListForCurrForm();
      datalist.style.display = "block";
      return;
    }
    filterOptionList(datalist, e.target.value);
  });

  // hide the list when the input loses focus
  input.addEventListener("blur", () => {
    setTimeout(() => {
      datalist.style.display = "none";
      currOptionIdx = -1;
    }, 150);
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

    if (e.key === "Enter") {
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
      e.target.nextElementSibling.style.display = "none";
      options.forEach((opt) => {
        opt.style.backgroundColor = "transparent";
        opt.style.color = "var(--accent-purple)";
      });
      return;
    }
  });
}
// end new helper funcs
// ****************************************************************

/**
 * sort the given cd main catalog locations and return currents
 * @param {Object[]} locations the locations to be sorted
 * @param {string} locations[].location
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
 * @param {string} locations[].location
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
 * @param {Object[]} array [{case_type: '<case_type>'}]
 * @param {string} array[].case_type
 * @returns {string[]} returns an array of cd singles locations
 */
function formatCdSinglesLocs(array) {
  const singleLocs = [];

  array.forEach((loc) => {
    singleLocs.push(loc.case_type);
  });

  return singleLocs;
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
 * @param {string} locations[].location
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
 * @param {string} locations[].location
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
 * @param {string} locations[].location
 * @param {string} format
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

/**
 * create the option elements for locations and add to DOM
 * @param {string[]} locations
 * @param {HTMLDataListElement} datalist
 * @returns {void}
 */
function populateSelectList(locations, datalist) {
  locations.forEach((loc) => {
    const option = document.createElement("option");
    option.value = loc;
    option.textContent = loc;
    option.style.backgroundColor = "var(--body-bg)";
    datalist.appendChild(option);

    // the below listener is for the custom datalist
    option.addEventListener("click", (e) => {
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
 * @typedef {Object} LocationData
 * @property {Array} tapes - An array of tape locataions.
 * @property {Array} records - An array of record locataions.
 * @property {Array} cds - An array of CD locataions.
 * @property {Array} cdComps - An array of CD compilation locataions.
 * @property {Array} cdSingles - An array of CD single locataions.
 */

/**
 * sort location data, get most curr locs, populate lists.
 * @param {LocationData} locationData - The media data containing various types of media.
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
async function getLocations() {
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
