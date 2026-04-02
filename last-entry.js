function populateCdCompsFormFields(form, data) {
  const [title, year, location] = form.querySelectorAll("input");
  const textarea = form.querySelector("textarea");

  title.value = data.title;
  year.value = data.year;
  location.value = data.location;

  data.tracks.forEach((track, idx) => {
    textarea.value +=
      track[0] +
      "|" +
      track[1] +
      `${idx == data.tracks.length - 1 ? "" : "\n"}`;
  });
}

function populateCdSinglesFormFields(form, data) {
  const [artist, title, location, year] = form.querySelectorAll("input");
  const textarea = form.querySelector("textarea");

  artist.value = data.artist;
  title.value = data.title;
  location.value = data.caseType;
  year.value = data.year;

  data.tracks.forEach((track, idx) => {
    textarea.value += `${track}${idx == data.tracks.length - 1 ? "" : "\n"}`;
  });
}

function populateCdMainFormFields(form, data) {
  const [artist, title, location] = form.querySelectorAll("input");

  artist.value = data.artist;
  title.value = data.title;
  location.value = data.location;
}

function populateRecordsFormFields(form, data) {
  const [artist, title, location, year, label] = form.querySelectorAll("input");
  const [diameter, sleeveCondition, recordCondition] =
    form.querySelectorAll("select");

  artist.value = data.artist;
  title.value = data.title;
  location.value = data.location;
  year.value = data.year;
  label.value = data.label;
  diameter.value = data.diameter;

  sleeveCondition.value = data.sleeve_condition;
  recordCondition.value = data.record_condition;
}

function populateTapesFormFields(form, data) {
  const [artist, title, location, year] = form.querySelectorAll("input");
  const radioBtns = form.querySelectorAll('input[type="radio"]');
  const speed = form.querySelector("select");

  artist.value = data.artist;
  title.value = data.title;
  location.value = data.location;
  year.value = data.year;
  speed.value = data.speed;

  data.needsRepair === "Yes"
    ? (radioBtns[0].checked = true)
    : (radioBtns[1].checked = true);
}

export function populateFormWithLastEntry(form, data) {
  switch (form.id) {
    case "cd-comps-form":
      populateCdCompsFormFields(form, data);
      break;
    case "cd-singles-form":
      populateCdSinglesFormFields(form, data);
      break;
    case "cd-main-form":
      populateCdMainFormFields(form, data);
      break;
    case "records-form":
      populateRecordsFormFields(form, data);
      break;
    case "tapes-form":
      populateTapesFormFields(form, data);
      break;
    default:
      break;
  }
}

/**
 * this returns data from the most recent item entry for a given format
 * @param {string} formId the id of the active form
 * @returns {object} the last entry object
 */
export async function getLastEntry(formId) {
  switch (formId) {
    case "cd-comps-form":
      const currComps = await sessionStore.sessionGet(
        "sessionGet",
        "cdCompsCurr",
      );
      return currComps[0];
    case "cd-singles-form":
      const currSingles = await sessionStore.sessionGet(
        "sessionGet",
        "cdSinglesCurr",
      );
      return currSingles[0];
    case "cd-main-form":
      const currCdsMain = await sessionStore.sessionGet(
        "sessionGet",
        "cdsMainCurr",
      );
      return currCdsMain[0];
    case "records-form":
      const currRecords = await sessionStore.sessionGet(
        "sessionGet",
        "recordsCurr",
      );
      return currRecords[0];
    case "tapes-form":
      const currTapes = await sessionStore.sessionGet(
        "sessionGet",
        "tapesCurr",
      );
      return currTapes[0];
    default:
      break;
  }
  return formId;
}
