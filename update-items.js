import {
  removeActiveFormClass,
  removeActiveClass,
  showForm,
  initialShowForm,
  toasty,
} from "./add-utils.js";
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
  currentForm = e.target.dataset.form;
  removeActiveClass(navButtons);
  e.target.classList.add("active-nav-btn");
}

function handleUpdateIdSubmit(e) {
  e.preventDefault();

  if (!initialLoad) {
    document.startViewTransition(() => {
      removeActiveFormClass(forms);
      // the first arg is the id of the form to show, second arg is the nav btn
      showForm(currentForm);
    });
  } else {
    showForm(currentForm);

    // on the initial load, display the increment location option and the main element
    initialShowForm(mainEl, null);
    initialLoad = false;
  }

  if (!updateIdInput.value) {
    toasty("Please enter and id to update.", "red");
    return;
  }

  if (!currentForm) {
    toasty("Please select a format to update an item.", "red");
    return;
  }

  const id = updateIdInput.value;
  showUpdateForm(currentForm, id);
}

// add the listeners to the nav btns
navButtons.forEach((btn) => {
  btn.addEventListener("click", handleNavBtnClick);
});

btnUpdateSubmit.addEventListener("click", handleUpdateIdSubmit);

function showUpdateForm(formStr, id) {
  console.log(formStr, id);
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
