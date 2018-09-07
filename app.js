let initialConfig = {
  lineCap: "round",
  lineJoin: "round",
  lineWidth: 5,
  miterLimit: 5,
  strokeStyle: "#000",
  fillStyle: "#000"
};
let config = JSON.parse(window.localStorage.getItem("config")) || initialConfig;

const updateOPtions = function(event) {
  const currentInput = event.target;
  config[currentInput.id] = this.value;
  if (currentInput.type == "color") {
    currentInput.previousElementSibling.children[0].style.background = this.value;
  }
  console.log("updated config");
  console.table(config);
};

for (option in config) {
  const ele = document.getElementById(option);
  ele.addEventListener("input", updateOPtions);
  ele.addEventListener("change", updateOPtions);
  if (option == "strokeStyle" || option == "fillStyle") {
    ele.previousElementSibling.children[0].style.background = config[option];
  }
  ele.value = config[option];
  // debugger;
}

[...document.querySelectorAll("[tabindex='0']")].forEach(ele =>
  ele.addEventListener("keyup", function() {
    if (event.keyCode == 13) this.click();
  })
);

// Canvas Drawing code

const canvas = document.getElementById("mycanvas");
console.dir(canvas);

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

const pen = canvas.getContext("2d");

let isDrawing = false;

let lastX = 0,
  lastY = 0;

const drawStart = function(event) {
  console.log(event);
  this.focus();
  isDrawing = true;
  lastX = event.offsetX;
  lastY = event.offsetY;
  canvas.onselectstart = function () { return false; };
  updatePenConfig();
  event.preventDefault();
};

const drawing = function(event) {
  if (!isDrawing) return;
  console.log(event);
  pen.beginPath();
  console.log(lastX, lastY);
  pen.moveTo(lastX, lastY);
  const currentX =
  event.offsetX ||
  event.targetTouches[event.targetTouches.length - 1].pageX -
  canvas.offsetLeft;
  const currentY =
  event.offsetY ||
  event.targetTouches[event.targetTouches.length - 1].pageY -
  canvas.offsetTop;
  pen.lineTo(currentX, currentY);
  pen.stroke();
  lastX = currentX;
  lastY = currentY;
  event.preventDefault();
};

const drawEnd = function(event) {
  isDrawing = false;
  canvas.onselectstart = null;
  event.preventDefault();
};
canvas.addEventListener("mousedown", drawStart);

canvas.addEventListener("mouseup", drawEnd);

canvas.addEventListener("mousemove", drawing);

canvas.addEventListener("touchstart", drawStart);

canvas.addEventListener("touchmove", drawing);

canvas.addEventListener("touchend", drawEnd);

const updatePenConfig = function() {
  for (option in config) {
    pen[option] = config[option];
  }
  console.log(pen);
};

const clearCanvas = function() {
  pen.clearRect(0, 0, canvas.width, canvas.height);
};

const downloadCanvas = function() {
  // let data = pen.getImageData(0, 0, canvas.width, canvas.height);
  // console.log(data);
  let link = document.createElement("a");
  link.setAttribute("download", "MyPaint.png");
  link.setAttribute(
    "href",
    canvas.toDataURL("image/png").replace("image/png", "image/octet-stream")
  );
  link.click();
};

document.querySelector("#delete").addEventListener("click", clearCanvas);
document.querySelector("#download").addEventListener("click", downloadCanvas);

window.addEventListener("beforeunload", function() {
  window.localStorage.setItem("config", JSON.stringify(config));
});

window.addEventListener("resize", function() {
  let data = pen.getImageData(0, 0, canvas.width, canvas.height);
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  pen.putImageData(data, 0, 0);
});
