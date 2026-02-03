// import { getRecordsFields } from "./getFormatFields.js";
const format = document.getElementById("query-format");
const field = document.getElementById("query-field");
const term = document.getElementById("query-term");
const btnLookup = document.getElementById("btn-lookup");
const getFormatFields = window.getFormatFields;

field.inert = true;
const fieldGroup = field.parentElement;
fieldGroup.style.opacity = ".5";
const termGroup = term.parentElement;
termGroup.style.opacity = ".5";
term.inert = true;

format.addEventListener("change", (e) => {
  switch (e.target.value) {
    case "records":
      getFormatFields.getRecordsFields("getRecordsFields");
      field.inert = false;
      fieldGroup.style.opacity = "1";
      break;
    case "tapes":
      console.log("tapes was selected");
      break;
    case "cds":
      console.log("cds qwas selected");
      break;
    case "cd-comps":
      console.log("cd-comps was selected");
      break;
    case "cd-sing":
      console.log("cd-singles were selected");
      break;
    default:
      break;
  }
});

function handleLookupBtn(e) {
  e.preventDefault();
  const vals = { format: format.value, field: field.value, term: term.value };
}

// console.log(getRecordsFields());

btnLookup.addEventListener("click", handleLookupBtn);
