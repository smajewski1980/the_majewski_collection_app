import { toasty } from "./add-utils.js";

/**
 * queries and returns cd comp data when given a good cd comp id
 * @param {number} id
 * @returns {Object} cd comp object
 */
export async function getCdCompsDataById(id) {
  const vals = { format: "cd-compilations", field: "title_id", term: id };

  try {
    const res = await handleQueryValues.handleQueryValues(
      "handleQueryValues",
      vals,
    );

    if (!res.length) {
      throw new Error("No compilations found with that id.");
    }

    // get the data to the expected format for loading
    const finessedCompData = { ...res[0] };
    finessedCompData["tracks"] = [];
    res.forEach((row) => {
      finessedCompData.tracks.push([row.artist, row.track_name]);
    });

    return finessedCompData;
  } catch (error) {
    toasty(error);
  }
}

/**
 * queries and returns cd single data when given a good cd single id
 * @param {number} id
 * @returns {Object} cd single object
 */
export async function getCdSinglesDataById(id) {
  const vals = { format: "cd-singles", field: "single_id", term: id };

  try {
    const res = await handleQueryValues.handleQueryValues(
      "handleQueryValues",
      vals,
    );

    if (!res.length) {
      throw new Error("No singles found with that id.");
    }

    // get the data to the expected format for loading
    const finessedSingleData = { ...res[0] };
    finessedSingleData["tracks"] = [];
    finessedSingleData["caseType"] = finessedSingleData.case_type;
    res.forEach((row) => {
      finessedSingleData.tracks.push(row.track_name);
    });

    return finessedSingleData;
  } catch (error) {
    toasty(error);
  }
}

/**
 * queries and returns cd main data when given a good cd main id
 * @param {number} id
 * @returns {Object} cd main object
 */
export async function getCdsMainDataById(id) {
  const vals = { format: "cds", field: "id", term: id };

  try {
    const res = await handleQueryValues.handleQueryValues(
      "handleQueryValues",
      vals,
    );

    if (!res.length) {
      throw new Error("No cds found with that id.");
    }

    return res[0];
  } catch (error) {
    toasty(error);
  }
}

/**
 * queries and returns record data when given a good record id
 * @param {number} id
 * @returns {Object} record object
 */
export async function getRecordsDataById(id) {
  const vals = { format: "records", field: "id", term: id };

  try {
    const res = await handleQueryValues.handleQueryValues(
      "handleQueryValues",
      vals,
    );

    if (!res.length) {
      throw new Error("No records found with that id.");
    }

    return res[0];
  } catch (error) {
    toasty(error);
  }
}

/**
 * queries and returns tape data when given a good tape id
 * @param {number} id
 * @returns {Object} tape object
 */
export async function getTapesDataById(id) {
  const vals = { format: "tapes", field: "id", term: id };

  try {
    const res = await handleQueryValues.handleQueryValues(
      "handleQueryValues",
      vals,
    );

    if (!res.length) {
      throw new Error("No tapes found with that id.");
    }

    return res[0];
  } catch (error) {
    toasty(error);
  }
}
