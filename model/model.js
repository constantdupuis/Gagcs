/**
 * WebServer for Generative Art Gallery Canvas
 */
const fs = require("fs");
const path = require("path");

let model = {};
model.version = "01";
model.port = 33366;
model.canvas = [];

/**
 * Load model
 * - load canvas description from there folders
 */
model.load = function(callback) {
  console.log(`Load model v${this.version}`);

  fs.readdir("./canvas", (err, items) => {
    console.log(items);
    items.forEach((e, i) => {
      let infoPath = "./canvas/" + e + "/infos.json";
      console.log("Load canvas", e, "from ", infoPath);
      let rawdata = fs.readFileSync(infoPath);
      let canvasNfo = JSON.parse(rawdata);
      canvasNfo.id = i;
      canvasNfo.path = e;
      this.canvas.push(canvasNfo);
    });

    callback();
  });
};

module.exports = model;
