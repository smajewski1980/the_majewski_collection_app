const compsTracksCounter = document.querySelector(".comps-line-ctr");
const compsTextarea = document.getElementById("cd-comps-tracks");
const singTracksCounter = document.querySelector(".sing-line-ctr");
const singTextarea = document.getElementById("cd-singles-tracks");

function handleCompsTrackNums(e) {
  setTimeout(() => {
    const currText = e.target.value.slice(0, compsTextarea.selectionStart);
    const lineNum = currText.split("\n").length;
    compsTracksCounter.textContent = ` ${lineNum}`;
  }, 25);
}

function handleSinglesTrackNums(e) {
  setTimeout(() => {
    const currText = e.target.value.slice(0, singTextarea.selectionStart);
    const lineNum = currText.split("\n").length;
    singTracksCounter.textContent = ` ${lineNum}`;
  }, 25);
}

compsTextarea.addEventListener("keydown", handleCompsTrackNums);
compsTextarea.addEventListener("click", handleCompsTrackNums);
compsTextarea.addEventListener("blur", (e) => {
  compsTracksCounter.textContent = "s";
});

singTextarea.addEventListener("keydown", handleSinglesTrackNums);
singTextarea.addEventListener("click", handleSinglesTrackNums);
singTextarea.addEventListener("blur", (e) => {
  singTracksCounter.textContent = "s";
});
