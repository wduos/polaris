const notifications = [];

const popUp = ({ title, body, type = "success" }) => {
  let color;

  switch (type) {
    case "success":
      color = "green";
      break;
    case "warning":
      color = "yellow";
      break;
    case "error":
      color = "red";
      break;
    default:
      color = "green";
  }

  const popUp = {
    self: document.getElementById("pop-up"),
    title: document.getElementById("pop-up-title"),
    body: document.getElementById("pop-up-body"),
    type: document.getElementById("pop-up-type"),
  };

  popUp.title.innerHTML = title;
  popUp.body.innerHTML = body;
  popUp.type.style.backgroundColor = `var(--pop-up-${color})`;
  popUp.self.style.visibility = "visible";
  popUp.self.style.opacity = 1;

  setTimeout(() => {
    popUp.self.style.opacity = 0;

    setTimeout(() => {
      popUp.title.innerHTML = "";
      popUp.body.innerHTML = "";
      popUp.self.style.visibility = "hidden";
    }, 500);
  }, 4000);

  if (notifications.length >= 3) {
    notifications.shift();
  }

  notifications.push({
    title: title,
    body: body,
    type: color,
  });
};

const fadeAndRemove = (id) => {
  const element = document.getElementById(id);

  element.style.transition = "opacity 0.5s ease-out";

  setTimeout(() => {
    element.style.opacity = 0;

    setTimeout(() => {
      element.style.display = "none";
    }, 500);
  }, 1000);
};

const toggleNotifications = () => {
  updateNotificationList();

  const menuToggleAltBtn = document.getElementById("menu-toggle-alt-btn");
  const notificationsListContainer =
    document.getElementById("notifications-list");

  if (notificationsAreHidden) {
    notificationsListContainer.style.visibility = "visible";
    notificationsAreHidden = false;

    menuToggleAltBtn.style.visibility = "visible";
  } else {
    notificationsListContainer.style.visibility = "hidden";
    notificationsAreHidden = true;

    menuToggleAltBtn.style.visibility = "hidden";
  }
};

const updateNotificationList = () => {
  const notificationsDOM = document.getElementById("notifications");

  notificationsDOM.innerHTML = "";

  notifications.reverse().forEach((noti) => {
    notificationsDOM.innerHTML += `<div class="noti"><h4 class="noti-title">${noti.title}</h4><small class="noti-body">${noti.body}</small><div class="noti-type ${noti.type}"></div></div>`;
  });
};

const qrGen = new QRCode(document.getElementById("qr-container"), {
  width: 202,
  height: 202,
  colorDark: "#2e2b2f",
  colorLight: "#f7f1ff",
  correctLevel: QRCode.CorrectLevel.H,
});

// animate splash's removal from DOM
setTimeout(() => {
  fadeAndRemove("splash");
}, 1200);

// Listens for login attempts in login-screen
document.getElementById("login-form").addEventListener("submit", (e) => {
  e.preventDefault();

  // temp
  const loginSubmitBtn = document.getElementById("login-submit-btn");
  loginSubmitBtn.disabled = true;
  loginSubmitBtn.style.backgroundColor = "var(--light----)";

  setTimeout(() => {
    fadeAndRemove("login");
  }, 800);

  popUp({
    title: "Login Efetuado",
    body: "Por favor, tenha seu dispositivo em mãos para a próxima etapa.",
  });

  // tell the main process that the login was successful
  window.API.loginSuccess();
});

// listens for QR Codes
window.API.onQr((qr) => {
  const qrContainer = document.getElementById("qr-container");
  const tempQrMsg = document.getElementById("qr-inner-msg");

  tempQrMsg.style.opacity = 0;

  if (qrContainer.classList.length === 0) {
    qrContainer.classList.add("display-msgs");
  }

  qrGen.makeCode(qr);
});

// listens for a successful connection to the client
window.API.clientReady((user) => {
  const headerBtnsContainer = document.getElementById("header-btns-container");
  const contentContainer = document.getElementById("content");
  const asideContainer = document.querySelector("aside");

  headerBtnsContainer.style.visibility = "visible";
  headerBtnsContainer.style.opacity = 1;
  contentContainer.style.width = "calc(100% - 320px)";
  asideContainer.style.right = 0;

  fadeAndRemove("qr");

  popUp({
    title: `${user.name} Conectado!`,
    body: "O Polaris conseguiu se conectar ao seu dispositivo.",
    type: "success",
  });

  setTimeout(() => {
    qrGen.clear();

    const qrContainer = document.getElementById("qr-container");
    const tempQrMsg = document.getElementById("qr-inner-msg");
    tempQrMsg.style.opacity = 1;
    qrContainer.classList.remove("display-msgs");
  }, 2000);

  localStorage.setItem("user", JSON.stringify(user));

  // console.log(JSON.parse(localStorage.getItem("user")));
});

// toggle notifications visibility
let notificationsAreHidden = true;
document.getElementById("notifications-btn").addEventListener("click", () => {
  toggleNotifications();
});

document.getElementById("menu-toggle-alt-btn").addEventListener("click", () => {
  toggleNotifications();
});
