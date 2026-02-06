import ut from "./utils.js";
const format = document.getElementById("query-format");
const field = document.getElementById("query-field");
const term = document.getElementById("query-term");
const btnLookup = document.getElementById("btn-lookup");

ut.toggleInertEl(field, true);
ut.toggleInertEl(term, true);

// when the format is selected, the field select is made active
// and has its options loaded depending on which format
format.addEventListener("change", (e) => {
  ut.handleFormatSelection(e, field);
});

// when the field to search is selected, make term input active
field.addEventListener("change", (e) => {
  ut.toggleInertEl(term, false);
});

// once this is "hooked up", move to utils
function handleLookupBtn(e) {
  e.preventDefault();
  const vals = { format: format.value, field: field.value, term: term.value };
}

btnLookup.addEventListener("click", handleLookupBtn);
