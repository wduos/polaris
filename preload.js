const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("versions", {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  ping: () => ipcRenderer.invoke("ping"),
});

contextBridge.exposeInMainWorld("API", {
  loginSuccess: () => ipcRenderer.invoke("login-success"),
  onQr: (callback) => ipcRenderer.on("qr-code", (_event, qr) => callback(qr)),
});
