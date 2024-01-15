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

function writeMessage(username) {
  document.querySelector("#container").innerHTML = 
    `<input type="text" id=${inputLogoutButtonID} placeholder='Write your message'/> 
    <button id='${logoutButtonID}'>Esci</button>
    <div id="${messageContainerID}"></div>`;

  const elementButtonLogout = document.querySelector(`#${logoutButtonID}`);
  const elementInputMessage = document.querySelector(`#${inputLogoutButtonID}`);
  const messageContainer = document.querySelector(`#${messageContainerID}`);

  elementButtonLogout.addEventListener("click", onClickLogout);
  elementInputMessage.addEventListener("keyup", (event) => handleKeyPress(event, username));

  loadMessages(username);
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
  localStorage.setItem("currentUserName", userName);
}

function deleteCredentials() {
  localStorage.removeItem("currentUserName");
}

function getCurrentUserName() {
  const userName = localStorage.getItem("currentUserName");
  return userName;
}

function onClickLogin() {
  const userName = getCurrentUserName();
  if (!!userName) {
    writeMessage(userName);
  } else {
    saveLoginCredentials();
    writeMessage(getCurrentUserName());
  }
}

function onClickLogout() {
  writeLoginForm();
  deleteCredentials();
}

function handleKeyPress(event, username) {
  if (event.key === "Enter") {
    saveMessage(username);
    showMessage(username);
    clearInput();
  }
}

function saveMessage(username) {
  const inputMessage = document.querySelector(`#${inputLogoutButtonID}`);
  const message = inputMessage.value;

  let userMessages = JSON.parse(localStorage.getItem("userMessages")) || {};
  userMessages[username] = userMessages[username] || [];
  userMessages[username].push(message);
  localStorage.setItem("userMessages", JSON.stringify(userMessages));
}

function showMessage(username) {
  const userMessages = JSON.parse(localStorage.getItem("userMessages")) || {};
  const userMessagesArray = userMessages[username] || [];

  const messageElement = document.createElement("div");
  messageElement.textContent = userMessagesArray[userMessagesArray.length - 1];

  const messageContainer = document.querySelector(`#${messageContainerID}`);
  messageContainer.appendChild(messageElement);
}

function loadMessages(username) {
  const userMessages = JSON.parse(localStorage.getItem("userMessages")) || {};
  const userMessagesArray = userMessages[username] || [];
  const messageContainer = document.querySelector(`#${messageContainerID}`);

  userMessagesArray.forEach((message) => {
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
  const userName = getCurrentUserName();
  if (!!userName) {
    writeMessage(userName);
  } else {
    writeLoginForm();
  }
};
