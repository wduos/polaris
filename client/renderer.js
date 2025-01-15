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

  // tell the main process that the login was successful
  window.API.loginSuccess();
});

// QR Code
const qrGen = new QRCode(document.getElementById("qr-container"), {
  width: 202,
  height: 202,
  colorDark: "#2e2b2f",
  colorLight: "#f7f1ff",
  correctLevel: QRCode.CorrectLevel.H,
});

window.API.onQr((qr) => {
  const tempQrMsg = document.getElementById("qr-inner-msg");
  tempQrMsg.style.opacity = 0;

  qrGen.makeCode(qr);
});

window.API.clientReady(() => {
  setTimeout(() => {
    qrGen.clear();

    const tempQrMsg = document.getElementById("qr-inner-msg");
    tempQrMsg.style.opacity = 1;
  }, 2000);
});
