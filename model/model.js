const fs = require("fs");
const path = require("path");

model = {};
model.version = "0.1";
model.canvas = [];

model.load = function(callback) {
  console.log("Load model");

  fs.readdir("./canvas", (err, items) => {
    console.log(items);
    items.forEach((e, i) => {
      let infoPath = "./canvas/" + e + "/infos.json";
      console.log("Load canvas information", e, "info in ", infoPath);
      let rawdata = fs.readFileSync(infoPath);
      let canvasNfo = JSON.parse(rawdata);
      canvasNfo.id = i;
      canvasNfo.path = e;
      //console.log(canvasNfo);
      this.canvas.push(canvasNfo);
    });

    callback();
  });
};

module.exports = model;
