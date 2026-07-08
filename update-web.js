import constants from "./constants.js";
import { toasty } from "./add-utils.js";

const updateButton = document.getElementById("btn-update-confirm");

async function handleUpdateWeb(e) {
  try {
    const res = await updateWeb.getWebUpdateData("getWebUpdateData");
    e.target.closest("dialog").close();
    if ((await res) === "success") {
      toasty(constants.toast.WEB_UPDATE_SUCCESS_MSG, "green");
    } else {
      toasty(await res, "red");
    }
  } catch (error) {
    console.log(error);
    toasty(error, "red");
  }
}

updateButton.addEventListener("click", handleUpdateWeb);
