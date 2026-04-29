import {
  removeActiveFormClass,
  removeActiveClass,
  showForm,
  initialShowForm,
  toasty,
} from "./add-utils.js";
import {
  populateCdCompsFormFields,
  populateCdSinglesFormFields,
  populateCdMainFormFields,
  populateRecordsFormFields,
  populateTapesFormFields,
} from "./last-entry.js";
import {
  getCdCompsDataById,
  getCdSinglesDataById,
  getCdsMainDataById,
  getRecordsDataById,
  getTapesDataById,
} from "./get-update-data.js";
import { getLocations } from "./get-current-locations.js";
import {
  handleCdCompsForm,
  handleCdSinglesForm,
  handleCdsMainForm,
} from "./add-script.js";
const mainEl = document.querySelector("main");
let initialLoad = true;
let currentForm = null;
const btnComps = document.querySelector(".btn-cd-comps");
const btnSingles = document.querySelector(".btn-cd-singles");
const btnMain = document.querySelector(".btn-cd-main");
const btnRecords = document.querySelector(".btn-records");
const btnTapes = document.querySelector(".btn-tapes");
const navButtons = [btnComps, btnSingles, btnMain, btnRecords, btnTapes];
const btnUpdateSubmit = document.querySelector("#update-id-form button");
const updateIdInput = document.getElementById("update-id");
const updateForm = document.getElementById("update-id-form");
const cdCompsForm = document.getElementById("cd-comps-form");
const cdSinglesForm = document.getElementById("cd-singles-form");
const cdsMainForm = document.getElementById("cd-main-form");
const recordsForm = document.getElementById("records-form");
const tapesForm = document.getElementById("tapes-form");
const forms = [cdCompsForm, cdSinglesForm, cdsMainForm, recordsForm, tapesForm];

/**
 * when a nav button is clicked, show the appropriate form
 * @param {Event} e
 * @returns {void}
 */
function handleUpdateNavBtnClick(e) {
  if (currentForm && updateIdInput.value) return;

  currentForm = e.target.dataset.form;
  removeActiveClass(navButtons);
  e.target.classList.add("active-nav-btn");
}

/**
 * check input has a value and a form was selected,
 * populate and show the form
 * @param {Event} e
 * @returns {void}
 */
function handleUpdateIdSubmit(e) {
  e.preventDefault();

  if (!updateIdInput.value) {
    toasty("Please enter an id to update.", "red");
    return;
  }

  if (!currentForm) {
    toasty("Please select a format to update an item.", "red");
    return;
  }

  showForm(currentForm);

  // on the initial load, display the increment location option and the main element
  initialShowForm(mainEl, null);

  const id = updateIdInput.value;

  handlePopulateUpdateForm(currentForm, id);
}

// add the listeners to the nav btns
navButtons.forEach((btn) => {
  btn.addEventListener("click", handleUpdateNavBtnClick);
});

btnUpdateSubmit.addEventListener("click", handleUpdateIdSubmit);

/**
 * gets the given id's data and populates the appropriate form
 * @param {string} formStr
 * @param {number} id
 * @returns {void}
 */
async function handlePopulateUpdateForm(formStr, id) {
  switch (formStr) {
    case "cd-comps-form":
      const cdCompData = await getCdCompsDataById(id);

      if (!cdCompData) {
        document.getElementById(currentForm).classList.remove("active-form");
      }

      populateCdCompsFormFields(forms[0], cdCompData);
      break;
    case "cd-singles-form":
      const cdSingleData = await getCdSinglesDataById(id);

      if (!cdSingleData) {
        document.getElementById(currentForm).classList.remove("active-form");
      }

      populateCdSinglesFormFields(forms[1], cdSingleData);
      break;
    case "cd-main-form":
      const cdData = await getCdsMainDataById(id);

      if (!cdData) {
        document.getElementById(currentForm).classList.remove("active-form");
      }

      populateCdMainFormFields(forms[2], cdData);
      break;
    case "records-form":
      const recordData = await getRecordsDataById(id);

      if (!recordData) {
        document.getElementById(currentForm).classList.remove("active-form");
      }

      populateRecordsFormFields(forms[3], recordData);

      break;
    case "tapes-form":
      const tapeData = await getTapesDataById(id);

      if (!tapeData) {
        document.getElementById(currentForm).classList.remove("active-form");
      }

      populateTapesFormFields(forms[4], tapeData);

      break;
    default:
      break;
  }
}

async function handleRecordsForm(e) {
  e.preventDefault();
  console.log("hello from the handleRecordsForm");
}
async function handleTapesForm(e) {
  e.preventDefault();
  console.log("hello from the handleTapesForm");
}

cdsMainForm.addEventListener("submit", handleCdsMainForm);
cdCompsForm.addEventListener("submit", handleCdCompsForm);
cdSinglesForm.addEventListener("submit", handleCdSinglesForm);
recordsForm.addEventListener("submit", handleRecordsForm);
tapesForm.addEventListener("submit", handleTapesForm);

updateForm.addEventListener("reset", () => {
  removeActiveClass(navButtons);
  removeActiveFormClass(forms);
  currentForm = null;
});
