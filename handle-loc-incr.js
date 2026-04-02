const btnConfirm = document.querySelector(".btn-confirm-increment");
export const incrementCheckbox = document.getElementById("increment-location");
export let incrementFlag = false;

/**
 * setter function to toggle the increment flag
 */
export function toggleIncFlag() {
  incrementFlag = !incrementFlag;
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
  // incrementFlag = false;
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
