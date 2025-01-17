const { app, BrowserWindow, ipcMain, Menu } = require("electron/main");
const path = require("node:path");
const { Client } = require("whatsapp-web.js");

app.whenReady().then(() => {
  createWindow();

  // MacOS stuff
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// MacOS stuff
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  Menu.setApplicationMenu(null);

  win.loadFile("client/index.html");

  ipcMain.handle("login-success", () => {
    const client = new Client();

    client.on("qr", (qr) => {
      win.webContents.send("qr-code", qr);
    });

    client.on("ready", async () => {
      let user;
      const contacts = await client.getContacts();

      contacts.forEach((contact) => {
        if (contact.isMe) {
          if (contact.id.server === "c.us") {
            user = {
              name: contact.pushname,
              phoneNumber: contact.number,
            };
          }
        }
      });

      win.webContents.send("client-ready", user);
    });

    client.initialize();
  });
};
