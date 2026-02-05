const { app, BrowserWindow, ipcMain, Menu } = require("electron/main");
const path = require("node:path");
const handleGetRecordsFields = require("./ipc-handlers/handleGetRecordsFields");
const handleGetTapesFields = require("./ipc-handlers/handleGetTapesFields");
const handleGetCdsFields = require("./ipc-handlers/handleGetCdsFields");
const handleGetCdSinglesFields = require("./ipc-handlers/handleGetCdSinglesFields");
const handleGetCdCompsFields = require("./ipc-handlers/handleGetCdCompsFields");

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

app.whenReady().then(() => {
  ipcMain.handle("getRecordsFields", handleGetRecordsFields);
  ipcMain.handle("getTapesFields", handleGetTapesFields);
  ipcMain.handle("getCdsFields", handleGetCdsFields);
  ipcMain.handle("getCdSinglesFields", handleGetCdSinglesFields);
  ipcMain.handle("getCdCompsFields", handleGetCdCompsFields);

  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit;
  }
});
