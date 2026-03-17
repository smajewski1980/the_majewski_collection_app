import {
  removeActiveFormClass,
  yearFormatIsGood,
  noEmptyFields,
  toasty,
  //   trimTracks,
  //   handleIncrementReset,
  //   incrementCheckbox,
  //   handleCheckbox,
  //   incrementLocationSwitch,
  trimDataFields,
  addToSessionList,
  focusFirstField,
  handleThemeChange,
  removeActiveClass,
  showForm,
  initialShowForm,
  isLocValValid,
} from "./add-utils.js";
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
const sessionListWrapper = document.querySelector(".session-list-wrapper");
const sessionList = document.getElementById("session-list");
let showSessionList = false;
let initialLoad = true;
const mainEl = document.querySelector("main");

/**
 * when a nav button is clicked, show the appropriate form
 * @param {Event} e
 * @returns {void}
 */
function handleNavBtnClick(e) {
  if (e.target.classList.contains("active-nav-btn")) return;

  if (!initialLoad) {
    document.startViewTransition(() => {
      removeActiveFormClass(forms);
      removeActiveClass(navButtons);
      // the first arg is the id of the form to show, second arg is the nav btn
      showForm(e.target.dataset.form, e.target);
    });
  } else {
    showForm(e.target.dataset.form, e.target);
    // on the initial load, display the increment location option and the main element
    initialShowForm(mainEl, incrementWrapper);
    initialLoad = false;
  }
}

// async function handleCdCompsForm(e) {
//   e.preventDefault();
//   const formData = new FormData(cdCompsForm);

// get the option elems
// const cdCompOptionElems = Array.from(
//   document.querySelectorAll("#cd-comps-datalist option"),
// );
// map the options' text to a valid array
// const validCdCompsLocs = cdCompOptionElems.map((el) => el.value);
// the input element itself to access the current value
// const cdCompsInput = document.getElementById("cd-comps-location");

// ----- convert track data from a long string to nested arrays
// the whole string
// const tracksFull = formData.get("tracks").trim().split("\n");
// initialize to undefined to later test easier for empty tracks field
// let tracksToSend = undefined;

// loop through and break down each track to array of artist and title
// tracksFull.forEach((tr) => {
// i use the pipe to split on
// const track = tr.split("|");
// if (!track[0] || !track[1]) {
//   toasty("Check your track data. Must be <artist>|<title>.", "red");
//   toasty(
//     `${
//       track[0] === ""
//         ? "All tracks must have an artist"
//         : "All tracks must have a track name"
//     }`,
//     "red",
//   );
//   return;
// }
// if (track.length === 2) {
// if still undefined, create an empty array
// if (!tracksToSend) {
//   tracksToSend = [];
// }
// cleanup and push
//     track[0] = track[0].trim();
//     track[1] = track[1].trim();
//     tracksToSend.push(track);
//   } else {
//     toasty("Check your track data. Must be <artist>|<title>.", "red");
//     return;
//   }
// });

// const data = {
//   title: formData.get("title"),
//   year: Number(formData.get("year")),
//   location: formData.get("location"),
//   tracks: tracksToSend,
// };

// const options = {
//   method: "POST",
//   headers: {
//     "content-type": "application/json",
//   },
//   body: JSON.stringify(trimDataFields(data)),
// };

// if (!noEmptyFields(data, true)) {
//   toasty("All fields must be filled out.", "red");
//   return;
// }

// if (!yearFormatIsGood(data.year)) {
//   toasty("Year must be 4 digits.", "red");
//   return;
// }

// if (
//   noEmptyFields(data, true) &&
//   isLocValValid(cdCompsInput, validCdCompsLocs)
// ) {
//   try {
//     const res = await fetch("/cd-comps", options);

//     if (res.status === 400) {
//       const errs = await res.json();
//       errs.forEach((er) => {
//         toasty(`Value: ${er.value} ; Message: ${er.msg}`, "red");
//         console.log(`Value: ${er.value} ; Message: ${er.msg}`);
//       });
//       return;
//     }

//     if (res.status === 201) {
//       const resData = await res.json();
//       const id = resData.titleId;

//       cdCompsForm.reset();
//       toasty(
//         `${data.title} has been added to the database with id ${id}.`,
//         "green",
//       );

//       if (incrementLocationSwitch()) {
//         await getLocations();
//         handleIncrementReset();
//       }

//       if (!showSessionList) {
//         showSessionList = true;
//         sessionListWrapper.style.display = "block";
//       }

// add item data to the session list
//         const sessionListStr = `id: ${id} ${data.title} was added to cd comps`;
//         addToSessionList(sessionList, sessionListStr, "cd-comp-color");
//         focusFirstField(cdCompsForm);
//         console.log("new item id: ", id);
//         window.scrollTo(0, 0);
//       }
//     } catch (error) {
//       toasty(error, "red");
//       console.log(error);
//     }
//   }
// }

// async function handleCdSinglesForm(e) {
//   e.preventDefault();
// get the form data
// const formData = new FormData(cdSinglesForm);
// break down the tracks string to an array, each track gets trimmed later
// const trackList = formData.get("tracks").trim().split("\n");
// get the option elems
// const cdSinglesOptionElems = Array.from(
//   document.querySelectorAll("#cd-singles-datalist option"),
// );
// map the options' text to a valid array
// const validCdSingleLocs = cdSinglesOptionElems.map((el) => el.value);
// the input element itself to access the current value
// const cdSinglesInput = document.getElementById("cd-singles-case-type");

// const data = {
//   artist: formData.get("artist"),
//   title: formData.get("title"),
//   year: Number(formData.get("year")),
//   caseType: formData.get("caseType"),
//   tracks: trimTracks(trackList),
// };

// if (!noEmptyFields(data, true)) {
//   toasty("All fields must be filled out.", "red");
//   return;
// }

// if (!yearFormatIsGood(data.year)) {
//   toasty("Year must be 4 digits", "red");
//   return;
// }

// if only the tracks are empty
// if (!trackList[0] && noEmptyFields(data, true)) {
//   toasty("Please add some tracks.", "red");
//   return;
// }

// const options = {
//   method: "POST",
//   headers: {
//     "content-type": "application/json",
//   },
//   body: JSON.stringify(trimDataFields(data)),
// };

// if (
//   noEmptyFields(data, true) &&
//   isLocValValid(cdSinglesInput, validCdSingleLocs)
// ) {
//   try {
//     const res = await fetch("/cd-singles", options);

//     if (res.status === 400) {
//       const errs = await res.json();
//       errs.forEach((er) => {
//         toasty(`Value: ${er.value} ; Message: ${er.msg}`, "red");
//         console.log(`Value: ${er.value} ; Message: ${er.msg}`);
//       });
//       return;
//     }

//     if (res.status === 201) {
//       const id = await res.json();
//       cdSinglesForm.reset();
//       focusFirstField(cdSinglesForm);
//       toasty(
//         `${data.artist} - ${data.title} was added to the database with id: ${id}`,
//         "green",
//       );

//       console.log("new item id: ", id);

//       if (!showSessionList) {
//         showSessionList = true;
//         sessionListWrapper.style.display = "block";
//       }

//       window.scrollTo(0, 0);

// add item data to the session list
// const sessionListStr = `id: ${id} ${data.artist} - ${data.title} was added to cd singles.`;
// addToSessionList(sessionList, sessionListStr, "cd-single-color");
// these locations are fixed and will not be incremented
//       }
//     } catch (error) {
//       toasty(error, "red");
//       console.log(error);
//     }
//   }
// }

/**
 * this handles the submit of the
 * cds main insert form
 * @param {Event} e
 * @returns {void}
 */
async function handleCdsMainForm(e) {
  e.preventDefault();
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
      focusFirstField(cdsMainForm);
      window.scrollTo(0, 0);

      // will revisit this later
      // if (incrementLocationSwitch()) {
      //   await getLocations();
      //   handleIncrementReset();
      // }

      // if this is the first entry for this session,
      // display the current session list
      if (!showSessionList) {
        showSessionList = true;
        sessionListWrapper.style.display = "block";
      }

      // add item data to the session list
      const sessionListStr = `id: ${res} ${data.artist} - ${data.title} was added to cds main.`;
      addToSessionList(sessionList, sessionListStr, "cds-main-color");
      // }
    } catch (error) {
      toasty(error, "red");
    }
  }
}

// async function handleRecordsForm(e) {
//   e.preventDefault();
//   const formData = new FormData(recordsForm);

// get the option elements
// const recordsOptionElems = Array.from(
//   document.querySelectorAll("#records-datalist option"),
// );

// map the options' text to a valid array
// const validRecordsLocs = recordsOptionElems.map((el) => el.value);

// the input element itself to access the current value
// const recordsInput = document.getElementById("records-location");

// const data = {
//   artist: formData.get("artist"),
//   title: formData.get("title"),
//   location: formData.get("location"),
//   year: Number(formData.get("year")),
//   diameter: formData.get("diameter"),
//   sleeve_condition: formData.get("sleeveCondition"),
//   record_condition: formData.get("recordCondition"),
//   label: formData.get("label"),
// };

// if (!noEmptyFields(data, false)) {
//   toasty("All fields must be filled out.", "red");
//   console.log("All fields must be filled out.");
//   return;
// }

// if (!yearFormatIsGood(data.year)) {
//   toasty("Year must be 4 digits", "red");
//   return;
// }

// const options = {
//   method: "POST",
//   headers: {
//     "content-type": "application/json",
//   },
//   body: JSON.stringify(trimDataFields(data)),
// };

// if (
//   noEmptyFields(data, false) &&
//   isLocValValid(recordsInput, validRecordsLocs)
// ) {
//   try {
//     const res = await fetch("/records", options);

//     if (res.status === 400) {
//       const errs = await res.json();
//       errs.forEach((er) => {
//         toasty(`Value: ${er.value} ; Message: ${er.msg}`, "red");
//         console.log(`Value: ${er.value} ; Message: ${er.msg}`);
//       });
//       return;
//     }

//     if (res.status === 201) {
//       const resData = await res.json();
//       recordsForm.reset();
//       focusFirstField(recordsForm);
//       toasty(
//         `${data.artist} - ${data.title} has been added to the database with id: ${resData}`,
//         "green",
//       );

//       console.log("new item id: ", resData);

//       if (incrementLocationSwitch()) {
//         await getLocations();
//         handleIncrementReset();
//       }

//       if (!showSessionList) {
//         showSessionList = true;
//         sessionListWrapper.style.display = "block";
//       }

//       window.scrollTo(0, 0);

// add item data to the session list
//         const sessionListStr = `id: ${resData} ${data.artist} - ${data.title} was added to records.`;
//         addToSessionList(sessionList, sessionListStr, "record-color");
//       }
//     } catch (error) {
//       toasty(error, "red");
//       console.log(error);
//     }
//   }
// }

/**
 * this handles the submit of the
 * tapes insert form
 * @param {Event} e
 * @returns {void}
 */
async function handleTapesForm(e) {
  e.preventDefault();
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

  if (!noEmptyFields(data, false)) {
    toasty("All fields must be filled out.", "red");
    console.log("All fields must be filled out.");
    return;
  }

  if (!yearFormatIsGood(data.year)) {
    toasty("Year must be 4 digits", "red");
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
      focusFirstField(tapesForm);
      window.scrollTo(0, 0);

      // if (incrementLocationSwitch()) {
      //   await getLocations();
      //   handleIncrementReset();
      // }

      // if this is the first entry for this session,
      // display the current session list
      if (!showSessionList) {
        showSessionList = true;
        sessionListWrapper.style.display = "block";
      }

      // add item data to the session list
      const sessionListStr = `id: ${res} ${data.artist} - ${data.title} was added to tapes.`;
      addToSessionList(sessionList, sessionListStr, "tape-color");
    } catch (error) {
      console.log(error);
    }
  }
}

// add the listeners to the nav btns
navButtons.forEach((btn) => {
  btn.addEventListener("click", handleNavBtnClick);
});

// if the increment checkbox is checked and then the location is changed
// const selects = document.querySelectorAll("select");
// selects.forEach((sel) => {
//   sel.addEventListener("change", handleIncrementReset);
// });

// submit listeners on the forms
cdsMainForm.addEventListener("submit", handleCdsMainForm);
// cdCompsForm.addEventListener("submit", handleCdCompsForm);
// cdSinglesForm.addEventListener("submit", handleCdSinglesForm);
// recordsForm.addEventListener("submit", handleRecordsForm);
tapesForm.addEventListener("submit", handleTapesForm);
// incrementCheckbox.addEventListener("change", () => {
//   handleCheckbox(forms);
// });

// slider
const themeSlider = document.getElementById("theme-slider");
const slide = document.getElementById("slide");
let theme = document.documentElement.getAttribute("data-theme");

/**
 * toggle themes
 * @returns {void}
 */
function handleThemeToggle() {
  if (theme === "dark") {
    theme = "light";
    slide.style.right = ".125rem";
    handleThemeChange();
  } else {
    theme = "dark";
    slide.style.right = "1.125rem";
    handleThemeChange();
  }
}

themeSlider.addEventListener("click", handleThemeToggle);
