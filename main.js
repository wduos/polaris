const { app, BrowserWindow, ipcMain, Menu } = require("electron/main");
const path = require("node:path");
const { Client } = require("whatsapp-web.js");
const axios = require("axios");
const { error } = require("node:console");
require("dotenv").config();

const API_URL = process.env.API_URL;
let client;

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

  // Menu.setApplicationMenu(null);

  win.loadFile("client/index.html");

  ipcMain.handle("login-attempt", async (event, data, rememberMe) => {
    const response = await axios
      .post(`${API_URL}/login`, data)
      .then((response) => {
        return {
          status: response.status,
          token: response.data.token,
        };
      })
      .catch((error) => {
        return {
          status: error.status,
          message: error.response.data.message,
        };
      });

    if (response.status === 200) {
      // rememberUserCredentials(data);
      initClient(win);
    }

    return response;
  });

  ipcMain.on("contact-list-request", async (event, importMethod) => {
    if (importMethod === "contacts") {
      let sanitizedContacts = [];
      let itemsProcessed = 0;

      await client.getContacts().then((contacts) => {
        contacts.forEach((contact, index, array) => {
          if (
            !contact.isBusiness &&
            contact.isWAContact &&
            contact.isMyContact &&
            contact.id.server !== "lid"
          ) {
            sanitizedContacts.push({
              name: contact.name,
              id: contact.id._serialized,
            });
          }

          itemsProcessed++;

          if (itemsProcessed === array.length) {
            win.webContents.send("contact-list", sanitizedContacts);
          }
        });
      });
    }

    if (importMethod === "chats") {
      const chatList = await client.getChats();
      let nonGroupChatIds = [];
      let sanitizedContacts = [];
      let itemsProcessed = 0;

      chatList.forEach((chat) => {
        if (chat.id.server === "c.us") {
          nonGroupChatIds.push(chat.id._serialized);
        }
      });

      nonGroupChatIds.forEach(async (id, index, array) => {
        await client.getContactById(id).then((contactDetails) => {
          if (!contactDetails.isEnterprise) {
            sanitizedContacts.push({
              name: contactDetails.pushname
                ? contactDetails.pushname
                : contactDetails.verifiedName,
              id: contactDetails.id._serialized,
            });
          }
        });

        itemsProcessed++;

        if (itemsProcessed === array.length) {
          win.webContents.send("contact-list", sanitizedContacts);
        }
      });
    }
  });
};

// initiate wwebjs
const initClient = (win) => {
  client = new Client();

  client.once("qr", () => {
    win.webContents.send("client-ready", {
      name: "temp",
      phoneNumber: "554791984211",
    });
  });

  // client.on("qr", (qr) => {
  //   win.webContents.send("qr-code", qr);
  // });

  // client.on("ready", async () => {
  //   let user;
  //   const contacts = await client.getContacts();

  //   contacts.forEach((contact) => {
  //     if (contact.isMe) {
  //       if (contact.id.server === "c.us") {
  //         user = {
  //           name: contact.pushname,
  //           phoneNumber: contact.number,
  //         };
  //       }
  //     }
  //   });

  //   win.webContents.send("client-ready", user);
  // });

  client.initialize();
};

const rememberUserCredentials = (userInfo) => {
  console.log(userInfo);
};
