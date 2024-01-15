const inputLoginID = "input-username";
const inputLoginButtonID = "button-login";
const logoutButtonID = "button-logout";
const inputLogoutButtonID = "input-message";
const messageContainerID = "message-container";

function writeLoginForm() {
  document.querySelector("#container").innerHTML = 
    `<input type="text" id=${inputLoginID} placeholder='Username'/>
    <button id="${inputLoginButtonID}" disabled>Login</button>`;

  document.querySelector(`#${inputLoginButtonID}`).addEventListener("click", onClickLogin);
  document.querySelector(`#${inputLoginID}`).addEventListener("keyup", disabledButton);
}

function writeMessage() {
  document.querySelector("#container").innerHTML = 
    `<input type="text" id=${inputLogoutButtonID} placeholder='Write your message'/> 
    <button id='${logoutButtonID}'>Esci</button>
    <div id="${messageContainerID}"></div>`;

  const elementButtonLogout = document.querySelector(`#${logoutButtonID}`);
  const elementInputMessage = document.querySelector(`#${inputLogoutButtonID}`);

  elementButtonLogout.addEventListener("click", onClickLogout);
  elementInputMessage.addEventListener("keyup", handleKeyPress);

  loadMessages();
}

function disabledButton() {
  const elementUserName = document.querySelector(`#${inputLoginID}`);
  const elementButton = document.querySelector(`#${inputLoginButtonID}`);
  const inputUserName = elementUserName.value;

  if (!!inputUserName) elementButton.disabled = false;
  else elementButton.disabled = true;
}

function saveLoginCredentials() {
  const userName = document.querySelector(`#${inputLoginID}`).value;
  localStorage.setItem("userName", userName);
}

function deleteCredentials() {
  localStorage.removeItem("userName");
}

function getUserName() {
  const userName = localStorage.getItem("userName");
  return userName;
}

function onClickLogin() {
  saveLoginCredentials();
  writeMessage();
}

function onClickLogout() {
  writeLoginForm();
  deleteCredentials();
}

function handleKeyPress(event) {
  if (event.key === "Enter") {
    saveMessage();
    showMessage();
    clearInput();
  }
}

function saveMessage() {
  const inputMessage = document.querySelector(`#${inputLogoutButtonID}`);
  const message = inputMessage.value;

  let messages = JSON.parse(localStorage.getItem("messages")) || [];
  messages.push(message);
  localStorage.setItem("messages", JSON.stringify(messages));
}

function showMessage() {
  const messages = JSON.parse(localStorage.getItem("messages")) || [];
  const lastMessage = messages[messages.length - 1];

  const messageElement = document.createElement("div");
  messageElement.textContent = lastMessage;

  const messageContainer = document.querySelector(`#${messageContainerID}`);
  messageContainer.appendChild(messageElement);
}

function loadMessages() {
  const messages = JSON.parse(localStorage.getItem("messages")) || [];
  const messageContainer = document.querySelector(`#${messageContainerID}`);

  messages.forEach((message) => {
    const messageElement = document.createElement("div");
    messageElement.textContent = message;
    messageContainer.appendChild(messageElement);
  });
}

function clearInput() {
  const inputMessage = document.querySelector(`#${inputLogoutButtonID}`);
  inputMessage.value = "";
}

window.onload = function () {
  const userName = getUserName();
  if (!!userName) writeMessage();
  else writeLoginForm();
};
