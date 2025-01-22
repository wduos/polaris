const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("API", {
  loginAttempt: (data) => ipcRenderer.invoke("login-attempt", data),
  contactListRequest: (importMethod) =>
    ipcRenderer.send("contact-list-request", importMethod),
  onQr: (callback) => ipcRenderer.on("qr-code", (_event, qr) => callback(qr)),
  clientReady: (callback) =>
    ipcRenderer.on("client-ready", (_event, user) => callback(user)),
  contactList: (callback) =>
    ipcRenderer.on("contact-list", (_event, list) => callback(list)),
});
