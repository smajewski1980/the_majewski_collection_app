const pool = require("../dbconnect.js");

async function handleGetTotalItemQty(e) {
  try {
    const result = await pool.query(
      "SELECT grand_total FROM total_collection_item_qty",
    );

    return result.rows[0].grand_total;
  } catch (error) {
    console.log(error);
  }
}

module.exports = handleGetTotalItemQty;
