const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
    execSql: (sql) => ipcRenderer.invoke("exec-sql", sql),
    getData: () => ipcRenderer.invoke("get-data"),
    selectSql: (sql) => ipcRenderer.invoke("select-sql", sql),
    externalLink: (url) => ipcRenderer.invoke("external-link", url),
});
