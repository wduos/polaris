// // remember me
// toggleRememberMeDiv.addEventListener("click", () => {
//   if (!isRemberMeSelected) {
//     fakeCheckbox.classList.add("checked");
//     isRemberMeSelected = true;
//   } else {
//     fakeCheckbox.classList.remove("checked");
//     isRemberMeSelected = false;
//   }
// });

// Listens for login attempts in login-screen
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const credentials = {
    username: document.getElementById("login-username-input").value,
    password: document.getElementById("login-password-input").value,
  };

  toggleAwaiting({
    element: document.getElementById("login-submit-btn"),
  });

  if (!credentials.username || !credentials.password) {
    popUp({
      title: "Dados Insuficientes",
      body: "Há campos vazios. Por favor, preencha os campos de usuário e senha para fazer login.",
      type: "warning",
    });

    toggleAwaiting({
      element: document.getElementById("login-submit-btn"),
      state: "off",
    });

    return;
  }

  let response;

  try {
    response = await window.API.loginAttempt(
      credentials
      // isRemberMeSelected
    );
  } catch (error) {
    popUp({
      title: "Erro Inesperado",
      body: "Parece que algo não funcionou corretamente, verifique sua conexão e tente novamente.",
      type: "error",
    });

    toggleAwaiting({
      element: document.getElementById("login-submit-btn"),
      state: "off",
    });

    return;
  }

  if (response.status === 404 || response.status === 400) {
    popUp({
      title: "Erro de Login",
      body: "Usuário ou senha inválidos, por favor verifique os dados e tente novamente.",
      type: "error",
    });
  }

  if (response.status === 401) {
    popUp({
      title: "Sem Permissão",
      body: "Você não tem permissão de acesso ao Polaris. Por favor entre em contato com um admnistrador.",
      type: "warning",
    });
  }

  if (response.status === 200) {
    localStorage.setItem("username", credentials.username);
    localStorage.setItem("userToken", response.token);

    popUp({
      title: "Login Efetuado",
      body: "Por favor, tenha seu dispositivo em mãos para a próxima etapa.",
    });

    fadeAndRemove("login");
  }

  toggleAwaiting({
    element: document.getElementById("login-submit-btn"),
    state: "off",
  });
});

// listens for QR Codes
window.API.onQr((qr) => {
  tempQrMsg.style.opacity = 0;

  if (qrContainer.classList.length === 0) {
    qrContainer.classList.add("display-msgs");
  }

  qrGen.makeCode(qr);
});

// listens for a successful connection to the client
window.API.clientReady((user) => {
  headerBtnsContainer.style.visibility = "visible";
  headerBtnsContainer.style.opacity = 1;
  contentContainer.style.width = "calc(100% - 320px)";
  asideContainer.style.right = 0;

  fadeAndRemove("qr");

  popUp({
    title: `${user.name} conectou-se`,
    body: "O Polaris conseguiu se conectar ao seu dispositivo.",
    type: "success",
  });

  setTimeout(() => {
    qrGen.clear();
    tempQrMsg.style.opacity = 1;
    qrContainer.classList.remove("display-msgs");
  }, 2000);

  userName.innerHTML = localStorage.getItem("username");
  userDeviceName.innerHTML = user.name;
  userNumber.innerHTML = formatPhoneNumber(user.phoneNumber);
});

msgComposeBtn.addEventListener("click", () => {
  msgComposeBtn.style.display = "none";
  msgComposeBody.style.display = "flex";
});

msgComposeBodyContinueBtn.addEventListener("click", () => {
  if (!msgComposeTextarea.value) {
    popUp({
      title: "Mensagem Vazia",
      body: "Você enviará uma mensagem sem nenhum texto, clique em Voltar se deseja corrigir isso.",
      type: "warning",
    });
  }

  message.body = msgComposeTextarea.value
    ? msgComposeTextarea.value
    : undefined;

  msgComposeBody.style.display = "none";
  msgComposeImg.style.display = "flex";
});

skipImgBtn.addEventListener("click", () => {
  if (!message.body) {
    popUp({
      title: "Impossível Pular",
      body: "Você não pode enviar uma mensagem vazia, adicione uma imagem ou volte à etapa anterior.",
      type: "error",
    });

    return;
  }

  if (message.imgType || message.imgBase64) {
    message.imgType = undefined;
    message.imgBase64 = undefined;
  }

  msgComposeImg.style.display = "none";
  msgConfirmContacts.style.display = "flex";

  console.log(message);
});

selectImgBtn.addEventListener("change", () => {
  popUp({
    title: "Imagem Selecionada",
    body: `<span class="bold">${selectImgBtn.files[0].name}</span> adicionada à mensagem.`,
  });

  reader.readAsDataURL(selectImgBtn.files[0]);

  msgComposeImg.style.display = "none";
  msgConfirmContacts.style.display = "flex";

  console.log(message);
});

backToMsgBodyBtn.addEventListener("click", () => {
  msgComposeImg.style.display = "none";
  msgComposeBody.style.display = "flex";
});

backToMsgImgBtn.addEventListener("click", () => {
  msgConfirmContacts.style.display = "none";
  msgComposeImg.style.display = "flex";
});

// toggle header menus' visibility
notificationsBtn.addEventListener("click", () => {
  toggleNotifications();
});

logOutBtn.addEventListener("click", () => {
  toggleLogOutMenu();
});

menuToggleAltBtn.addEventListener("click", () => {
  if (!headerMenus.notificationsAreHidden) {
    toggleNotifications();
  }

  if (!headerMenus.logOutMenuIsHidden) {
    toggleLogOutMenu();
  }
});

// contact list request

updateListBtn.addEventListener("click", async () => {
  const importMethod = document.getElementById("update-list-select").value;

  toggleAwaiting({
    element: document.getElementById("update-list-btn"),
  });

  window.API.contactListRequest(importMethod);
});

window.API.contactList((contactList) => {
  if (searchContainer.style.visibility !== "visible") {
    searchContainer.style.visibility = "visible";
  }

  const contactListPlaceholder = document.getElementById(
    "contact-list-placeholder"
  );

  if (contactListPlaceholder.style.visibility !== "hidden") {
    contactListPlaceholder.style.visibility = "hidden";
  }

  console.log(sortByName(contactList));

  popUp({
    title: "Lista Recebida",
    body: "Sua lista de remetentes foi atualizada com sucesso.",
  });

  toggleAwaiting({
    element: document.getElementById("update-list-btn"),
    state: "off",
  });
});
