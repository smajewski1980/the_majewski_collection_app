const updateButton = document.getElementById("btn-update-confirm");

async function handleUpdateWeb(e) {
  // if the time is too long, make a working on it state, status bar or a spinner or something

  try {
    const res = await updateWeb.getWebUpdateData("getWebUpdateData");
    console.log(await res);
    e.target.closest("dialog").close();
  } catch (error) {
    console.log(error);
  }
  console.log("we got it working");
}

updateButton.addEventListener("click", handleUpdateWeb);
