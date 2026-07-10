import constants from "./constants.js";
import { toasty } from "./add-utils.js";

const updateButton = document.getElementById("btn-update-confirm");

async function handleUpdateWeb(e) {
  const dialog = e.target.closest("dialog");

  try {
    if (dialog) dialog.close();

    // 1. Setup the real-time listener first!
    const removeListener = window.serverToast.onToastMessage((res) => {
      if (res === "MESSAGE COMPLETE") {
        console.log("Stream finished. Cleaning up listeners.");
        removeListener();
        toasty(constants.toast.WEB_UPDATE_SUCCESS_MSG, "green", 10000);
      } else {
        console.log("Processing message:", res);
        toasty(res, "green", 10000); // Logs now pop up one-by-one as they happen!
      }
    });

    console.log("Initiating web update data...");
    // 2. This triggers the orchestrator, which returns "success" instantly while Git runs
    const res = await updateWeb.getWebUpdateData("getWebUpdateData");
    console.log("Data initialization result:", res);

    if (res !== "success") {
      removeListener();
      toasty(res || "Failed to initialize update", "red");
    }
  } catch (error) {
    console.error("Caught error in handleUpdateWeb:", error);
    toasty(error?.message || "An unexpected error occurred", "red");
  }
}

updateButton.addEventListener("click", handleUpdateWeb);
