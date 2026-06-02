const updateButton = document.getElementById("btn-update-web");

async function handleUpdateWeb() {
  // need to make some type of popover which confirms action
  // make a working on it state, status bar or a spinner or something

  try {
    const res = await updateWeb.getWebUpdateData("getWebUpdateData");
    console.log(await res);
  } catch (error) {
    console.log(error);
  }
  console.log("we got it working");
}

updateButton.addEventListener("click", handleUpdateWeb);
