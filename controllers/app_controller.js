/**
 * This the global app controller
 */
let ctrl = {};

ctrl.model = require("../model/model");
ctrl.webServer = require("./web_server");
ctrl.mainWindow = null;

ctrl.load = function(mainWindow) {
  this.mainWindow = mainWindow;
  this.model.load(() => {
    if (this.model.canvas.length == 0) {
      console.log("No canvas available");
      mainWindow.loadFile("nocanvas.html");
    } else {
      // load first canvas, later should be the default selected one
      this.loadCanvas(0);
    }
    // set web api rounting
    this.webServer.setup(33366, this.model, this);
  });
};

ctrl.loadCanvas = function(canvasId) {
  const loadURL = `./canvas/${this.model.canvas[canvasId].folder}/index.html`;
  console.log("Load canvas " + loadURL);
  this.mainWindow.loadFile(loadURL);
};
module.exports = ctrl;
