const pool = require("../dbconnect.js");

/**
 * takes the query values and returns query results
 * @param {Event} e
 * @param {Object} data
 * @returns {Array}
 */
async function handleQueryValues(e, data) {
  let { format, field, term } = data;
  const compFields = ["title_id", "title", "year", "location"];
  const singleFields = ["single_id", "artist", "title", "year", "case_type"];

  if (format === "cd-compilations") {
    if (compFields.includes(field)) {
      // get an item by title_id
      if (field === "title_id") {
        const result = await pool.query(
          "SELECT * FROM cd_compilations cc JOIN cd_compilations_tracks cct ON cc.title_id = cct.title_id WHERE cc.title_id = $1",
          [term],
        );
        return result.rows;
      }
      // get items from a year
      if (field === "year") {
        const result = await pool.query(
          "SELECT * FROM cd_compilations cc JOIN cd_compilations_tracks cct ON cc.title_id = cct.title_id WHERE year = $1",
          [term],
        );
        return result.rows;
      }

      // for title or location
      const result = await pool.query(
        `SELECT * FROM cd_compilations cc JOIN cd_compilations_tracks cct ON cc.title_id = cct.title_id WHERE LOWER(${field}) like LOWER($1)`,
        [`%${term}%`],
      );
      return result.rows;
      // return "this will search the comps";
    } else {
      if (field === "artist") {
        const result = await pool.query(
          "SELECT cc.title_id FROM cd_compilations cc JOIN cd_compilations_tracks cct ON cc.title_id = cct.title_id WHERE LOWER(cct.artist) like LOWER($1)",
          [`%${term}%`],
        );
        const ids = new Set(result.rows.map((t) => t.title_id));
        const result2 = await pool.query(
          "SELECT * FROM cd_compilations cc JOIN cd_compilations_tracks cct ON cc.title_id = cct.title_id WHERE cc.title_id = ANY($1)",
          [[...ids]],
        );
        return result2.rows;
      }
      return "this will search the comps tracks";
    }
  }

  if (format === "cd-singles") {
    if (singleFields.includes(field)) {
      return "this will search the singles";
    } else {
      return "this will search the singles tracks";
    }
  }
  // for the fields that need a case-insensitive non-exact comparison
  if (
    field === "artist" ||
    field === "title" ||
    field === "location" ||
    field === "diameter" ||
    field === "label" ||
    field === "speed" ||
    field === "needs_repair"
  ) {
    if (field === "artist" && !term) {
      const result = await pool.query(
        `SELECT * FROM ${format} ORDER BY artist, title`,
      );
      return result.rows;
    }
    // if the selected field is 'location', order by location, artist
    const result = await pool.query(
      `SELECT * FROM ${format} WHERE LOWER(${field}) like LOWER($1) ORDER BY ${field !== "location" ? field : "substring(location FROM '([0-9]+)$')::integer, artist"}`,
      [`%${term}%`],
    );
    return result.rows;
  }
  if (field === "id" && !term) {
    const result = await pool.query(`SELECT * FROM ${format} ORDER BY id`);
    return result.rows;
  }
  // for the other fields
  const result = await pool.query(
    `SELECT * FROM ${format} WHERE ${field} = $1 ORDER BY artist, title`,
    [term],
  );
  return result.rows;
}

module.exports = handleQueryValues;
