// Modules
const {app, BrowserWindow} = require('electron');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');

const canvaPaths = [];

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

  fs.readdir("./canvas", (err, items) => {
    for (const dirent of items) {
      console.log(dirent);
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

  // Load index.html into the new BrowserWindow
  //mainWindow.loadFile('index.html');

  // Open DevTools - Remove for PRODUCTION!
  mainWindow.webContents.openDevTools();

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


function loadCanvas( canvasId)
{
  const loadURL = `./canvas/${canvaPaths[canvasId]}/index.html`;
  console.log("Load first canvas HTML " + loadURL);
  mainWindow.loadFile(loadURL);
}






