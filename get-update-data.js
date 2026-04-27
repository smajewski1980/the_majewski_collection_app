import { toasty } from "./add-utils.js";

export async function getCdCompsDataById(id) {
  const vals = { format: "cd-compilations", field: "title_id", term: id };
  console.log("id is:", id);
}
export async function getCdSinglesDataById(id) {
  const vals = { format: "cd-singles", field: "single_id", term: id };
  console.log("id is:", id);
}
export async function getCdsMainDataById(id) {
  const vals = { format: "cds", field: "id", term: id };
  console.log("id is:", id);
}
export async function getRecordsDataById(id) {
  const vals = { format: "records", field: "id", term: id };
  console.log("id is:", id);
}
export async function getTapesDataById(id) {
  const vals = { format: "tapes", field: "id", term: id };

  try {
    const res = await handleQueryValues.handleQueryValues(
      "handleQueryValues",
      vals,
    );

    if (!res.length) {
      throw new Error("No items found with that id.");
    }

    return res[0];
  } catch (error) {
    toasty(error);
  }
}
