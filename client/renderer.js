const fadeAndRemove = (element) => {
  element.style.transition = "opacity 0.5s ease-out";

  setTimeout(() => {
    element.style.opacity = 0;

    setTimeout(() => {
      element.style.display = "none";
    }, 500);
  }, 1000);
};

// Initial connection to test both the user's connection and availability of the remote API
const initRemoteConnection = () => {
  const splashStatus = document.getElementById("splash-status");

  // temp
  setTimeout(() => {
    splashStatus.innerHTML = "Conectado com sucesso!";

    fadeAndRemove(document.getElementById("splash"));
  }, 2000);
};

initRemoteConnection();

// Listens for login attempts in login-screen
document.getElementById("login-form").addEventListener("submit", (e) => {
  e.preventDefault();
});

// const func = async () => {
//   const response = await window.versions.ping();
//   console.log(response);
// };

// func();
