const pool = require("../dbconnect.js");

async function handleDelete(e, delData) {
  const { id, currentForm } = delData;
  let format;
  let idType = "id";

  switch (currentForm) {
    case "cd-comps-form":
      format = "cd_compilations";
      idType = "title_id";
      break;
    case "cd-singles-form":
      format = "cd_singles";
      idType = "single_id";
      break;
    case "cd-main-form":
      format = "cds";
      break;
    case "records-form":
      format = "records";
      break;
    case "tapes-form":
      format = "tapes";
      break;
    default:
      break;
  }

  try {
    const res = await pool.query(
      `DELETE FROM ${format} WHERE ${idType} = ${id}::int`,
    );

    if (res.rowCount === 1) {
      return `Deleted id: ${id} from ${format}.`;
    }

    throw new Error("Something went wrong, please try again.");
  } catch (error) {
    console.log(error);
    return error;
  }
}

module.exports = handleDelete;
