import utils from "./utils.js";
const sessionList = document.getElementById("session-list");
let isToastShowing = false;

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
  if (tracksTrigger && (!data.tracks || !data.tracks.length)) {
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
  const msgEl = document.querySelector(".page-message");

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
    msgEl.classList.add("msg-animation");
    // remove the toast
    setTimeout(() => {
      msgEl.classList.add("msg-animation-undo");
      msgEl.classList.remove("msg-animation");
      // remove the undo animation class after it runs
      setTimeout(() => {
        msgEl.innerText = "";
        msgEl.classList.remove("msg-animation-undo");
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
 * gets the current session data, if it exists, populate the session list UIS
 * @returns {void}
 */
export async function updateUiSessionList() {
  const currSessionList = await sessionStore.sessionGet(
    "sessionGet",
    "currAdded",
  );
  if (!currSessionList.length) {
    return;
  }
  sessionList.innerHTML = "";
  currSessionList.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item[0];
    li.classList.add(item[1]);
    sessionList.append(li);
  });
  sessionList.parentElement.style.display = "block";
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
export function showForm(formStr, navBtn = null) {
  navBtn?.classList.add("active-nav-btn");
  const activeForm = document.getElementById(formStr);
  // remove the if later--------
  if (activeForm) {
    activeForm.classList.add("active-form");
    activeForm.querySelector("input").focus();
  }
  // ---------------
}

/**
 * On a fresh page load, when the first form is
 * selected, show appropriate elements
 * @param {HTMLElement} mainEl
 * @param {HTMLElement} incrementWrapper
 * @returns {void}
 */
export function initialShowForm(mainEl, incrementWrapper) {
  if (incrementWrapper) {
    incrementWrapper.style.display = "block";
  }
  setTimeout(() => {
    mainEl.style.opacity = 1;
  }, 50);
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

/**
 * formats the textarea track data to be ready for insertion to db
 * @param {Array} tracksArray array of lines from the tracks textarea
 * @param {HTMLFormElement} currForm
 * @returns
 */
export function formatCdCompsTracks(tracksArray, currForm) {
  let tracksToSend = [];
  // break down each track to array of artist and title
  tracksArray.forEach((tr) => {
    // i use the pipe to split on
    const track = tr.split("|");
    if (track.length !== 2 || track[0].length === 0 || track[1].length === 0) {
      toasty("Check your track data. Must be <artist>|<title>.", "red");
      toasty(
        `${
          track[0] === ""
            ? "All tracks must have an artist"
            : "All tracks must have a track name"
        }`,
        "red",
      );
      utils.toggleInertEl(currForm, false);
      return;
    }
    if (track.length === 2) {
      track[0] = track[0].trim();
      track[1] = track[1].trim();
      tracksToSend.push(track);
    } else {
      toasty("Check your track data. Must be <artist>|<title>.", "red");
      utils.toggleInertEl(currForm, false);
      return;
    }
  });
  return tracksToSend;
}
