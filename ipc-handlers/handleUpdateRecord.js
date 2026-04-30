const pool = require("../dbconnect.js");

/**
 * this takes the record data from
 * the form and does a db insert
 * @param {Event} e
 * @typedef {object} recordData
 * @property {string} id
 * @property {string} artist
 * @property {string} title
 * @property {string} location
 * @property {string} year
 * @property {string} diameter
 * @property {string} sleeve_condition
 * @property {string} record_condition
 * @property {string} label
 * @returns {number}
 */
async function handleUpdateRecord(e, recordData) {
  const {
    id,
    artist,
    title,
    location,
    year,
    diameter,
    sleeve_condition,
    record_condition,
    label,
  } = recordData;

  try {
    const res = await pool.query(
      "UPDATE records SET artist = $1, title = $2, location = $3, year = $4, diameter = $5, sleeve_condition = $6, record_condition = $7, label = $8 WHERE id = $9",
      [
        artist,
        title,
        location,
        parseInt(year),
        diameter,
        sleeve_condition,
        record_condition,
        label,
        parseInt(id),
      ],
    );

    console.log(`Id ${id} was updated successfully.`);

    return res.rowCount;
  } catch (error) {
    console.log(error);
    return error;
  }
}

module.exports = handleUpdateRecord;
