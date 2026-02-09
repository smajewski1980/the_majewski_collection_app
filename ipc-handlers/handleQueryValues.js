const pool = require("../dbconnect.js");

/**
 * takes the query values and returns query results
 * @param {Event} e
 * @param {Object} data
 * @returns {Array}
 */
async function handleQueryValues(e, data) {
  let { format, field, term } = data;

  // for the fields that need a case-insensitive non-exact comparison
  if (
    field === "artist" ||
    field === "title" ||
    field === "location" ||
    field === "diameter" ||
    field === "speed"
  ) {
    const result = await pool.query(
      `SELECT * FROM ${format} WHERE LOWER(${field}) like LOWER($1)`,
      [`%${term}%`],
    );
    return result.rows;
  }
  // for the other fields
  const result = await pool.query(
    `SELECT * FROM ${format} WHERE ${field} = $1`,
    [term],
  );
  return result.rows;
}

module.exports = handleQueryValues;
