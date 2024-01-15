const inputLoginID = "input-username";
const inputLoginButtonID = "button-login";
const logoutButtonID = "button-logout";
const inputLogoutButtonID = "input-message";
const messageContainerID = "message-container";
const showAllCheckboxID = "show-all-checkbox";

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
    <div id="${messageContainerID}"></div>
    <label for="${showAllCheckboxID}">Show All Messages</label>
    <input type="checkbox" id="${showAllCheckboxID}" onchange="handleShowAllChange()">`;

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
    const inputMessage = document.querySelector(`#${inputLogoutButtonID}`);
    const message = inputMessage.value.trim();

    if (message !== "") {
      saveMessage(username, message);
      showMessage(username);
      clearInput();
    } else {
      alert("Il messaggio non può essere vuoto.");
    }
  }
}

function saveMessage(username, message) {
  const now = new Date();
  const timestamp = now.toLocaleString();

  let userMessages = JSON.parse(localStorage.getItem("userMessages")) || {};
  userMessages[username] = userMessages[username] || [];
  userMessages[username].push({ content: message, timestamp: timestamp });
  localStorage.setItem("userMessages", JSON.stringify(userMessages));
}

function showMessage(username) {
  const showAllCheckbox = document.querySelector(`#${showAllCheckboxID}`);
  const userMessages = JSON.parse(localStorage.getItem("userMessages")) || {};
  const messageContainer = document.querySelector(`#${messageContainerID}`);
  messageContainer.innerHTML = "";

  if (showAllCheckbox.checked) {
    for (const user in userMessages) {
      userMessages[user].forEach((message, index) => {
        const messageElement = createMessageElement(user, message.content, message.timestamp, username, index);
        messageContainer.appendChild(messageElement);
      });
    }
  } else {
    const userMessagesArray = userMessages[username] || [];
    userMessagesArray.forEach((message, index) => {
      const messageElement = createMessageElement(username, message.content, message.timestamp, username, index);
      messageContainer.appendChild(messageElement);
    });
  }
}

function createMessageElement(author, content, timestamp, currentUser, index) {
  const messageElement = document.createElement("div");
  messageElement.classList.add("message");
  messageElement.textContent = `${author}: ${content} (${timestamp})`;

  if (author === currentUser) {
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => onDeleteMessage(currentUser, index));
    messageElement.appendChild(deleteButton);
  }

  return messageElement;
}

function onDeleteMessage(username, index) {
  let userMessages = JSON.parse(localStorage.getItem("userMessages")) || {};
  userMessages[username] = userMessages[username] || [];
  userMessages[username].splice(index, 1);
  localStorage.setItem("userMessages", JSON.stringify(userMessages));
  showMessage(username);
}

function loadMessages(username) {
  showMessage(username);
}

function clearInput() {
  const inputMessage = document.querySelector(`#${inputLogoutButtonID}`);
  inputMessage.value = "";
}

function handleShowAllChange() {
  const userName = getCurrentUserName();
  showMessage(userName);
}

window.onload = function () {
  const userName = getCurrentUserName();
  if (!!userName) {
    writeMessage(userName);
  } else {
    writeLoginForm();
  }
};
