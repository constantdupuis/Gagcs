/**
 * WebServer for Generative Art Gallery Canvas
 */
const express = require("express");

let webServer = {};
webServer.expInst = express();
webServer.model = null;
webServer.appController = null;

webServer.setup = function(port, model, appController) {
  this.model = model;
  this.appController = appController;
  console.log(
    `Setup RESTApi with model versio ${model.version} on port ${port}`
  );

  const apiRoute = express.Router();

  // root route, return info an app
  apiRoute.get("/", (req, res) => {
    res.json({
      api: "remote control",
      app: "Generative Art Gallery Canvas",
      author: "Constant Dupuis"
    });
  });

  // list available canvas
  apiRoute.get("/canvas", (req, res) => {
    res.json(model.canvas);
  });

  // activate a given canvas
  apiRoute.post("/canvas/:id", (req, res) => {
    //console.log(`Load canvas ${req.params.id}`);
    if (req.params.id >= this.model.canvas.length || req.params.id < 0) {
      // log this issue
      console.log(
        `API: Requested canvas index out of range [${req.params.id}]`
      );
      res
        .status(400)
        .send(`API: Requested canvas index out of range [${req.params.id}]`);
    } else {
      this.appController.loadCanvas(req.params.id);
      res.status(200).send(`Canvas [${req.params.id}] loaded`);
    }
  });

  this.expInst.use("/api.v01", apiRoute);

  this.expInst.listen(33366);
};

module.exports = webServer;
