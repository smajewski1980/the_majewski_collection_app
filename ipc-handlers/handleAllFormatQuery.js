const pool = require("../dbconnect.js");

async function handleAllFormatQuery(e, data) {
  console.log(data);
  // write the query
  const result = await pool.query(
    ` WITH filtered_cds AS (
      SELECT artist, title, location
      FROM cds
      WHERE LOWER(artist) LIKE LOWER($1)
    ), filtered_records AS (
      SELECT artist, title, location
      FROM records
      WHERE LOWER(artist) LIKE LOWER($1)
    ), filtered_tapes AS (
      SELECT artist, title, location
      FROM tapes
      WHERE LOWER(artist) LIKE LOWER($1)
    ), filtered_cd_singles AS (
      SELECT artist, title, case_type AS location
      FROM cd_singles
      WHERE LOWER(artist) LIKE LOWER($1)
    ), filtered_cd_comps AS (
      SELECT artist, title, location
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
      SELECT DISTINCT ON (title) artist, title, location FROM filtered_cd_comps

      ORDER BY location;
    `,
    [`%${data}%`],
  );

  return result.rows;
}

module.exports = handleAllFormatQuery;
