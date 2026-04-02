const { app, BrowserWindow, ipcMain, Menu } = require("electron/main");
const path = require("node:path");
const handleGetRecordsFields = require("./ipc-handlers/handleGetRecordsFields");
const handleGetTapesFields = require("./ipc-handlers/handleGetTapesFields");
const handleGetCdsFields = require("./ipc-handlers/handleGetCdsFields");
const handleGetCdSinglesFields = require("./ipc-handlers/handleGetCdSinglesFields");
const handleGetCdCompsFields = require("./ipc-handlers/handleGetCdCompsFields");
const handleQueryValues = require("./ipc-handlers/handleQueryValues");
const handleGetCurrentLocations = require("./ipc-handlers/handleGetCurrentLocations");
const handleInsertCdsMain = require("./ipc-handlers/handleInsertCdsMain");
const handleInsertTapes = require("./ipc-handlers/handleInsertTapes");
const handleInsertRecords = require("./ipc-handlers/handleInsertRecords");
const handleInsertCdComps = require("./ipc-handlers/handleCdComps");
const handleInsertCdSingles = require("./ipc-handlers/handleCdSingles");

const createWindow = () => {
  const win = new BrowserWindow({
    // fullscreen: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  Menu.setApplicationMenu(null);

  win.loadFile("./html/index.html");
  win.maximize();

  if (!app.isPackaged) {
    win.webContents.openDevTools();
  }
};

const sessionStore = {
  cdCompsCurr: [],
  cdSinglesCurr: [],
  cdsMainCurr: [],
  recordsCurr: [],
  tapesCurr: [],
  currAdded: [],
};

// i switched on the experimental features flag so i could
// use the old school block cursor in my text inputs
app.commandLine.appendSwitch("enable-experimental-web-platform-features");
app.whenReady().then(() => {
  ipcMain.handle("getRecordsFields", handleGetRecordsFields);
  ipcMain.handle("getTapesFields", handleGetTapesFields);
  ipcMain.handle("getCdsFields", handleGetCdsFields);
  ipcMain.handle("getCdSinglesFields", handleGetCdSinglesFields);
  ipcMain.handle("getCdCompsFields", handleGetCdCompsFields);
  ipcMain.handle("handleQueryValues", handleQueryValues);
  ipcMain.handle("getCurrentLocations", handleGetCurrentLocations);
  ipcMain.handle("insertCdsMain", handleInsertCdsMain);
  ipcMain.handle("insertTapes", handleInsertTapes);
  ipcMain.handle("insertRecords", handleInsertRecords);
  ipcMain.handle("insertCdComps", handleInsertCdComps);
  ipcMain.handle("insertCdSingles", handleInsertCdSingles);
  ipcMain.on("sessionSet", (e, { key, value }) => {
    if (key.endsWith("Curr")) {
      sessionStore[key].unshift(value);
      console.log(`setting session store ${key}`);
      return;
    }

    if (key === "currAdded") {
      sessionStore.currAdded.unshift(value);
      console.log(`adding to session store ${key}`);
      console.log(sessionStore.currAdded);
      return;
    }

    sessionStore[key] = value;
    console.log(`setting session store ${key}`);
    return;
  });
  ipcMain.handle("sessionGet", (e, key) => {
    console.log(`getting ${key}`);
    return sessionStore[key];
  });

  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
