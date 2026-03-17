const { contextBridge, ipcRenderer } = require("electron/renderer");

contextBridge.exposeInMainWorld("getFormatFields", {
  getRecordsFields: (channel, data) => ipcRenderer.invoke(channel, data),
  getTapesFields: (channel, data) => ipcRenderer.invoke(channel, data),
  getCdsFields: (channel, data) => ipcRenderer.invoke(channel, data),
  getCdCompsFields: (channel, data) => ipcRenderer.invoke(channel, data),
  getCdSinglesFields: (channel, data) => ipcRenderer.invoke(channel, data),
});

contextBridge.exposeInMainWorld("handleQueryValues", {
  handleQueryValues: (channel, data) => ipcRenderer.invoke(channel, data),
});

contextBridge.exposeInMainWorld("getCurrentLocations", {
  getCurrentLocations: (channel, data) => ipcRenderer.invoke(channel, data),
});

contextBridge.exposeInMainWorld("inserts", {
  insertCdsMain: (channel, data) => ipcRenderer.invoke(channel, data),
  insertTapes: (channel, data) => ipcRenderer.invoke(channel, data),
  insertRecords: (channel, data) => ipcRenderer.invoke(channel, data),
});
