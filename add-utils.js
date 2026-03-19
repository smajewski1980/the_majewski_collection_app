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

// our toast config function
export function toasty(msg, color) {
  // later adapt this to our msg element
  console.log("old toasty", msg);
}

// trim singles track titles
export function trimTracks(arr) {
  const trimmed = [];
  arr.forEach((tr) => trimmed.push(tr.trim()));
  return trimmed;
}

// export function handleIncrementLocation(form) {
//   // now we take this form and change the select options value and text content
//   const selectedOption = Array.from(form.querySelectorAll("option")).filter(
//     (opt) => opt.selected,
//   )[0];
//   // take option value and split
//   const splitOptionVal = selectedOption.value.split(" ");

//   // take the -1 index and parse as num
//   let numVal = parseInt(splitOptionVal.at(-1));
//   // if one of the options without an ending number is selected, return
//   if (Number.isNaN(numVal)) return;
//   // increment num and add back to string
//   const incrementedNumString = (numVal += 1).toString();
//   splitOptionVal[splitOptionVal.length - 1] = incrementedNumString;
//   const reassembledString = splitOptionVal.join(" ");

//   // set the new vals

//   selectedOption.value = reassembledString;
//   selectedOption.textContent = reassembledString;
// }

// export const incrementCheckbox = document.getElementById("increment-location");

// export function handleIncrementReset() {
//   incrementCheckbox.checked = false;
// }

// export const incrementLocationSwitch = () => incrementCheckbox.checked;

// when the incr box is checked, get the active form
// export function handleCheckbox(arr) {
//   const activeForm = arr.filter((form) =>
//     form.classList.contains("active-form"),
//   );
//   if (incrementLocationSwitch()) {
//     if (
//       window.confirm(
//         "Once incremented, to undo, for now just refresh the page.",
//       )
//     ) {
//       handleIncrementLocation(activeForm[0]);
//     } else {
//       handleIncrementReset();
//       return;
//     }
//   }
// }

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
 * take a form element and places focus on the first input
 * @param {HTMLFormElement} form
 * @returns {void}
 */
export function focusFirstField(form) {
  const firstField = form.querySelector("input");
  firstField.focus();
}

/**
 * handles the page theme switch
 * @returns {void}
 */
export function handleThemeChange() {
  const currTheme = document.documentElement.getAttribute("data-theme");
  document.documentElement.style.colorScheme =
    currTheme === "light" ? "dark" : "light";
  document.documentElement.setAttribute(
    "data-theme",
    currTheme === "light" ? "dark" : "light",
  );
}

/**
 * remove active class from form select btns
 * @typedef {Array} btn
 * @property {HTMLButtonElement} btnComps
 * @property {HTMLButtonElement} btnSingles
 * @property {HTMLButtonElement} btnMain
 * @property {HTMLButtonElement} btnRecords
 * @property {HTMLButtonElement} btnTapes
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
