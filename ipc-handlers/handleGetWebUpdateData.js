const pool = require("../dbconnect.js");

function handleGetWebUpdateData() {
  console.log("printing a msg from the backend");
  return "heres a msg from the backend";
}

module.exports = handleGetWebUpdateData;

// need to query the 7 datasets
// need to convert them to JSON
// need to save them to the correct folder in the other project
// finish the website and set up ci/cd
// need to push the changes to git hub
