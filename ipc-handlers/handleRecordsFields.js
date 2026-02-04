const pool = require("../dbconnect.js");

async function handleRecordsFields(e) {
  const fieldList = [];
  try {
    const result = await pool.query(
      "select column_name from information_schema.columns where table_name = 'records'",
    );
    result.rows.forEach((row) => {
      fieldList.push(row.column_name);
    });
  } catch (error) {
    console.log(error);
  }
  return fieldList.sort();
}

module.exports = handleRecordsFields;
