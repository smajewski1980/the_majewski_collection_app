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
function handleNavBtnClick(e) {
  if (currentForm) return;

  currentForm = e.target.dataset.form;
  removeActiveClass(navButtons);
  e.target.classList.add("active-nav-btn");
}

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
  showUpdateForm(currentForm, id);
}

// add the listeners to the nav btns
navButtons.forEach((btn) => {
  btn.addEventListener("click", handleNavBtnClick);
});

btnUpdateSubmit.addEventListener("click", handleUpdateIdSubmit);

async function showUpdateForm(formStr, id) {
  switch (formStr) {
    case "cd-comps-form":
      populateCdCompsFormFields(forms[0], getCdCompsDataById(id));
      break;
    case "cd-singles-form":
      populateCdSinglesFormFields(forms[1], getCdSinglesDataById(id));
      break;
    case "cd-main-form":
      populateCdMainFormFields(forms[2], getCdsMainDataById(id));
      break;
    case "records-form":
      populateRecordsFormFields(forms[3], getRecordsDataById(id));
      break;
    case "tapes-form":
      const data = await getTapesDataById(id);

      if (!data) {
        document.getElementById(currentForm).classList.remove("active-form");
      }

      populateTapesFormFields(forms[4], data);
      break;
    default:
      break;
  }
}

async function handleCdCompsForm(e) {
  e.preventDefault();
  console.log("hello from the handleCdCompsForm");
}
async function handleCdSinglesForm(e) {
  e.preventDefault();
  console.log("hello from the handleCdSinglesForm");
}
async function handleCdsMainForm(e) {
  e.preventDefault();
  console.log("hello from the handleCdsMainForm");
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
