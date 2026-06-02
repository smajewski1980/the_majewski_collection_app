const pool = require("../dbconnect.js");

function handleGetWebUpdateData() {
  console.log("printing a msg from the backend");
  return "heres a msg from the backend";
}

module.exports = handleGetWebUpdateData;
