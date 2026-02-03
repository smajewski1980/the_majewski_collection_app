const { app, BrowserWindow, ipcMain, Menu } = require("electron/main");
const path = require("node:path");
const handleRecordsFields = require("./ipc-handlers/handle-records-fields");

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
  ipcMain.handle("getRecordsFields", handleRecordsFields);

  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit;
  }
});
