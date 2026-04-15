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

  if (format === "cd-compilations") {
    if (compFields.includes(field)) {
      // get an item by title_id
      if (field === "title_id" && term) {
        try {
          const result = await pool.query(
            "SELECT * FROM cd_compilations cc JOIN cd_compilations_tracks cct ON cc.title_id = cct.title_id WHERE cc.title_id = $1",
            [term],
          );

          return result.rows;
        } catch (error) {
          console.log(error);
          return error;
        }
      }

      if (field === "year") {
        try {
          const result = await pool.query(
            "SELECT * FROM cd_compilations cc JOIN cd_compilations_tracks cct ON cc.title_id = cct.title_id WHERE year = $1 ORDER BY cc.title_id",
            [term],
          );

          return result.rows;
        } catch (error) {
          console.log(error);
          return error;
        }
      }

      // for title or location
      try {
        const result = await pool.query(
          `SELECT * FROM cd_compilations cc JOIN cd_compilations_tracks cct ON cc.title_id = cct.title_id WHERE LOWER(${field}) like LOWER($1) ORDER BY cc.title_id`,
          [`%${term}%`],
        );

        return result.rows;
      } catch (error) {
        console.log(error);
        return error;
      }
      // search tracks table fields, get the full title info and return
    } else if (field === "artist" || field === "track_name") {
      try {
        const result = await pool.query(
          `SELECT cc.title_id FROM cd_compilations cc JOIN cd_compilations_tracks cct ON cc.title_id = cct.title_id WHERE LOWER(cct.${field}) like LOWER($1)`,
          [`%${term}%`],
        );

        const ids = new Set(result.rows.map((t) => t.title_id));

        const result2 = await pool.query(
          "SELECT * FROM cd_compilations cc JOIN cd_compilations_tracks cct ON cc.title_id = cct.title_id WHERE cc.title_id = ANY($1) ORDER BY cc.title_id",
          [[...ids]],
        );

        return result2.rows;
      } catch (error) {}
    } else if (field === "track_id" && term) {
      try {
        // search by track id, get the full title info and return
        const result = await pool.query(
          "SELECT * FROM cd_compilations cc JOIN cd_compilations_tracks cct ON cc.title_id = cct.title_id WHERE cct.track_id = $1",
          [term],
        );

        const id = result.rows[0].title_id;

        const result2 = await pool.query(
          "SELECT * FROM cd_compilations cc JOIN cd_compilations_tracks cct ON cc.title_id = cct.title_id WHERE cc.title_id = $1",
          [id],
        );

        return result2.rows;
      } catch (error) {
        console.log(error);
        return error;
      }
    }
  }

  const singleFields = ["single_id", "artist", "title", "year", "case_type"];

  if (format === "cd-singles") {
    if (singleFields.includes(field)) {
      // get a single by single_id
      if (field === "single_id" && term) {
        try {
          const result = await pool.query(
            "SELECT * FROM cd_singles cs JOIN cd_singles_tracks cst ON cs.single_id = cst.single_id WHERE cs.single_id = $1 ORDER BY cs.single_id",
            [term],
          );

          return result.rows;
        } catch (error) {
          console.log(error);
          return error;
        }
      }
      // get single by artist, title, or case_type, non case-sensitive
      if (field === "artist" || field === "title" || field === "case_type") {
        try {
          const result = await pool.query(
            `SELECT * FROM cd_singles cs JOIN cd_singles_tracks cst ON cs.single_id = cst.single_id WHERE LOWER(${field}) LIKE LOWER($1) ORDER BY cs.single_id`,
            [`%${term}%`],
          );

          return result.rows;
        } catch (error) {
          console.log(error);
          return error;
        }
      }
      // get singles from a year
      if (field === "year") {
        try {
          const result = await pool.query(
            "SELECT * FROM cd_singles cs JOIN cd_singles_tracks cst ON cs.single_id = cst.single_id WHERE year = $1 ORDER BY cs.single_id",
            [term],
          );

          return result.rows;
        } catch (error) {
          console.log(error);
          return error;
        }
      }
    } else {
      // get a single by a given track_id
      if (field === "track_id" && term) {
        try {
          const result = await pool.query(
            // get the id of the single for the given track
            "SELECT * FROM cd_singles cs JOIN cd_singles_tracks cst ON cs.single_id = cst.single_id WHERE cst.track_id = $1 ORDER BY cs.single_id",
            [term],
          );

          if (!result.rows.length) {
            return [];
          }

          const singleId = result.rows[0].single_id;

          // get the single data for the given track's single id
          const result2 = await pool.query(
            "SELECT * FROM cd_singles cs JOIN cd_singles_tracks cst ON cs.single_id = cst.single_id WHERE cs.single_id = $1  ORDER BY cst.track_id",
            [singleId],
          );

          return result2.rows;
        } catch (error) {
          console.log(error);
          return error;
        }
      }
      // case insensitive
      if (field == "track_name") {
        try {
          const result = await pool.query(
            `SELECT * FROM cd_singles cs JOIN cd_singles_tracks cst ON cs.single_id = cst.single_id WHERE LOWER(track_name) LIKE LOWER($1) ORDER BY cs.single_id`,
            [`%${term}%`],
          );

          return result.rows;
        } catch (error) {
          console.log(error);
          return error;
        }
      }
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
      try {
        const result = await pool.query(
          `SELECT * FROM ${format} ORDER BY artist, title`,
        );

        return result.rows;
      } catch (error) {
        console.log(error);
        return error;
      }
    }
    // if the selected field is 'location', order by location, artist
    try {
      const result = await pool.query(
        `SELECT * FROM ${format} WHERE LOWER(${field}) like LOWER($1) ORDER BY ${field !== "location" ? field : "substring(location FROM '([0-9]+)$')::integer, artist"}`,
        [`%${term}%`],
      );

      return result.rows;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  // for the other fields
  try {
    const result = await pool.query(
      `SELECT * FROM ${format} WHERE ${field} = $1 ORDER BY artist, title`,
      [term],
    );
    return result.rows;
  } catch (error) {
    console.log(error);
    return error;
  }
}

module.exports = handleQueryValues;
