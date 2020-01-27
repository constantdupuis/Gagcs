/**
 * WebServer for Generative Art Gallery Canvas
 */
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

let webServer = {};
webServer.expInst = express();
webServer.model = null;
webServer.appController = null;

/**
 * Setup the web server
 */
webServer.setup = function(port, model, appController) {
  this.model = model;
  this.appController = appController;

  // inject pug template engine
  // byr default look for pug emplate in folder "views"
  this.expInst.set("view engine", "pug");

  // add body-parser middleware
  this.expInst.use(bodyParser.urlencoded({ extended: false }));

  // add serving static files, css, js, fonts, images..
  // from public folder of the project
  this.expInst.use(express.static("public"));

  // add REST api routes
  this.addRESTRoutes();

  // add embeded remote control web pages routes
  this.addRemoteControlWebPagesRoutes();

  // add 404 page
  this.expInst.use((req, res, next) => {
    res.status(404).render("404");
  });

  // start web server
  this.expInst.listen(this.model.port);
};

/**
 * REST full api routes building
 */
webServer.addRESTRoutes = function() {
  console.log(
    `Setup RESTApi with model version ${this.model.version} on port ${this.model.port}`
  );

  const apiRoute = express.Router();

  // root route, return info an app
  apiRoute.get("/", (req, res) => {
    res.json({
      api: "Remote Control",
      app: "Generative Art Gallery Canvas",
      author: "Constant Dupuis"
    });
  });

  // list available canvas
  apiRoute.get("/canvas", (req, res) => {
    res.json(this.model.canvas);
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

  // add RESTful middleware
  this.expInst.use("/api.v01", apiRoute);
};

/**
 * Remote control web pages routes building
 */
webServer.addRemoteControlWebPagesRoutes = function() {
  console.log(`Setup remote control web pages `);

  const remote = express.Router();

  // main page
  remote.get("/", (req, res, next) => {
    res.render("remote", { model: this.model });
  });

  // get canvas thumb route
  remote.get("/canvas/:id/thumb", (req, res, next) => {
    let cid = req.params.id;
    const c = this.model.canvas.find(el => el.id == cid);
    if (c) {
      //res.send(`Canvas ${cid} has a name of ${c.name} and path of ${c.path}`);
      res.sendFile(
        path.join(__dirname, "..", "canvas", c.folder, "thumbnail.jpg")
      );
    } else {
      res.status(404).send("No canvas for id " + cid);
    }
  });

  // add remote control web pages routes
  this.expInst.use("/", remote);
};

module.exports = webServer;
