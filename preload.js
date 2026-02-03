const { contextBridge, ipcRenderer } = require("electron/renderer");

contextBridge.exposeInMainWorld("getFormatFields", {
  getRecordsFields: (channel, data) => ipcRenderer.invoke(channel, data),
});
