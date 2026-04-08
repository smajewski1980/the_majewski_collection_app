import ut from "./utils.js";
import { handleLookupBtn } from "./lookup.js";
const format = document.getElementById("query-format");
const field = document.getElementById("query-field");
const term = document.getElementById("query-term");
const btnLookup = document.getElementById("btn-lookup");
const btnToTop = document.querySelector(".back-to-top");
const btnHelp = document.getElementById("btn-help");
const btnHelpClose = document.getElementById("btn-close");
const dialog = document.getElementById("help-dialog");
let scrollDist;

ut.toggleInertEl(field, true);
ut.toggleInertEl(term, true);
ut.toggleInertEl(btnLookup, true);

// when the format is selected, the field select is made active
// and has its options loaded depending on which format
format.addEventListener("change", (e) => {
  ut.handleFormatSelection(e, field);
  term.value = "";
  ut.toggleInertEl(term, true);
  ut.toggleInertEl(btnLookup, true);
});

// when the field to search is selected, make term input active
field.addEventListener("change", (e) => {
  term.value = "";
  ut.toggleInertEl(term, false);
  ut.toggleInertEl(btnLookup, false);
});

// if enter is pressed in the term field, send the data for the query
term.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    handleLookupBtn(e, format.value, field.value, term.value);
  }
});

// send the data for the query
btnLookup.addEventListener("click", (e) => {
  handleLookupBtn(e, format.value, field.value, term.value);
});

// "infinite scrolling"
window.addEventListener("scroll", () => {
  scrollDist = window.scrollY;

  // enable back to top btn when scrolled a certain distance
  if (scrollDist > 300) {
    btnToTop.style.opacity = "1";
    btnToTop.style.pointerEvents = "auto";
  } else {
    btnToTop.style.opacity = "0";
    btnToTop.style.pointerEvents = "none";
  }

  // If we are 500px from the bottom, load more
  if (scrollDist + window.innerHeight >= document.body.offsetHeight - 500) {
    let adjFormatStr;
    if (format.value !== "cd-compilations" && format.value !== "cd-singles") {
      const firstChar = format.value[0].toUpperCase();
      const restChars = format.value.slice(1);
      adjFormatStr = firstChar + restChars;
    } else if (format.value === "cd-compilations") {
      adjFormatStr = "CdComps";
    } else if (format.value === "cd-singles") {
      adjFormatStr = "CdSingles";
    }
    if (
      ut.resultPage <
      ut.resultTotalPages(ut[`current${adjFormatStr}Data`]) - 1
    ) {
      console.log("loading more results");
      ut.resultPage++; //left of here getting this to work for comps and singles
      ut[`display${adjFormatStr}`](
        ut[`current${adjFormatStr}Data`].slice(
          ut.resultStart(),
          ut.resultEnd(),
        ),
      );
    }
  }
});

// these listeners are to make the help dialog fade in and out
btnHelp.addEventListener("click", (e) => {
  document.startViewTransition(() => {
    dialog.showModal();
  });
});

btnHelpClose.addEventListener("click", (e) => {
  document.startViewTransition(() => {
    dialog.close();
  });
});

window.addEventListener("click", (e) => {
  if (e.target === dialog) {
    document.startViewTransition(() => {
      dialog.close();
    });
  }
});

ut.resultPopover.addEventListener("click", (e) => {
  ut.resultPopover.hidePopover();
});
