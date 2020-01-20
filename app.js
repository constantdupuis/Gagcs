// Modules
const { app, BrowserWindow } = require("electron");

const appController = require("./controllers/app_controller");

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

// Create a new BrowserWindow when `app` is ready
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: { nodeIntegration: true },
    title: "Generative Art Gallery Canvas"
  });

  mainWindow.setBackgroundColor("#FFFFFF");

  appController.load(mainWindow);

  // model.load(() => {
  //   if (model.canvas.length == 0) {
  //     console.log("Load no canvas HTML warning");
  //     mainWindow.loadFile("nocanvas.html");
  //   } else {
  //     loadCanvas(0);
  //   }
  //   // set web api rounting
  //   webServer.setup(33366, model);
  // });

  // Open DevTools - Remove for PRODUCTION!
  mainWindow.webContents.openDevTools();

  // remove menu bar
  mainWindow.setMenuBarVisibility(false);

  // Listen for window being closed
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

// Electron `app` is ready
app.on("ready", createWindow);

// Quit when all windows are closed - (Not macOS - Darwin)
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// When app icon is clicked and app is running, (macOS) recreate the BrowserWindow
app.on("activate", () => {
  if (mainWindow === null) createWindow();
});

// // load acanvas in main Electron window
// function loadCanvas(canvasId) {
//   const loadURL = `./canvas/${model.canvas[canvasId].path}/index.html`;
//   console.log("Load canvas " + loadURL);
//   mainWindow.loadFile(loadURL);
// }
