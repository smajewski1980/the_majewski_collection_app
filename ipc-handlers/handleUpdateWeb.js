const handleGetWebUpdateData = require("./handleGetWebUpdateData");
const handleWebChangesGit = require("./handleWebChangesGit");

async function updateDataAndPushToWeb() {
  try {
    const updateDataResponse = await handleGetWebUpdateData();

    if (updateDataResponse === "success") {
      try {
        const isGitUpdated = handleWebChangesGit();

        let msg;
        isGitUpdated === 1 ? (msg = "success") : (msg = isGitUpdated);

        return msg;
      } catch (error) {
        console.log(error);
      }
    } else {
      throw new Error(updateDataResponse);
    }
  } catch (error) {
    console.log(error);
  }
}

module.exports = updateDataAndPushToWeb;
