import {
  removeActiveFormClass,
  yearFormatIsGood,
  noEmptyFields,
  toasty,
  trimTracks,
  trimDataFields,
  updateUiSessionList,
  focusFirstField,
  removeActiveClass,
  showForm,
  initialShowForm,
  isLocValValid,
  addToSessionStore,
  formatCdCompsTracks,
} from "./add-utils.js";
import { populateFormWithLastEntry, getLastEntry } from "./last-entry.js";
import utils from "./utils.js";
import {
  incrementCheckbox,
  incrementFlag,
  toggleIncFlag,
  handleIncrementReset,
  handleCheckbox,
} from "./handle-loc-incr.js";
import { getLocations } from "./get-current-locations.js";
const cdCompsForm = document.getElementById("cd-comps-form");
const cdSinglesForm = document.getElementById("cd-singles-form");
const cdsMainForm = document.getElementById("cd-main-form");
const recordsForm = document.getElementById("records-form");
const tapesForm = document.getElementById("tapes-form");
const btnComps = document.querySelector(".btn-cd-comps");
const btnSingles = document.querySelector(".btn-cd-singles");
const btnMain = document.querySelector(".btn-cd-main");
const btnRecords = document.querySelector(".btn-records");
const btnTapes = document.querySelector(".btn-tapes");
const navButtons = [btnComps, btnSingles, btnMain, btnRecords, btnTapes];
const forms = [cdCompsForm, cdSinglesForm, cdsMainForm, recordsForm, tapesForm];
const incrementWrapper = document.querySelector(".increment-wrapper");
const mainEl = document.querySelector("main");
let initialLoad = true;
let currentForm = null;
const btnLoadLast = document.querySelector(".btn-load-last");

updateUiSessionList();

/**
 * when a nav button is clicked, show the appropriate form
 * @param {Event} e
 * @returns {void}
 */
function handleNavBtnClick(e) {
  if (document.title === "The Majewski Collection Update Items") return;
  if (e.target.classList.contains("active-nav-btn")) {
    document.getElementById(`${e.target.dataset.form}`).reset();
    return;
  }
  currentForm = e.target.dataset.form;

  if (!initialLoad) {
    document.startViewTransition(() => {
      removeActiveFormClass(forms);
      removeActiveClass(navButtons);
      handleIncrementReset();
      // the first arg is the id of the form to show, second arg is the nav btn
      showForm(e.target.dataset.form, e.target);
    });
  } else {
    // document.startViewTransition(() => {})
    showForm(e.target.dataset.form, e.target);
    // on the initial load, display the increment location option and the main element
    initialShowForm(mainEl, incrementWrapper);
    initialLoad = false;
  }
}

/**
 * handle the submit of the cd comps form
 * @param {Event} e
 * @returns {void}
 */
export async function handleCdCompsForm(e) {
  e.preventDefault();
  // see if add page or update page is the caller
  const currPage = document.title;
  // disable the form until the submit is complete to prevent resending the same item
  const currForm = e.target;
  utils.toggleInertEl(currForm, true);

  const formData = new FormData(cdCompsForm);

  // get the option elems
  const cdCompOptionElems = Array.from(
    document.querySelectorAll("#cd-comps-datalist option"),
  );
  // map the options' text to a valid array
  const validCdCompsLocs = cdCompOptionElems.map((el) => el.value);

  // break down the lines of the textarea
  const tracksFull = formData.get("tracks").trim().split("\n");

  const data = {
    title: formData.get("title"),
    year: Number(formData.get("year")),
    location: formData.get("location"),
    tracks: formatCdCompsTracks(tracksFull, currForm),
  };

  if (!noEmptyFields(data, true)) {
    toasty("All fields must be filled out.", "red");
    utils.toggleInertEl(currForm, false);
    return;
  }

  if (!yearFormatIsGood(data.year)) {
    toasty("Year must be 4 digits.", "red");
    utils.toggleInertEl(currForm, false);
    return;
  }

  if (
    noEmptyFields(data, true) &&
    (await isLocValValid(data.location, validCdCompsLocs))
  ) {
    try {
      let res;
      if (currPage !== "The Majewski Collection Update Items") {
        res = await inserts.insertCdComps("insertCdComps", data);
        toasty("item successfully added", "green");
      } else {
        data["title_id"] = Number(document.getElementById("update-id").value);
        res = await updates.updateCdComp("updateCdComp", data);
        console.log(res);
        toasty("item successfully updated", "green");
      }

      cdCompsForm.reset();
      handleIncrementReset();
      utils.toggleInertEl(currForm, false);

      if (incrementFlag) {
        getLocations();
        toggleIncFlag();
      }

      // add item data to the session list
      const sessionListStr = `id: ${res} ${data.title} was added to cd comps`;
      addToSessionStore("", [sessionListStr, "cd-comp-color"], "currAdded");
      updateUiSessionList();
      addToSessionStore("cdComps", data);

      focusFirstField(cdCompsForm);
      window.scrollTo(0, 0);
    } catch (error) {
      console.log(error);
    }
  } else {
    utils.toggleInertEl(currForm, false);
  }
}

/**
 * handle the submit of the cd singles form
 * @param {Event} e
 * @returns {void}
 */
async function handleCdSinglesForm(e) {
  e.preventDefault();
  // disable the form until the submit is complete to prevent resending the same item
  const currForm = e.target;
  utils.toggleInertEl(currForm, true);
  // get the form data
  const formData = new FormData(cdSinglesForm);
  // break down the tracks string to an array, each track gets trimmed later
  const trackList = formData.get("tracks").trim().split("\n");
  // get the option elems
  const cdSinglesOptionElems = Array.from(
    document.querySelectorAll("#cd-singles-datalist option"),
  );
  // map the options' text to a valid array
  const validCdSingleLocs = cdSinglesOptionElems.map((el) => el.value);

  const data = {
    artist: formData.get("artist"),
    title: formData.get("title"),
    year: Number(formData.get("year")),
    caseType: formData.get("caseType"),
    tracks: trimTracks(trackList),
  };

  if (!noEmptyFields(data, true)) {
    toasty("All fields must be filled out.", "red");
    utils.toggleInertEl(currForm, false);
    return;
  }

  if (!yearFormatIsGood(data.year)) {
    toasty("Year must be 4 digits", "red");
    utils.toggleInertEl(currForm, false);
    return;
  }

  // if only the tracks are empty
  if (!trackList[0] && noEmptyFields(data, true)) {
    toasty("Please add some tracks.", "red");
    utils.toggleInertEl(currForm, false);
    return;
  }

  if (
    noEmptyFields(data, true) &&
    isLocValValid(data.caseType, validCdSingleLocs)
  ) {
    try {
      const res = await inserts.insertCdSingles("insertCdSingles", data);

      cdSinglesForm.reset();
      handleIncrementReset();
      utils.toggleInertEl(currForm, false);
      focusFirstField(cdSinglesForm);
      toasty("item successfully added", "green");

      console.log("new item id: ", res);

      window.scrollTo(0, 0);

      // add item data to the session list
      const sessionListStr = `id: ${res} ${data.artist} - ${data.title} was added to cd singles.`;
      addToSessionStore("", [sessionListStr, "cd-single-color"], "currAdded");
      updateUiSessionList();
      addToSessionStore("cdSingles", data);
    } catch (error) {
      console.log(error);
    }
  }
}

/**
 * this handles the submit of the
 * cds main insert form
 * @param {Event} e
 * @returns {void}
 */
async function handleCdsMainForm(e) {
  e.preventDefault();
  // disable the form until the submit is complete to prevent resending the same item
  const currForm = e.target;
  utils.toggleInertEl(currForm, true);

  const formData = new FormData(cdsMainForm);

  // get the option elements
  const cdsMainOptionElems = Array.from(
    document.querySelectorAll("#cds-main-datalist option"),
  );

  // map the options' text to a valid array
  const validCdsMainLocs = cdsMainOptionElems.map((el) => el.value);

  const data = {
    artist: formData.get("artist"),
    title: formData.get("title"),
    location: formData.get("location"),
  };

  if (!noEmptyFields(data, false)) {
    toasty("All fields must be filled out.", "red");
    utils.toggleInertEl(currForm, false);
    return;
  }

  if (isLocValValid(data.location, validCdsMainLocs)) {
    try {
      const res = await inserts.insertCdsMain(
        "insertCdsMain",
        trimDataFields(data),
      );

      // if the form submits successfully, clear the form,
      // focus the first field, scroll window to top
      cdsMainForm.reset();
      handleIncrementReset();
      utils.toggleInertEl(currForm, false);
      focusFirstField(cdsMainForm);
      toasty("item successfully added", "green");
      window.scrollTo(0, 0);

      if (incrementFlag) {
        getLocations();
        toggleIncFlag();
      }

      // add item data to the session list
      const sessionListStr = `id: ${res} ${data.artist} - ${data.title} was added to cds main.`;
      addToSessionStore("", [sessionListStr, "cds-main-color"], "currAdded");
      updateUiSessionList();
      addToSessionStore("cdsMain", data);
      // }
    } catch (error) {
      toasty(error, "red");
    }
  }
}

/**
 * this handles the submit of the
 * records insert form
 * @param {Event} e
 * @returns {void}
 */
async function handleRecordsForm(e) {
  e.preventDefault();
  // disable the form until the submit is complete to prevent resending the same item
  const currForm = e.target;
  utils.toggleInertEl(currForm, true);

  const formData = new FormData(recordsForm);

  // get the option elements
  const recordsOptionElems = Array.from(
    document.querySelectorAll("#records-datalist option"),
  );

  // map the options' text to a valid array
  const validRecordsLocs = recordsOptionElems.map((el) => el.value);

  const data = {
    artist: formData.get("artist"),
    title: formData.get("title"),
    location: formData.get("location"),
    year: Number(formData.get("year")),
    diameter: formData.get("diameter"),
    sleeve_condition: formData.get("sleeveCondition"),
    record_condition: formData.get("recordCondition"),
    label: formData.get("label"),
  };

  if (!noEmptyFields(data, false)) {
    toasty("All fields must be filled out.", "red");
    utils.toggleInertEl(currForm, false);
    return;
  }

  if (!yearFormatIsGood(data.year)) {
    toasty("Year must be 4 digits", "red");
    utils.toggleInertEl(currForm, false);
    return;
  }

  if (
    noEmptyFields(data, false) &&
    isLocValValid(data.location, validRecordsLocs)
  ) {
    try {
      const res = await inserts.insertRecords(
        "insertRecords",
        trimDataFields(data),
      );

      // if the form submits successfully, clear the form,
      // focus the first field, scroll window to top
      recordsForm.reset();
      handleIncrementReset();
      utils.toggleInertEl(currForm, false);
      focusFirstField(recordsForm);
      toasty("item successfully added", "green");

      if (incrementFlag) {
        getLocations();
        toggleIncFlag();
      }
      window.scrollTo(0, 0);

      // add item data to the session list
      const sessionListStr = `id: ${res} ${data.artist} - ${data.title} was added to records.`;
      addToSessionStore("", [sessionListStr, "record-color"], "currAdded");
      updateUiSessionList();
      addToSessionStore("records", data);
      // }
    } catch (error) {
      console.log(error);
    }
  }
}

/**
 * this handles the submit of the
 * tapes insert form
 * @param {Event} e
 * @returns {void}
 */
async function handleTapesForm(e) {
  e.preventDefault();
  // disable the form until the submit is complete to prevent resending the same item
  const currForm = e.target;
  utils.toggleInertEl(currForm, true);

  const formData = new FormData(tapesForm);

  // get the option elements
  const tapesOptionElems = Array.from(
    document.querySelectorAll("#tapes-datalist option"),
  );

  // map the options' text to a valid array
  const validTapesLocs = tapesOptionElems.map((el) => el.value);

  const data = {
    artist: formData.get("artist"),
    title: formData.get("title"),
    location: formData.get("location"),
    year: Number(formData.get("year")),
    needsRepair: formData.get("needsRepair"),
    speed: formData.get("tapeSpeed"),
  };

  // input validation
  if (!noEmptyFields(data, false)) {
    toasty("All fields must be filled out.", "red");
    utils.toggleInertEl(currForm, false);
    return;
  }
  if (!yearFormatIsGood(data.year)) {
    toasty("Year must be 4 digits", "red");
    utils.toggleInertEl(currForm, false);
    return;
  }
  if (
    noEmptyFields(data, false) &&
    isLocValValid(data.location, validTapesLocs)
  ) {
    try {
      const res = await inserts.insertTapes("insertTapes", data);

      // if the form submits successfully, clear the form,
      // focus the first field, scroll window to top
      tapesForm.reset();
      handleIncrementReset();
      utils.toggleInertEl(currForm, false);
      focusFirstField(tapesForm);
      toasty("item successfully added", "green");

      if (incrementFlag) {
        getLocations();
        toggleIncFlag();
      }
      window.scrollTo(0, 0);

      // add item data to the session list
      const sessionListStr = `id: ${res} ${data.artist} - ${data.title} was added to tapes.`;
      addToSessionStore("", [sessionListStr, "tape-color"], "currAdded");
      updateUiSessionList();
      addToSessionStore("tapes", data);
    } catch (error) {
      console.log(error);
    }
  }
}

// add the listeners to the nav btns
navButtons.forEach((btn) => {
  btn.addEventListener("click", handleNavBtnClick);
});

// submit listeners on the forms
cdsMainForm.addEventListener("submit", handleCdsMainForm);
cdCompsForm.addEventListener("submit", handleCdCompsForm);
cdSinglesForm.addEventListener("submit", handleCdSinglesForm);
recordsForm.addEventListener("submit", handleRecordsForm);
tapesForm.addEventListener("submit", handleTapesForm);

incrementCheckbox.addEventListener("change", (e) => {
  e.preventDefault();
  if (currentForm === "cd-singles-form") {
    e.target.checked = false;
    toasty("You can not increment the singles locations.", null);
    return;
  }
  if (!incrementFlag) {
    handleCheckbox(forms);
  }
});

if (document.title === "The Majewski Collection Add Items") {
  btnLoadLast.addEventListener("click", async (e) => {
    e.preventDefault();
    const activeForm = document.querySelector(".active-form");
    const lastEntry = await getLastEntry(activeForm.id);

    populateFormWithLastEntry(activeForm, lastEntry);
  });
}
