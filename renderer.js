import ut from "./utils.js";
const format = document.getElementById("query-format");
const field = document.getElementById("query-field");
const term = document.getElementById("query-term");
const btnLookup = document.getElementById("btn-lookup");
const getFormatFields = window.getFormatFields;

ut.toggleInertEl(field, true);
ut.toggleInertEl(term, true);

format.addEventListener("change", async (e) => {
  switch (e.target.value) {
    case "records":
      const recRes = await getFormatFields.getRecordsFields("getRecordsFields");
      ut.populateSelectOptions(recRes, field);
      ut.toggleInertEl(field, false);
      break;
    case "tapes":
      const tapesRes = await getFormatFields.getTapesFields("getTapesFields");
      ut.populateSelectOptions(tapesRes, field);
      ut.toggleInertEl(field, false);
      break;
    case "cds":
      const cdsRes = await getFormatFields.getCdsFields("getCdsFields");
      ut.populateSelectOptions(cdsRes, field);
      ut.toggleInertEl(field, false);
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
