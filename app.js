// Modules
const {app, BrowserWindow} = require('electron');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');

const canvaPaths = [];
let webAPI;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

// Create a new BrowserWindow when `app` is ready
function createWindow () {

  mainWindow = new BrowserWindow({
    width: 1000, height: 800,
    webPreferences: { nodeIntegration: true },
    title : "Generative Art Gallery Canvas"
  });

  mainWindow.setBackgroundColor("#FFFFFF")

  fs.readdir("./canvas", (err, items) => {
    for (const dirent of items) {
      //console.log(dirent);
      canvaPaths.push( dirent);
    }
    //console.log(canvaPaths);

    if( canvaPaths.length == 0)
    {
      console.log("Load no canvas HTML warning");
      mainWindow.loadFile('nocanvas.html');
    }
    else{
      loadCanvas( 0);
    }
  });

  // set web api rounting
  setupAPI();

  // Open DevTools - Remove for PRODUCTION!
  mainWindow.webContents.openDevTools();

  // remove menu bar
  mainWindow.setMenuBarVisibility(false);

  // Listen for window being closed
  mainWindow.on('closed',  () => {
    mainWindow = null
  });
}

// Electron `app` is ready
app.on('ready', createWindow);

// Quit when all windows are closed - (Not macOS - Darwin)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
});

// When app icon is clicked and app is running, (macOS) recreate the BrowserWindow
app.on('activate', () => {
  if (mainWindow === null) createWindow()
});

// load acanvas in main Electron window
function loadCanvas( canvasId)
{
  const loadURL = `./canvas/${canvaPaths[canvasId]}/index.html`;
  console.log("Load first canvas HTML " + loadURL);
  mainWindow.loadFile(loadURL);
}

// setup and start WEB API for remote control
function setupAPI()
{
  webAPI = express();

  const apiRoute = express.Router();

  // root route, return info an app
  apiRoute.get('/', (req, res)=>{
    res.json({
      "api":"remote control",
      "app":"Generative Art Gallery Canvas",
      "author":"Constant Dupuis"
    });
  });

  // list available canvas
  apiRoute.get('/canvas', (req, res)=>{

    let canvasNfo = [];

    canvaPaths.forEach((e,i) => {
      let canvaNfo = {};
      canvaNfo.id = i;
      canvaNfo.name = e;
      canvaNfo.desc = "nothing yet";
      canvasNfo.push(canvaNfo);
    });

    res.json(canvasNfo);
  });

  // activate a given canvas
  apiRoute.post('/canvas/:id', (req, res)=>{
    
    //console.log(`Load canvas ${req.params.id}`);
    if( req.params.id >= canvaPaths.length || req.params.id < 0)
    {
      // log this issue
      console.log(`API: Requested canvas index out of range [${req.params.id}]`);
      res.status(400).send(`API: Requested canvas index out of range [${req.params.id}]`);  
    }
    else
    {
      loadCanvas( req.params.id);
      res.status(200).send(`Canvas [${req.params.id}] loaded`);
    }
  });

  webAPI.use('/v0.1', apiRoute);

  webAPI.listen(33366);
}





