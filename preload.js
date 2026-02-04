const { contextBridge, ipcRenderer } = require("electron/renderer");

contextBridge.exposeInMainWorld("getFormatFields", {
  getRecordsFields: (channel, data) => ipcRenderer.invoke(channel, data),
  getTapesFields: (channel, data) => ipcRenderer.invoke(channel, data),
  getCdsFields: (channel, data) => ipcRenderer.invoke(channel, data),
  getCdCompsFields: (channel, data) => ipcRenderer.invoke(channel, data),
  getCdSinglesFields: (channel, data) => ipcRenderer.invoke(channel, data),
});
