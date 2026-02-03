const { app, BrowserWindow, ipcMain, Menu } = require("electron/main");
const path = require("node:path");
const { getRecordsFields } = require("./getFormatFields");

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
  // refactor this handler func to its own module
  ipcMain.handle("getRecordsFields", (e, data) => {
    console.log("we got a request from renderer for some info");
  });

  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit;
  }
});
