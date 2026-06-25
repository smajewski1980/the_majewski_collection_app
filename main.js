const { app, BrowserWindow, ipcMain, Menu, dialog } = require("electron/main");
const path = require("node:path");
const fs = require("node:fs");
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
const handleAllFormatQuery = require("./ipc-handlers/handleAllFormatQuery");
const handleUpdateCdComp = require("./ipc-handlers/handleUpdateCdComp");
const handleUpdateCdSingle = require("./ipc-handlers/handleUpdateCdSingle");
const handleUpdateCdMain = require("./ipc-handlers/handleUpdateCdMain");
const handleUpdateRecord = require("./ipc-handlers/handleUpdateRecord");
const handleUpdateTape = require("./ipc-handlers/handleUpdateTape");
const handleDelete = require("./ipc-handlers/handleDelete");
const handleGetWebUpdateData = require("./ipc-handlers/handleGetWebUpdateData");

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
    win.webContents.once("dom-ready", () => {
      win.webContents.openDevTools();
    });
  }
};

const sessionStore = {
  env: process.env.DB_NAME,
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
  ipcMain.handle("handleAllFormatQuery", handleAllFormatQuery);
  ipcMain.handle("getCurrentLocations", handleGetCurrentLocations);
  ipcMain.handle("insertCdsMain", handleInsertCdsMain);
  ipcMain.handle("insertTapes", handleInsertTapes);
  ipcMain.handle("insertRecords", handleInsertRecords);
  ipcMain.handle("insertCdComps", handleInsertCdComps);
  ipcMain.handle("insertCdSingles", handleInsertCdSingles);
  ipcMain.handle("updateCdComp", handleUpdateCdComp);
  ipcMain.handle("updateCdSingle", handleUpdateCdSingle);
  ipcMain.handle("updateCdMain", handleUpdateCdMain);
  ipcMain.handle("updateRecord", handleUpdateRecord);
  ipcMain.handle("updateTape", handleUpdateTape);
  ipcMain.handle("showDelConf", async (e, msg) => {
    const res = await dialog.showMessageBox({
      type: "warning",
      buttons: ["DELETE ID", "GO BACK"],
      title: "Confirm Delete",
      message: msg,
      noLink: true,
      cancelId: 1,
    });
    return res.response === 0; // returns true if 'DELETE ID'
  });
  ipcMain.handle("deleteId", handleDelete);
  ipcMain.handle("getWebUpdateData", handleGetWebUpdateData);

  ipcMain.on("sessionSet", (e, { key, value }) => {
    // add to the individual format current list for reloading
    if (key.endsWith("Curr")) {
      sessionStore[key].unshift(value);
      console.log(`setting session store ${key}`);
      return;
    }
    // this is the current list which gets displayed on the page
    if (key === "currAdded") {
      sessionStore.currAdded.unshift(value);
      return;
    }
    sessionStore[key] = value;
    return;
  });
  // retrieve from session store
  ipcMain.handle("sessionGet", (e, key) => {
    return sessionStore[key];
  });

  // when ready, open the window
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }

  console.log("Electron Main Process DB:", process.env.DB_NAME);
});

// quit the program when windows get closed
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// create backup logs of the session data before exit
app.on("will-quit", () => {
  const now = new Date(Date.now());
  const newDir = "session-logs";
  const data = JSON.stringify(sessionStore);
  const filenameSuffix = now.toISOString().split(".")[0].replaceAll(":", "_");
  const filepath = path.join(
    app.getPath("userData"),
    newDir,
    `session-log-${filenameSuffix}.json`,
  );

  try {
    fs.mkdirSync(path.join(app.getPath("userData"), newDir), {
      recursive: true,
    });
    fs.writeFileSync(filepath, data);
    console.log("the session was successfully logged before it was closed");
  } catch (error) {
    console.log(error);
  }
});
