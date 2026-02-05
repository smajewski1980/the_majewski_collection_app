const pool = require("../dbconnect.js");

/**
 * query and return the fields of the tapes table
 * @param {Event} e
 * @returns {Array}
 */
async function handleGetTapesFields(e) {
  const fieldList = [];

  try {
    const result = await pool.query(
      "SELECT column_name FROM information_schema.columns WHERE table_name = 'tapes'",
    );

    result.rows.forEach((row) => {
      fieldList.push(row.column_name);
    });
  } catch (error) {
    console.log(error);
  }
  return fieldList.sort();
}

module.exports = handleGetTapesFields;
