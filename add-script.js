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
  enableLoadLastBtn,
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
const mainEl = document.querySelector("main");
let initialLoad = true;
let currentForm = null;
const loadLastLabel = document.getElementById("load-last-label");
const btnLoadLast = document.querySelector(".btn-load-last");
const resetUpdateForm = () => document.getElementById("update-id-form").reset();

updateUiSessionList();

const isFirstSessionAdd = async () => {
  return await sessionStore.sessionGet("sessionGet", "isFirstSessionAdd");
};

if (
  document.title === "The Majewski Collection Add Items" &&
  !(await isFirstSessionAdd())
) {
  enableLoadLastBtn();
}

function changeElClass(el, cl_ss) {
  el.className = cl_ss;
}

const updateLoadLastBtnState = async () => {
  // if its the first item this session, enable the load last btn
  if (await isFirstSessionAdd()) {
    enableLoadLastBtn();
    await addToSessionStore("", false, "isFirstSessionAdd");
  }
};

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

  if (currentForm === "cd-comps-form") {
    changeElClass(utils.addedItemsTitle, "cd-comp-color");
    changeElClass(loadLastLabel, "cd-comp-color");
    changeElClass(btnLoadLast, "btn-load-last cd-comp-color");
  } else if (currentForm === "cd-singles-form") {
    changeElClass(utils.addedItemsTitle, "cd-single-color");
    changeElClass(loadLastLabel, "cd-single-color");
    changeElClass(btnLoadLast, "btn-load-last cd-single-color");
  } else if (currentForm === "cd-main-form") {
    changeElClass(utils.addedItemsTitle, "cds-main-color");
    changeElClass(loadLastLabel, "cds-main-color");
    changeElClass(btnLoadLast, "btn-load-last cds-main-color");
  } else if (currentForm === "records-form") {
    changeElClass(utils.addedItemsTitle, "record-color");
    changeElClass(loadLastLabel, "record-color");
    changeElClass(btnLoadLast, "btn-load-last record-color");
  } else {
    changeElClass(utils.addedItemsTitle, "tape-color");
    changeElClass(loadLastLabel, "tape-color");
    changeElClass(btnLoadLast, "btn-load-last tape-color");
  }

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
    initialShowForm(mainEl);
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
  utils.makeInert(currForm, true);

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
    id: "id will go here",
    title: formData.get("title"),
    year: Number(formData.get("year")),
    location: formData.get("location"),
    title_id: "id will go here",
    tracks: formatCdCompsTracks(tracksFull, currForm),
  };

  if (!noEmptyFields(data, true)) {
    toasty("All fields must be filled out.", "red");
    utils.makeInert(currForm, false);
    return;
  }

  if (!yearFormatIsGood(data.year)) {
    toasty("Year must be 4 digits.", "red");
    utils.makeInert(currForm, false);
    return;
  }

  if (!(await isLocValValid(data.location, validCdCompsLocs))) {
    // the toast is thrown in isLocValValid
    utils.makeInert(currForm, false);
    return;
  }

  try {
    let res;
    if (currPage !== "The Majewski Collection Update Items") {
      res = await inserts.insertCdComps("insertCdComps", data);

      toasty("item successfully added", "green");

      // add item data to the session list
      data.id = `id: ${res}`;
      await addToSessionStore(
        "",
        [data, "cd-comp-color", currForm.id],
        "currAdded",
      );
      // check if its the first add for the session and enable the load last btn
      updateLoadLastBtnState();
    } else {
      // data["title_id"] = Number(document.getElementById("update-id").value);
      const updatedId = Number(document.getElementById("update-id").value);
      data.id = `id: ${updatedId}`;
      data["title_id"] = updatedId;
      res = await updates.updateCdComp("updateCdComp", data);

      if (typeof res !== "number") {
        throw new Error(res);
      }
      if (res < 1) {
        throw new Error("Please check your fields, no rows have been updated.");
      }
      console.log(data);
      addToSessionStore("", [data, "update-color", currForm.id], "currAdded");
      toasty("item successfully updated", "green");
      resetUpdateForm();
    }

    cdCompsForm.reset();
    document.querySelector(".comps-line-ctr").textContent = "s";
    handleIncrementReset();
    utils.makeInert(currForm, false);

    if (incrementFlag) {
      getLocations();
      toggleIncFlag();
    }

    updateUiSessionList();

    focusFirstField(cdCompsForm);
    window.scrollTo(0, 0);
  } catch (error) {
    console.log(error);
    toasty(error);
  } finally {
    utils.makeInert(currForm, false);
  }
}

/**
 * handle the submit of the cd singles form
 * @param {Event} e
 * @returns {void}
 */
export async function handleCdSinglesForm(e) {
  e.preventDefault();
  const currPage = document.title;
  // disable the form until the submit is complete to prevent resending the same item
  const currForm = e.target;
  utils.makeInert(currForm, true);
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
    id: "id will go here",
    artist: formData.get("artist"),
    title: formData.get("title"),
    year: Number(formData.get("year")),
    caseType: formData.get("caseType"),
    single_id: "id will go here",
    tracks: trimTracks(trackList),
  };

  if (!noEmptyFields(data, true)) {
    toasty("All fields must be filled out.", "red");
    utils.makeInert(currForm, false);
    return;
  }

  if (!yearFormatIsGood(data.year)) {
    toasty("Year must be 4 digits", "red");
    utils.makeInert(currForm, false);
    return;
  }

  // if only the tracks are empty
  if (!trackList[0] && noEmptyFields(data, true)) {
    toasty("Please add some tracks.", "red");
    utils.makeInert(currForm, false);
    return;
  }

  if (!(await isLocValValid(data.caseType, validCdSingleLocs))) {
    // the toast is thrown in isLocValValid
    utils.makeInert(currForm, false);
    return;
  }

  try {
    let res;
    if (currPage !== "The Majewski Collection Update Items") {
      res = await inserts.insertCdSingles("insertCdSingles", data);

      toasty("item successfully added", "green");

      // add item data to the session list
      data.id = `id: ${res}`;
      addToSessionStore(
        "",
        [data, "cd-single-color", currForm.id],
        "currAdded",
      );

      // check if its the first add for the session and enable the load last btn
      updateLoadLastBtnState();
    } else {
      const updatedId = Number(document.getElementById("update-id").value);
      data.id = `id: ${updatedId}`;
      data["single_id"] = updatedId;
      res = await updates.updateCdSingle("updateCdSingle", data);

      if (typeof res !== "number") {
        toasty(res);
        throw new Error(res);
      }
      if (res < 1) {
        throw new Error("Please check your fields, no rows have been updated.");
      }

      addToSessionStore("", [data, "update-color", currForm.id], "currAdded");
      toasty("item successfully updated", "green");
      resetUpdateForm();
    }

    cdSinglesForm.reset();
    document.querySelector(".sing-line-ctr").textContent = "s";
    handleIncrementReset();
    utils.makeInert(currForm, false);
    focusFirstField(cdSinglesForm);

    window.scrollTo(0, 0);

    updateUiSessionList();
  } catch (error) {
    console.log(error);
    toasty(error);
  } finally {
    utils.makeInert(currForm, false);
  }
}

/**
 * this handles the submit of the
 * cds main insert form
 * @param {Event} e
 * @returns {void}
 */
export async function handleCdsMainForm(e) {
  e.preventDefault();
  const currPage = document.title;
  // disable the form until the submit is complete to prevent resending the same item
  const currForm = e.target;
  utils.makeInert(currForm, true);

  const formData = new FormData(cdsMainForm);

  // get the option elements
  const cdsMainOptionElems = Array.from(
    document.querySelectorAll("#cds-main-datalist option"),
  );

  // map the options' text to a valid array
  const validCdsMainLocs = cdsMainOptionElems.map((el) => el.value);

  const data = {
    id: "id will go here",
    artist: formData.get("artist"),
    title: formData.get("title"),
    location: formData.get("location"),
  };

  if (!noEmptyFields(data, false)) {
    toasty("All fields must be filled out.", "red");
    utils.makeInert(currForm, false);
    return;
  }

  if (!(await isLocValValid(data.location, validCdsMainLocs))) {
    // the toast is thrown in isLocValValid
    utils.makeInert(currForm, false);
    return;
  }

  try {
    let res;
    if (currPage !== "The Majewski Collection Update Items") {
      res = await inserts.insertCdsMain("insertCdsMain", trimDataFields(data));

      toasty("item successfully added", "green");

      // add item data to the session list
      data.id = `id: ${res}`;
      addToSessionStore("", [data, "cds-main-color", currForm.id], "currAdded");

      // check if its the first add for the session and enable the load last btn
      updateLoadLastBtnState();
    } else {
      const updatedId = Number(document.getElementById("update-id").value);
      data["id"] = updatedId;
      res = await updates.updateCdMain("updateCdMain", trimDataFields(data));

      if (typeof res !== "number") {
        throw new Error(res);
      }

      if (res < 1) {
        throw new Error("Please check your fields, no rows have been updated.");
      }

      data.id = `id: ${updatedId}`;
      addToSessionStore("", [data, "update-color", currForm.id], "currAdded");
      toasty("item successfully updated", "green");
      resetUpdateForm();
    }

    // if the form submits successfully, clear the form,
    // focus the first field, scroll window to top
    cdsMainForm.reset();
    handleIncrementReset();
    utils.makeInert(currForm, false);
    focusFirstField(cdsMainForm);
    window.scrollTo(0, 0);

    if (incrementFlag) {
      getLocations();
      toggleIncFlag();
    }

    updateUiSessionList();
    // }
  } catch (error) {
    toasty(error, "red");
  } finally {
    utils.makeInert(currForm, false);
  }
}

/**
 * this handles the submit of the
 * records insert form
 * @param {Event} e
 * @returns {void}
 */
export async function handleRecordsForm(e) {
  e.preventDefault();
  const currPage = document.title;
  // disable the form until the submit is complete to prevent resending the same item
  const currForm = e.target;
  utils.makeInert(currForm, false);

  const formData = new FormData(recordsForm);

  // get the option elements
  const recordsOptionElems = Array.from(
    document.querySelectorAll("#records-datalist option"),
  );

  // map the options' text to a valid array
  const validRecordsLocs = recordsOptionElems.map((el) => el.value);

  const data = {
    id: "id will go here",
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
    utils.makeInert(currForm, false);
    return;
  }

  if (!yearFormatIsGood(data.year)) {
    toasty("Year must be 4 digits", "red");
    utils.makeInert(currForm, false);
    return;
  }

  if (!(await isLocValValid(data.location, validRecordsLocs))) {
    // the toast is thrown in isLocValValid
    utils.makeInert(currForm, false);
    return;
  }

  try {
    let res;
    if (currPage !== "The Majewski Collection Update Items") {
      res = await inserts.insertRecords("insertRecords", trimDataFields(data));

      toasty("item successfully added", "green");

      // add item data to the session list
      data.id = `id: ${res}`;
      addToSessionStore("", [data, "record-color", currForm.id], "currAdded");

      // check if its the first add for the session and enable the load last btn
      updateLoadLastBtnState();
    } else {
      const updatedId = Number(document.getElementById("update-id").value);
      data["id"] = updatedId;
      res = await updates.updateRecord("updateRecord", trimDataFields(data));

      if (typeof res !== "number") {
        throw new Error(res);
      }

      if (res < 1) {
        throw new Error("Please check your fields, no rows have been updated.");
      }

      data.id = `id: ${updatedId}`;
      addToSessionStore("", [data, "update-color", currForm.id], "currAdded");
      toasty("item successfully updated", "green");
      resetUpdateForm();
    }

    // if the form submits successfully, clear the form,
    // focus the first field, scroll window to top
    recordsForm.reset();
    handleIncrementReset();
    utils.makeInert(currForm, false);
    focusFirstField(recordsForm);

    if (incrementFlag) {
      getLocations();
      toggleIncFlag();
    }
    window.scrollTo(0, 0);

    updateUiSessionList();
  } catch (error) {
    console.log(error);
    toasty(error);
  }
}

/**
 * this handles the submit of the
 * tapes insert form
 * @param {Event} e
 * @returns {void}
 */
export async function handleTapesForm(e) {
  e.preventDefault();
  const currPage = document.title;
  // disable the form until the submit is complete to prevent resending the same item
  const currForm = e.target;
  utils.makeInert(currForm, true);

  const formData = new FormData(tapesForm);

  // get the option elements
  const tapesOptionElems = Array.from(
    document.querySelectorAll("#tapes-datalist option"),
  );

  // map the options' text to a valid array
  const validTapesLocs = tapesOptionElems.map((el) => el.value);

  const data = {
    id: "id will go here",
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
    utils.makeInert(currForm, false);
    return;
  }
  if (!yearFormatIsGood(data.year)) {
    toasty("Year must be 4 digits", "red");
    utils.makeInert(currForm, false);
    return;
  }

  if (!(await isLocValValid(data.location, validTapesLocs))) {
    // the toast is thrown in isLocValValid
    utils.makeInert(currForm, false);
    return;
  }

  try {
    let res;
    if (currPage !== "The Majewski Collection Update Items") {
      res = await inserts.insertTapes("insertTapes", trimDataFields(data));

      toasty("item successfully added", "green");

      // add item data to the session list
      data.id = `id: ${res}`;
      addToSessionStore("", [data, "tape-color", currForm.id], "currAdded");

      // check if its the first add for the session and enable the load last btn
      updateLoadLastBtnState();
    } else {
      const updatedId = Number(document.getElementById("update-id").value);
      data["id"] = updatedId;
      res = await updates.updateTape("updateTape", trimDataFields(data));

      if (typeof res !== "number") {
        throw new Error(res);
      }

      if (res < 1) {
        throw new Error("Please check your fields, no rows have been updated.");
      }

      data.id = `id: ${updatedId}`;
      addToSessionStore("", [data, "update-color", currForm.id], "currAdded");
      toasty("item successfully updated", "green");
      resetUpdateForm();
    }

    // if the form submits successfully, clear the form,
    // focus the first field, scroll window to top
    tapesForm.reset();
    handleIncrementReset();
    utils.makeInert(currForm, false);
    focusFirstField(tapesForm);

    if (incrementFlag) {
      getLocations();
      toggleIncFlag();
    }
    window.scrollTo(0, 0);

    updateUiSessionList();
  } catch (error) {
    console.log(error);
    toasty(error);
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

    const currSessionList = await sessionStore.sessionGet(
      "sessionGet",
      "currAdded",
    );

    const lastEntryForm = currSessionList[0][2];
    const lastEntry = currSessionList[0][0];
    // if the last entry was a different format, return
    if (currentForm !== lastEntryForm) {
      return toasty(
        "The active form does not match the format of the last entry.",
        "red",
      );
    }

    populateFormWithLastEntry(activeForm, lastEntry);
  });
}
