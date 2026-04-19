import { addToSessionStore } from "./add-utils.js";
let drawerIsOpen = false;
const scratchPad = document.querySelector(".scratch-pad");
const scratchPadSpan = document.querySelector(".scratch-pad span");
const textArea = document.getElementById("scratch-pad");

scratchPadSpan.addEventListener("click", (e) => {
  drawerIsOpen = !drawerIsOpen;
  if (drawerIsOpen) {
    scratchPad.style.left = "255px";
    scratchPadSpan.style.rotate = "180deg";
  } else {
    scratchPad.style.left = "0px";
    scratchPadSpan.style.rotate = "0deg";
  }
});

// get the value of scratch pad into session store
textArea.addEventListener("input", (e) => {
  addToSessionStore("", e.target.value, "scratchPad");
});
// populate the text area with the session store value on page load
async function loadScratchPadVal() {
  const scratchPadCurrVal = await sessionStore.sessionGet(
    "sessionGet",
    "scratchPad",
  );

  if (scratchPadCurrVal) {
    textArea.value = scratchPadCurrVal;
  }
}

loadScratchPadVal();
