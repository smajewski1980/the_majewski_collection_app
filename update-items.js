import {
  removeActiveFormClass,
  removeActiveClass,
  showForm,
  initialShowForm,
} from "./add-utils.js";
const mainEl = document.querySelector("main");
let initialLoad = true;
let currentForm = null;
const btnComps = document.querySelector(".btn-cd-comps");
const btnSingles = document.querySelector(".btn-cd-singles");
const btnMain = document.querySelector(".btn-cd-main");
const btnRecords = document.querySelector(".btn-records");
const btnTapes = document.querySelector(".btn-tapes");
const navButtons = [btnComps, btnSingles, btnMain, btnRecords, btnTapes];

/**
 * when a nav button is clicked, show the appropriate form
 * @param {Event} e
 * @returns {void}
 */
function handleNavBtnClick(e) {
  if (e.target.classList.contains("active-nav-btn")) {
    document.getElementById(`${e.target.dataset.form}`).reset();
    return;
  }
  currentForm = e.target.dataset.form;

  if (!initialLoad) {
    document.startViewTransition(() => {
      // removeActiveFormClass(forms);
      removeActiveClass(navButtons);
      // the first arg is the id of the form to show, second arg is the nav btn
      showForm(e.target.dataset.form, e.target);
    });
  } else {
    showForm(e.target.dataset.form, e.target);

    // on the initial load, display the increment location option and the main element
    initialShowForm(mainEl, null);
    initialLoad = false;
  }
}

// add the listeners to the nav btns
navButtons.forEach((btn) => {
  btn.addEventListener("click", handleNavBtnClick);
});
