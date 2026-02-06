const pool = require("../dbconnect.js");

/**
 * takes the query values and returns query results
 * @param {Event} e
 * @param {Object} data
 * @returns {Array}
 */
async function handleQueryValues(e, data) {
  // need to switch the format for the correct query
  const { format, field, term } = data;
  const result = await pool.query(
    `SELECT * FROM ${format} WHERE ${field} = $1`,
    [term],
  );
  return result.rows;
}

module.exports = handleQueryValues;
