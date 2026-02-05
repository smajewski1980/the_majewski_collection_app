const pool = require("../dbconnect.js");

/**
 * query and return the fields of the cd singles and cd singles tracks table
 * @param {Event} e
 * @returns {Array}
 */
async function handleGetCdSinglesFields(e) {
  const fieldList = [];

  const query = `
    SELECT column_name FROM information_schema.columns WHERE table_name = 'cd_singles'
    UNION
    SELECT column_name FROM information_schema.columns WHERE table_name = 'cd_singles_tracks';
    `;

  try {
    const result = await pool.query(query);

    result.rows.forEach((row) => {
      fieldList.push(row.column_name);
    });
  } catch (error) {
    console.log(error);
  }

  return fieldList.sort();
}

module.exports = handleGetCdSinglesFields;
