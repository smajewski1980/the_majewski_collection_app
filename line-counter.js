const compsTracksCounter = document.querySelector(".comps-line-ctr");
const compsTextarea = document.getElementById("cd-comps-tracks");
const singTracksCounter = document.querySelector(".sing-line-ctr");
const singTextarea = document.getElementById("cd-singles-tracks");

compsTextarea.addEventListener("keydown", (e) => {
  setTimeout(() => {
    const currText = e.target.value.slice(0, compsTextarea.selectionStart);
    const lineNum = currText.split("\n").length;
    compsTracksCounter.textContent = lineNum;
  }, 25);
});

singTextarea.addEventListener("keydown", (e) => {
  setTimeout(() => {
    const currText = e.target.value.slice(0, singTextarea.selectionStart);
    const lineNum = currText.split("\n").length;
    singTracksCounter.textContent = lineNum;
  }, 25);
});
