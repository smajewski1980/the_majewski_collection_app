const pool = require("../dbconnect.js");

async function handleAllFormatQuery(e, data) {
  try {
    const result = await pool.query(
      ` WITH filtered_cds AS (
      SELECT id, artist, title, location
      FROM cds
      WHERE LOWER(artist) LIKE LOWER($1)
      ORDER BY title
    ), filtered_records AS (
      SELECT id, artist, title, location
      FROM records
      WHERE LOWER(artist) LIKE LOWER($1)
      ORDER BY title
    ), filtered_tapes AS (
      SELECT id, artist, title, location
      FROM tapes
      WHERE LOWER(artist) LIKE LOWER($1)
      ORDER BY title
    ), filtered_cd_singles AS (
      SELECT single_id, artist, track_name, case_type
      FROM cd_singles_for_all_format_query
      WHERE LOWER(artist) LIKE LOWER($1)
      ORDER BY track_name
    ), filtered_cd_comps AS (
      SELECT title_id, artist, track_name, location
      FROM cd_comps_for_all_format_query
      WHERE LOWER(artist) LIKE LOWER($1)
      ORDER BY track_name
    )

      SELECT * FROM filtered_cds
      UNION ALL
      SELECT * FROM filtered_records
      UNION ALL
      SELECT * FROM filtered_tapes
      UNION ALL
      SELECT 
        NULL AS id,
        '' AS artist,
        '' AS title,
        'unicorn47_flag' AS location
      UNION ALL
      SELECT single_id as id, artist, track_name as title, case_type as location FROM filtered_cd_singles
      UNION ALL
      SELECT title_id as id, artist, track_name as title, location FROM filtered_cd_comps;

      `,
      // ORDER BY location, title;
      [`%${data}%`],
    );
    return result.rows;
  } catch (error) {
    console.log(error);
    return ["error", error];
  }
}

module.exports = handleAllFormatQuery;
