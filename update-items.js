import {
  removeActiveFormClass,
  removeActiveClass,
  showForm,
  initialShowForm,
  toasty,
  updateUiSessionList,
  addToSessionStore,
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
  handleRecordsForm,
  handleTapesForm,
} from "./add-script.js";
import utils from "./utils.js";
const mainEl = document.querySelector("main");
let initialLoad = true;
let currentForm = null;
const btnComps = document.querySelector(".btn-cd-comps");
const btnSingles = document.querySelector(".btn-cd-singles");
const btnMain = document.querySelector(".btn-cd-main");
const btnRecords = document.querySelector(".btn-records");
const btnTapes = document.querySelector(".btn-tapes");
const navButtons = [btnComps, btnSingles, btnMain, btnRecords, btnTapes];
const btnUpdateSubmit = document.getElementById("btn-update-submit");
const updateIdInput = document.getElementById("update-id");
const updateForm = document.getElementById("update-id-form");
const cdCompsForm = document.getElementById("cd-comps-form");
const cdSinglesForm = document.getElementById("cd-singles-form");
const cdsMainForm = document.getElementById("cd-main-form");
const recordsForm = document.getElementById("records-form");
const tapesForm = document.getElementById("tapes-form");
const forms = [cdCompsForm, cdSinglesForm, cdsMainForm, recordsForm, tapesForm];
const btnDelete = document.querySelector(".btn-delete");

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

  const id = updateIdInput.value;
  const isGoodId = handlePopulateUpdateForm(currentForm, id);
  utils.makeInert(btnUpdateSubmit, true, ".5");
  utils.makeInert(updateIdInput, true, ".75");
  utils.makeInert(btnDelete, false, "1");

  // on the initial load, display the increment location option and the main element
  initialShowForm(mainEl, null);

  if (isGoodId) {
    showForm(currentForm);
  }
}

// add the listeners to the nav btns
navButtons.forEach((btn) => {
  btn.addEventListener("click", handleUpdateNavBtnClick);
});

updateForm.addEventListener("submit", handleUpdateIdSubmit);
btnDelete.addEventListener("click", handleIdDelete);

async function handleIdDelete(e) {
  e.preventDefault();
  const confirmed = await deleteId.confirmDeleteId(
    "Are you sure you want to delete this item?",
  );
  let res;
  let format;

  switch (currentForm) {
    case "cd-comps-form":
      format = "cd compilations";
      break;
    case "cd-singles-form":
      format = "cd singles";
      break;
    case "cd-main-form":
      format = "cds main";
      break;
    case "records-form":
      format = "records";
      break;
    case "tapes-form":
      format = "tapes";
      break;
    default:
      break;
  }
  try {
    if (confirmed) {
      const id = updateIdInput.value;
      res = await deleteId.deleteId({ currentForm, id });

      const sessionListStr = `id: ${id} was deleted from ${format}.`;
      toasty(res, "red");
      updateForm.reset();
      addToSessionStore("", [sessionListStr, "delete-color"], "currAdded");
      updateUiSessionList();
      return;
    } else {
      console.log("Delete aborted.");
      toasty("Delete aborted.", "red");
      return;
    }
  } catch (error) {
    console.log(error);
    toasty(error, "red");
  }

  return;
}

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
        updateForm.reset();
        return 0;
      }

      populateCdCompsFormFields(forms[0], cdCompData);
      return 1;
    case "cd-singles-form":
      const cdSingleData = await getCdSinglesDataById(id);

      if (!cdSingleData) {
        document.getElementById(currentForm).classList.remove("active-form");
        updateForm.reset();
        return 0;
      }

      populateCdSinglesFormFields(forms[1], cdSingleData);
      return 1;
    case "cd-main-form":
      const cdData = await getCdsMainDataById(id);

      if (!cdData) {
        document.getElementById(currentForm).classList.remove("active-form");
        updateForm.reset();
        return 0;
      }

      populateCdMainFormFields(forms[2], cdData);
      return 1;
    case "records-form":
      const recordData = await getRecordsDataById(id);

      if (!recordData) {
        document.getElementById(currentForm).classList.remove("active-form");
        updateForm.reset();
        return 0;
      }

      populateRecordsFormFields(forms[3], recordData);

      return 1;
    case "tapes-form":
      const tapeData = await getTapesDataById(id);

      if (!tapeData) {
        document.getElementById(currentForm).classList.remove("active-form");
        updateForm.reset();
        return 0;
      }

      populateTapesFormFields(forms[4], tapeData);

      return 1;
    default:
      break;
  }
}

cdsMainForm.addEventListener("submit", handleCdsMainForm);
cdCompsForm.addEventListener("submit", handleCdCompsForm);
cdSinglesForm.addEventListener("submit", handleCdSinglesForm);
recordsForm.addEventListener("submit", handleRecordsForm);
tapesForm.addEventListener("submit", handleTapesForm);

updateForm.addEventListener("reset", () => {
  // mainEl.style.opacity = "0";
  setTimeout(() => {
    removeActiveClass(navButtons);
    removeActiveFormClass(forms);
    currentForm = null;
    utils.makeInert(btnUpdateSubmit, false);
    utils.makeInert(updateIdInput, false);
    utils.makeInert(btnDelete, true, ".5");
    initialLoad = true;
  }, 350);
});
