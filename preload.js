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
  insertCdComps: (channel, data) => ipcRenderer.invoke(channel, data),
  insertCdSingles: (channel, data) => ipcRenderer.invoke(channel, data),
});

contextBridge.exposeInMainWorld("sessionStore", {
  sessionSet: (channel, data) => ipcRenderer.send(channel, data),
  sessionGet: (channel, data) => ipcRenderer.invoke(channel, data),
});

contextBridge.exposeInMainWorld("handleAllFormatQuery", {
  handleAllFormatQuery: (channel, data) => ipcRenderer.invoke(channel, data),
});

contextBridge.exposeInMainWorld("updates", {
  updateCdComp: (channel, data) => ipcRenderer.invoke(channel, data),
  updateCdSingle: (channel, data) => ipcRenderer.invoke(channel, data),
  updateCdMain: (channel, data) => ipcRenderer.invoke(channel, data),
  updateRecord: (channel, data) => ipcRenderer.invoke(channel, data),
  updateTape: (channel, data) => ipcRenderer.invoke(channel, data),
});

contextBridge.exposeInMainWorld("deleteId", {
  confirmDeleteId: (msg) => ipcRenderer.invoke("showDelConf", msg),
  deleteId: (id) => ipcRenderer.invoke("deleteId", id),
});

contextBridge.exposeInMainWorld("updateWeb", {
  getWebUpdateData: (channel, data) => ipcRenderer.invoke(channel, data),
});
