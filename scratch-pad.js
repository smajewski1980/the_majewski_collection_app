let drawerIsOpen = false;
const scratchPad = document.querySelector(".scratch-pad");
const scratchPadSpan = document.querySelector(".scratch-pad span");
const textArea = document.getElementById("scratch-pad");

scratchPadSpan.addEventListener("click", (e) => {
  drawerIsOpen = !drawerIsOpen;
  if (drawerIsOpen) {
    scratchPad.style.left = "255px";
  } else {
    scratchPad.style.left = "0px";
  }
});

// get the value of scratch pad into session store
textArea.addEventListener("input", (e) => {
  console.log(e.target.value);
});
// populate the text area with the session store value on page load
