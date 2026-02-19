import ut from "./utils.js";
const format = document.getElementById("query-format");
const field = document.getElementById("query-field");
const term = document.getElementById("query-term");
const btnLookup = document.getElementById("btn-lookup");
const btnToTop = document.querySelector(".back-to-top");
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
  ut.toggleInertEl(term, false);
  ut.toggleInertEl(btnLookup, false);
});

// send the data for the query
btnLookup.addEventListener("click", (e) => {
  ut.handleLookupBtn(e, format.value, field.value, term.value);
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
    const firstChar = format.value[0].toUpperCase();
    const restChars = format.value.slice(1);
    const adjFormatStr = firstChar + restChars;
    if (
      ut.resultPage <
      ut.resultTotalPages(ut[`current${adjFormatStr}Data`]) - 1
    ) {
      console.log("loading more results");
      ut.resultPage++;
      ut[`display${adjFormatStr}`](
        ut[`current${adjFormatStr}Data`].slice(
          ut.resultStart(),
          ut.resultEnd(),
        ),
      );
    }
  }
});
