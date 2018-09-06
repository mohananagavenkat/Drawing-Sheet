let initialConfig = {
  lineCap: "round",
  lineJoin: "round",
  lineWidth: 5,
  miterLimit: 5,
  strokeStyle: "#000",
  fillStyle: "#000"
};
let config = JSON.parse(window.localStorage.getItem("config")) || initialConfig;

for (option in config) {
  const ele = document.getElementById(option);
  const updateOPtions = function(event) {
    const currentInput = event.target;
    config[currentInput.id] = this.value;
    if (currentInput.type == "color") {
      currentInput.previousElementSibling.children[0].style.background = this.value;
    }
    console.log("updated config");
    console.table(config);
  };
  ele.addEventListener("input", updateOPtions);
  ele.addEventListener("change", updateOPtions);
  if (option == "strokeStyle" || option == "fillStyle") {
      ele.previousElementSibling.children[0].style.background = config[option];
  }
  ele.value = config[option];
  // debugger;
}

const canvasEle = document.getElementById("mycanvas");

const canvas = canvasEle.getContext("2d");

window.addEventListener("beforeunload", function() {
  window.localStorage.setItem("config", JSON.stringify(config));
});
