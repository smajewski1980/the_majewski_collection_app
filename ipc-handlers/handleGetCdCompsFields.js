const pool = require("../dbconnect.js");
const cdCompilationsQuery = require("./queries/cdCompilationsQuery.js");

/**
 * query and return the fields of the cd compilations and cd compilations tracks table
 * @param {Event} e
 * @returns {Array}
 */
async function handleGetCdCompsFields(e) {
  const fieldList = [];

  try {
    const result = await pool.query(cdCompilationsQuery);

    result.rows.forEach((row) => {
      fieldList.push(row.column_name);
    });
  } catch (error) {
    console.log(error);
  }

  return fieldList.sort();
}

module.exports = handleGetCdCompsFields;
