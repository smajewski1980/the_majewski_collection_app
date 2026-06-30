const pool = require("../dbconnect.js");

async function handleAllFormatQuery(e, data) {
  try {
    const result = await pool.query(
      ` WITH filtered_cds AS (
      SELECT id, artist, title, location
      FROM cds
      WHERE LOWER(artist) LIKE LOWER($1)
    ), filtered_records AS (
      SELECT id, artist, title, location
      FROM records
      WHERE LOWER(artist) LIKE LOWER($1)
    ), filtered_tapes AS (
      SELECT id, artist, title, location
      FROM tapes
      WHERE LOWER(artist) LIKE LOWER($1)
    ), filtered_cd_singles AS (
      SELECT single_id as id, artist, title, case_type AS location
      FROM cd_singles
      WHERE LOWER(artist) LIKE LOWER($1)
    ), filtered_cd_comps AS (
      SELECT title_id, artist, track_name, location
      FROM cd_comps_for_all_format_query
      WHERE LOWER(artist) LIKE LOWER($1)
    )

      SELECT * FROM filtered_cds
      UNION ALL
      SELECT * FROM filtered_records
      UNION ALL
      SELECT * FROM filtered_tapes
      UNION ALL
      SELECT * FROM filtered_cd_singles
      UNION ALL
      SELECT title_id as id, artist, track_name as title, location FROM filtered_cd_comps

      ORDER BY location, title;
    `,
      [`%${data}%`],
    );
    return result.rows;
  } catch (error) {
    console.log(error);
    return ["error", error];
  }
}

module.exports = handleAllFormatQuery;
