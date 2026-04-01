export const incrementCheckbox = document.getElementById("increment-location");
export let incrementFlag = false;
let isToastShowing = false;
const btnConfirm = document.querySelector(".btn-confirm-increment");

/**
 * this takes the current forms id string and returns a class string for styling
 * @param {string} formId the id of the current form
 * @returns {string} a class string to be used to style the options in the current form
 */
export function getFormClassStr(formId) {
  switch (formId) {
    case "cd-comps-form":
      return "cd-comp-color";
    case "cd-singles-form":
      return "cd-single-color";
    case "cd-main-form":
      return "cds-main-color";
    case "records-form":
      return "record-color";
    case "tapes-form":
      return "tape-color";
    default:
      break;
  }
}

/**
 * takes an array of forms and removes the active class from each
 * @typedef {Array} forms
 * @property {HTMLFormElement} cdCompsForm
 * @property {HTMLFormElement} cdSinglesForm
 * @property {HTMLFormElement} cdsMainForm
 * @property {HTMLFormElement} btnRerecordsFormcords
 * @property {HTMLFormElement} tapesForm
 * @returns {void}
 */
export function removeActiveFormClass(forms) {
  forms.forEach((form) => {
    form.classList.remove("active-form");
  });
}

/**
 * check to make sure the year value is a valid number
 * @param {Number} year
 * @returns {Boolean}
 */
export function yearFormatIsGood(year) {
  const regex = /^[0-9]{4}$/;
  return regex.test(year);
}

/**
 * check the given data object for empty vals
 * @typedef {object} data
 * @property {string} artist
 * @property {string} title
 * @property {string} location
 * @param {Boolean} tracksTrigger
 * @returns {Boolean}
 */
export function noEmptyFields(data, tracksTrigger) {
  if (tracksTrigger && !data.tracks) {
    return false;
  }

  if ("year" in data && Number.isNaN(data.year)) {
    toasty("Year must be a number.", "red");
    return;
  }

  for (const key in data) {
    if (!data[key]) {
      return false;
    }
  }

  return true;
}

/**
 * custom toast message function
 * @param {String} msg
 * @param {String} color
 * @returns {void}
 */
export function toasty(msg, color) {
  const msgEl = document.querySelector(".add-page-message");

  if (color === "green") {
    msgEl.style.setProperty("--msg-clr", "chartreuse");
  }
  // if it's already showing, just append current msg to text
  // maybe later, make array of current toast messages to compare against
  // to prevent being able to keep hitting the button and having a ton keep popping in
  if (isToastShowing) {
    msgEl.innerText += `\n\n${msg}`;
  } else {
    isToastShowing = true;
    msgEl.innerText = msg;
    msgEl.classList.add("add-msg-animation");
    // remove the toast
    setTimeout(() => {
      msgEl.classList.add("add-msg-animation-undo");
      msgEl.classList.remove("add-msg-animation");
      // remove the undo animation class after it runs
      setTimeout(() => {
        msgEl.innerText = "";
        msgEl.classList.remove("add-msg-animation-undo");
        isToastShowing = false;
        if (color === "green") {
          msgEl.style.setProperty("--msg-clr", "var(--error-color)");
        }
      }, 500);
    }, 5000);
  }
}

/**
 * trim singles track titles
 * @param {string[]} arr
 * @returns {string[]}
 */
export function trimTracks(arr) {
  const trimmed = [];
  arr.forEach((tr) => trimmed.push(tr.trim()));
  return trimmed;
}

/**
 * takes the current location value, increments it,
 * and updates the ui and values for submission
 * @param {HTMLOptionElement} selectedOption
 * @param {HTMLInputElement} selectedInput
 * @returns {void}
 */
function handleIncrementLocation(selectedOption, selectedInput) {
  // split the option value, last index will be the number portion of location
  const splitOptionVal = selectedOption.value.split(" ");
  let numVal = parseInt(splitOptionVal.at(-1));

  // if one of the options without an ending number is selected, return
  if (Number.isNaN(numVal) || selectedInput.value === '33s 10"') {
    handleIncrementReset();
    toasty("That location can not be incremented.", null);
    return;
  }

  // increment num and reassemble string
  const incrementedNumString = (numVal += 1).toString();
  splitOptionVal[splitOptionVal.length - 1] = incrementedNumString;
  const reassembledString = splitOptionVal.join(" ");

  // set the new vals
  selectedOption.innerText = reassembledString;
  selectedOption.value = reassembledString;
  selectedInput.value = reassembledString;
}

/**
 * resets the increment process
 * @returns {void}
 */
export function handleIncrementReset() {
  // still have a bug if you accidentally try to
  // increment a location that shouldn't be
  // the checkbox stays inactive till the form resets
  incrementCheckbox.checked = false;
  incrementFlag = false;
  btnConfirm.style.display = "none";
}

/**
 * when the box is checked, get the active form to pass into the increment location function
 * @param {HTMLFormElement[]} arr
 * @returns {void}
 */
export async function handleCheckbox(arr) {
  const activeForm = arr.filter((form) =>
    form.classList.contains("active-form"),
  );

  // grab the active location input and the datalist
  const activeInput = activeForm[0].querySelector("input[name='location']");
  const datalist = activeInput.nextElementSibling;

  // if a location was never selected
  if (!activeInput.value) {
    toasty("Select a location to increment first.", null);
    incrementCheckbox.checked = false;
    incrementFlag = false;
    return;
  }
  // the window.confirm didnt work here in electron
  // this button provides a confirm check
  btnConfirm.style.display = "block";
  btnConfirm.addEventListener(
    "click",
    (e) => {
      e.preventDefault();
      // get the current option element to increment
      const optionEls = Array.from(datalist.querySelectorAll("option"));
      const currOption = optionEls.filter(
        (el) => el.textContent === activeInput.value,
      );

      handleIncrementLocation(currOption[0], activeInput);

      incrementFlag = true;
      btnConfirm.style.display = "none";
    },
    { once: true },
  );
}

/**
 * takes data object and trims the vals
 * @typedef {object} data
 * @property {string} artist
 * @property {string} title
 * @property {string} location
 * @returns {data} the trimmed data object
 */
export function trimDataFields(data) {
  for (const key in data) {
    if (typeof data[key] === "string") {
      data[key] = data[key].trim();
    }
  }
  return data;
}

/**
 * makes a li with a given string and prepends to
 * given list, also adds class to li to add styles
 * @param {HTMLUListElement} list
 * @param {String} str
 * @param {String} className
 * @returns {void}
 */
export function addToSessionList(list, str, className) {
  const li = document.createElement("li");
  li.textContent = str;
  li.classList.add(className);
  list.prepend(li);
}

/**
 * this takes data and send to the session store
 * @param {string} format format of the current form entry, '' if setting something else
 * @param {object} insertedData the data being sent to the session store
 * @param {string} optionalKey the key if not entering an inserted item
 * @returns {void}
 */
export async function addToSessionStore(
  format,
  insertedData,
  optionalKey = undefined,
) {
  if (format) {
    sessionStore.sessionSet("sessionSet", {
      key: `${format}Curr`,
      value: insertedData,
    });
  } else {
    sessionStore.sessionSet("sessionSet", {
      key: optionalKey,
      value: insertedData,
    });
  }

  console.log("item added to sessionStore");
}

/**
 * this returns data from the most recent item entry for a given format
 * @param {string} formId the id of the active form
 * @returns {object} the last entry object
 */
export async function getLastEntry(formId) {
  switch (formId) {
    case "cd-comps-form":
      const currComps = await sessionStore.sessionGet(
        "sessionGet",
        "cdCompsCurr",
      );
      return currComps[0];
    case "cd-singles-form":
      const currSingles = await sessionStore.sessionGet(
        "sessionGet",
        "cdSinglesCurr",
      );
      return currSingles[0];
    case "cd-main-form":
      const currCdsMain = await sessionStore.sessionGet(
        "sessionGet",
        "cdsMainCurr",
      );
      return currCdsMain[0];
    case "records-form":
      const currRecords = await sessionStore.sessionGet(
        "sessionGet",
        "recordsCurr",
      );
      return currRecords[0];
    case "tapes-form":
      const currTapes = await sessionStore.sessionGet(
        "sessionGet",
        "tapesCurr",
      );
      return currTapes[0];
    default:
      break;
  }
  return formId;
}

/**
 * take a form element and places focus on the first input
 * @param {HTMLFormElement} form
 * @returns {void}
 */
export function focusFirstField(form) {
  const firstField = form.querySelector("input");
  firstField.focus();
}

/**
 * remove active class from form select btns
 * @property {HTMLButtonElement[]} btns
 * @returns {void}
 */
export function removeActiveClass(btns) {
  btns.forEach((btn) => {
    btn.classList.remove("active-nav-btn");
  });
}

/**
 * apply the proper classes to display the selected
 * form and style the active button
 * @param {String} formStr
 * @param {HTMLButtonElement} navBtn
 * @returns {void}
 */
export function showForm(formStr, navBtn) {
  navBtn.classList.add("active-nav-btn");
  const activeForm = document.getElementById(formStr);
  activeForm.classList.add("active-form");
  activeForm.querySelector("input").focus();
}

/**
 * On a fresh page load, when the first form is
 * selected, show appropriate elements
 * @param {HTMLElement} mainEl
 * @param {HTMLElement} incrementWrapper
 * @returns {void}
 */
export function initialShowForm(mainEl, incrementWrapper) {
  incrementWrapper.style.display = "block";
  mainEl.style.opacity = 1;
}

/**
 * Check if the forms provided location is valid
 * @param {String} locVal
 * @param {Array} validArr
 * @returns {Boolean}
 */
export function isLocValValid(locVal, validArr) {
  if (validArr.includes(locVal)) {
    return true;
  } else {
    toasty("Location field does not contain a valid value.", "red");
    return false;
  }
}

function populateCdCompsFormFields(form, data) {
  const [title, year, location] = form.querySelectorAll("input");
  const textarea = form.querySelector("textarea");

  title.value = data.title;
  year.value = data.year;
  location.value = data.location;

  data.tracks.forEach((track, idx) => {
    textarea.value +=
      track[0] +
      "|" +
      track[1] +
      `${idx == data.tracks.length - 1 ? "" : "\n"}`;
  });
}

function populateCdSinglesFormFields(form, data) {
  const [artist, title, location, year] = form.querySelectorAll("input");
  const textarea = form.querySelector("textarea");

  artist.value = data.artist;
  title.value = data.title;
  location.value = data.caseType;
  year.value = data.year;

  data.tracks.forEach((track, idx) => {
    textarea.value += `${track}${idx == data.tracks.length - 1 ? "" : "\n"}`;
  });
}

function populateCdMainFormFields(form, data) {
  const [artist, title, location] = form.querySelectorAll("input");

  artist.value = data.artist;
  title.value = data.title;
  location.value = data.location;
}

function populateRecordsFormFields(form, data) {
  const [artist, title, location, year, label] = form.querySelectorAll("input");
  const [diameter, sleeveCondition, recordCondition] =
    form.querySelectorAll("select");

  artist.value = data.artist;
  title.value = data.title;
  location.value = data.location;
  year.value = data.year;
  label.value = data.label;
  diameter.value = data.diameter;

  sleeveCondition.value = data.sleeve_condition;
  recordCondition.value = data.record_condition;
}

function populateTapesFormFields(form, data) {
  const [artist, title, location, year] = form.querySelectorAll("input");
  const radioBtns = form.querySelectorAll('input[type="radio"]');
  const speed = form.querySelector("select");

  artist.value = data.artist;
  title.value = data.title;
  location.value = data.location;
  year.value = data.year;
  speed.value = data.speed;

  data.needsRepair === "Yes"
    ? (radioBtns[0].checked = true)
    : (radioBtns[1].checked = true);
}

export function populateFormWithLastEntry(form, data) {
  switch (form.id) {
    case "cd-comps-form":
      populateCdCompsFormFields(form, data);
      break;
    case "cd-singles-form":
      populateCdSinglesFormFields(form, data);
      break;
    case "cd-main-form":
      populateCdMainFormFields(form, data);
      break;
    case "records-form":
      populateRecordsFormFields(form, data);
      break;
    case "tapes-form":
      populateTapesFormFields(form, data);
      break;
    default:
      break;
  }

  console.log(data);
}
