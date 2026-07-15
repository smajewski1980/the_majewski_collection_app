import { toasty, getFormClassStr } from "./add-utils.js";

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
        "calc(var(--btn-height) * calc(sibling-index() - 1) + calc(sibling-index() - 1) * .6rem)";
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

  // when using the arrow keys, keep the option in the scrollport
  if (currOptionIdx > 7) {
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
          "calc(var(--btn-height) * calc(sibling-index() - 1) + calc(sibling-index() - 1) * .6rem)";
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
      const activeForm = document.querySelector(".active-form");
      const formId = activeForm.id;
      if (formId !== "cd-main-form") {
        e.target.parentElement.nextElementSibling
          .querySelector("label")
          .focus();
      } else {
        const button = activeForm.querySelector("button");
        button.focus();
      }

      return;
    }
  });
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
  const {
    highLocCdComps,
    highLocCdSingles,
    highLocCds,
    highLocRecords,
    highLocTapes,
  } = locationData;

  currCdComps = highLocCdComps;
  currCdSinglesLocs = highLocCdSingles;
  currCdsMain = highLocCds;
  currRecordsLocs = highLocRecords;
  currTapeLoc = highLocTapes;
}

// get the data
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
