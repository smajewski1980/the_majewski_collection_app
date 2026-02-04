const pool = require("../dbconnect.js");

async function handleTapesFields(e) {
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

module.exports = handleTapesFields;
