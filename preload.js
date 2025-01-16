const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("API", {
  loginSuccess: () => ipcRenderer.invoke("login-success"),
  onQr: (callback) => ipcRenderer.on("qr-code", (_event, qr) => callback(qr)),
  clientReady: (callback) =>
    ipcRenderer.on("client-ready", (_event, user) => callback(user)),
});
