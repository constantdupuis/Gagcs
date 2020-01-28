
const canvasShowBtns = document.querySelectorAll(".show-canvas");
console.log(canvasShowBtns);

canvasShowBtns.forEach(e => {
  e.addEventListener("click", classShowCanvas);
});

function classShowCanvas(e) {
  let id = e.target.id;
  id = id.substr(7);

  let reqURL = `api.v01/canvas/${id}`;

  console.log(reqURL);

  let req = new XMLHttpRequest();
  req.open("POST", reqURL);
  req.send("");
}
