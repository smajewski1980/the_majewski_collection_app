const handleGetWebUpdateData = require("./handleGetWebUpdateData");
const { handleWebChangesGit } = require("./handleWebChangesGit");

async function updateDataAndPushToWeb(e) {
  try {
    const updateDataResponse = await handleGetWebUpdateData();

    if (updateDataResponse === "success") {
      handleWebChangesGit(e).catch((error) => {
        console.error("Background Git Sync Failed:", error);
      });

      return "success";
    } else {
      throw new Error(updateDataResponse);
    }
  } catch (error) {
    console.error("Error in updateDataAndPushToWeb orchestrator:", error);
    return error.message || "Failed to update data";
  }
}

module.exports = updateDataAndPushToWeb;
