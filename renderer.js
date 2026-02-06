import ut from "./utils.js";
const format = document.getElementById("query-format");
const field = document.getElementById("query-field");
const term = document.getElementById("query-term");
const btnLookup = document.getElementById("btn-lookup");
const getFormatFields = window.getFormatFields;

ut.toggleInertEl(field, true);
ut.toggleInertEl(term, true);

format.addEventListener("change", (e) => {
  ut.handleFormatSelection(e, field);
});

// once this is "hooked up", move to utils
function handleLookupBtn(e) {
  e.preventDefault();
  const vals = { format: format.value, field: field.value, term: term.value };
}

btnLookup.addEventListener("click", handleLookupBtn);
