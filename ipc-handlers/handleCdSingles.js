const pool = require("../dbconnect.js");

async function handleCdSingles(e, singlesData) {
  const msg = "hello from handle singles controller";
  console.log(msg);
  return msg;
}

module.exports = handleCdSingles;
