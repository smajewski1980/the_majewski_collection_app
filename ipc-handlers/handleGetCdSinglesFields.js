const pool = require("../dbconnect.js");
const cdSinglesQuery = require("./queries/cdSinglesQuery.js");

/**
 * query and return the fields of the cd singles and cd singles tracks table
 * @param {Event} e
 * @returns {Array}
 */
async function handleGetCdSinglesFields(e) {
  const fieldList = [];

  try {
    const result = await pool.query(cdSinglesQuery);

    result.rows.forEach((row) => {
      fieldList.push(row.column_name);
    });
  } catch (error) {
    console.log(error);
  }

  return fieldList.sort();
}

module.exports = handleGetCdSinglesFields;
