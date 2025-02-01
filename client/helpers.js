const qrGen = new QRCode(document.getElementById("qr-container"), {
  width: 202,
  height: 202,
  colorDark: "#2e2b2f",
  colorLight: "#f7f1ff",
  correctLevel: QRCode.CorrectLevel.H,
});

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
  }, 4500);

  if (notifications.length >= 3) {
    notifications.shift();
  }

  notifications.push({
    title: title,
    body: body,
    type: color,
  });

  updateNotificationList();
};

const toggleNotifications = () => {
  updateNotificationList();

  if (headerMenus.notificationsAreHidden) {
    notificationsListContainer.style.visibility = "visible";
    headerMenus.notificationsAreHidden = false;

    menuToggleAltBtn.style.visibility = "visible";
  } else {
    notificationsListContainer.style.visibility = "hidden";
    headerMenus.notificationsAreHidden = true;

    menuToggleAltBtn.style.visibility = "hidden";
  }
};

const updateNotificationList = () => {
  const notificationsDOM = document.getElementById("notifications");

  notificationsDOM.innerHTML = "";

  for (let i = notifications.length - 1; i >= 0; i--) {
    notificationsDOM.innerHTML += `<div class="noti"><h4 class="noti-title">${notifications[i].title}</h4><small class="noti-body">${notifications[i].body}</small><div class="noti-type ${notifications[i].type}"></div></div>`;
  }
};

const toggleLogOutMenu = () => {
  const logOutMenu = document.getElementById("log-out-menu");

  if (headerMenus.logOutMenuIsHidden) {
    logOutMenu.style.visibility = "visible";
    headerMenus.logOutMenuIsHidden = false;

    menuToggleAltBtn.style.visibility = "visible";
  } else {
    logOutMenu.style.visibility = "hidden";
    headerMenus.logOutMenuIsHidden = true;

    menuToggleAltBtn.style.visibility = "hidden";
  }
};

const formatPhoneNumber = (phoneNumber) => {
  // Ensure the number is a string and has no non-numeric characters
  const cleanNumber = phoneNumber.replace(/\D/g, "");

  // First, ensure that the input is the right length (i.e., 11 or 12 digits after the country code)
  if (cleanNumber.length === 13) {
    // Format with the extra '9' in the phone number prefix (5 digits)
    return cleanNumber.replace(
      /(\d{2})(\d{2})(\d{5})(\d{4})/,
      "+55 ($2) $3-$4"
    );
  } else if (cleanNumber.length === 12) {
    // Format with the regular phone number prefix (4 digits)
    return cleanNumber.replace(
      /(\d{2})(\d{2})(\d{4})(\d{4})/,
      "+55 ($2) $3-$4"
    );
  }

  return "Invalid Number";
};

const toggleAwaiting = ({ element, state = "on" }) => {
  if (state === "on") {
    element.classList.add("awaiting");
    element.disabled = true;
  } else if (state === "off") {
    element.classList.remove("awaiting");
    element.disabled = false;
  }
};

const sortByName = (array) => {
  const newArray = array.sort((a, b) => {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  });

  return newArray;
};

const notifications = [];
const headerMenus = {
  notificationsAreHidden: true,
  logOutMenuIsHidden: true,
};

// let isRemberMeSelected = false;
// const toggleRememberMeDiv = document.getElementById("toggle-remember-me");
// const fakeCheckbox = document.getElementById("fake-checkbox");

const loginForm = document.getElementById("login-form");
const qrContainer = document.getElementById("qr-container");
const tempQrMsg = document.getElementById("qr-inner-msg");

const headerBtnsContainer = document.getElementById("header-btns-container");
const contentContainer = document.getElementById("content");
const asideContainer = document.querySelector("aside");
const notificationsBtn = document.getElementById("notifications-btn");
const logOutBtn = document.getElementById("log-out-btn");
const menuToggleAltBtn = document.getElementById("menu-toggle-alt-btn");
const notificationsListContainer =
  document.getElementById("notifications-list");
const userName = document.getElementById("user-name");
const userDeviceName = document.getElementById("user-device-name");
const userNumber = document.getElementById("user-number");
// new message composition
const msgComposeBtn = document.getElementById("msg-compose-btn");
const msgComposeBody = document.getElementById("msg-compose-body");
const msgComposeTextarea = document.getElementById("msg-compose-textarea");
const msgComposeBodyContinueBtn = document.getElementById(
  "msg-compose-body-continue-btn"
);
const msgComposeImg = document.getElementById("msg-compose-img");
const skipImgBtn = document.getElementById("skip-img-btn");
const selectImgBtn = document.getElementById("select-img-btn");
const backToMsgBodyBtn = document.getElementById("back-to-msg-body-btn");
const msgConfirmContacts = document.getElementById("msg-confirm-contacts");
const backToMsgImgBtn = document.getElementById("back-to-msg-img-btn");

const message = {};

const reader = new FileReader();
reader.onload = (e) => {
  message.imgType = e.target.result.split(":", 2)[1].split(";", 1)[0];
  message.imgBase64 = e.target.result.split(",", 2)[1];
};

const updateListBtn = document.getElementById("update-list-btn");
const searchContainer = document.getElementById("search-container");
