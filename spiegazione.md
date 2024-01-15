# LE PARTI DEL CODICE

### 1. Dichiarazione delle costanti:
```javascript
const inputLoginID = "input-username";
const inputLoginButtonID = "button-login";
const logoutButtonID = "button-logout";
const inputLogoutButtonID = "input-message";
const messageContainerID = "message-container";
const showAllCheckboxID = "show-all-checkbox";
```
Queste costanti rappresentano gli ID degli elementi HTML utilizzati nel codice.

### 2. Funzione `writeLoginForm`:
```javascript
function writeLoginForm() {
  document.querySelector("#container").innerHTML = 
    `<input type="text" id=${inputLoginID} placeholder='Username'/>
    <button id="${inputLoginButtonID}" disabled>Login</button>`;

  document.querySelector(`#${inputLoginButtonID}`).addEventListener("click", onClickLogin);
  document.querySelector(`#${inputLoginID}`).addEventListener("keyup", disabledButton);
}
```
Questa funzione popola il contenitore (`#container`) con un modulo di login contenente un campo di input per l'username e un pulsante di login. Viene anche aggiunto un ascoltatore di eventi per il click sul pulsante di login e per il rilascio di un tasto mentre l'utente sta digitando nell'input.

### 3. Funzione `writeMessage`:
```javascript
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
```
Questa funzione popola il contenitore con un modulo per l'invio di messaggi, contenente un campo di input per il messaggio, un pulsante di logout, un contenitore per visualizzare i messaggi e una checkbox per mostrare tutti i messaggi. Vengono aggiunti ascoltatori di eventi per il click sul pulsante di logout, il rilascio di un tasto mentre l'utente sta digitando nell'input del messaggio e il cambiamento nella checkbox di "Show All Messages". Inoltre, vengono caricati i messaggi per l'utente corrente.

### 4. Funzione `disabledButton`:
```javascript
function disabledButton() {
  const elementUserName = document.querySelector(`#${inputLoginID}`);
  const elementButton = document.querySelector(`#${inputLoginButtonID}`);
  const inputUserName = elementUserName.value;

  if (!!inputUserName) elementButton.disabled = false;
  else elementButton.disabled = true;
}
```
Questa funzione abilita o disabilita il pulsante di login in base a se l'input dell'username è vuoto o meno.

### 5. Funzione `saveLoginCredentials`:
```javascript
function saveLoginCredentials() {
  const userName = document.querySelector(`#${inputLoginID}`).value;
  localStorage.setItem("currentUserName", userName);
}
```
Questa funzione salva l'username corrente nel localStorage.

### 6. Funzione `deleteCredentials`:
```javascript
function deleteCredentials() {
  localStorage.removeItem("currentUserName");
}
```
Questa funzione rimuove l'username corrente dal localStorage.

### 7. Funzione `getCurrentUserName`:
```javascript
function getCurrentUserName() {
  const userName = localStorage.getItem("currentUserName");
  return userName;
}
```
Questa funzione restituisce l'username corrente dal localStorage.

### 8. Funzione `onClickLogin`:
```javascript
function onClickLogin() {
  const userName = getCurrentUserName();
  if (!!userName) {
    writeMessage(userName);
  } else {
    saveLoginCredentials();
    writeMessage(getCurrentUserName());
  }
}
```
Questa funzione gestisce il click sul pulsante di login. Se c'è un username corrente, viene chiamata la funzione `writeMessage` con quell'username. Altrimenti, salva l'username nel localStorage e chiama `writeMessage`.

### 9. Funzione `onClickLogout`:
```javascript
function onClickLogout() {
  writeLoginForm();
  deleteCredentials();
}
```
Questa funzione gestisce il click sul pulsante di logout. Chiama la funzione `writeLoginForm` e cancella le credenziali nel localStorage.

### 10. Funzione `handleKeyPress`:
```javascript
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
```
Questa funzione gestisce l'evento di pressione del tasto "Enter" nell'input del messaggio. Verifica se il messaggio non è vuoto, quindi lo salva e aggiorna la visual

izzazione dei messaggi. Se il messaggio è vuoto, mostra un avviso.

### 11. Funzione `saveMessage`:
```javascript
function saveMessage(username, message) {
  const now = new Date();
  const timestamp = now.toLocaleString();

  let userMessages = JSON.parse(localStorage.getItem("userMessages")) || {};
  userMessages[username] = userMessages[username] || [];
  userMessages[username].push({ content: message, timestamp: timestamp });
  localStorage.setItem("userMessages", JSON.stringify(userMessages));
}
```
Questa funzione salva il messaggio nel localStorage, insieme all'orario di invio.

### 12. Funzione `showMessage`:
```javascript
function showMessage(username) {
  const showAllCheckbox = document.querySelector(`#${showAllCheckboxID}`);
  const userMessages = JSON.parse(localStorage.getItem("userMessages")) || {};
  const messageContainer = document.querySelector(`#${messageContainerID}`);
  messageContainer.innerHTML = "";

  if (showAllCheckbox.checked) {
    // Mostra tutti i messaggi di tutti gli utenti
    for (const user in userMessages) {
      userMessages[user].forEach((message, index) => {
        const messageElement = createMessageElement(user, message.content, message.timestamp, username, index);
        messageContainer.appendChild(messageElement);
      });
    }
  } else {
    // Mostra solo i messaggi dell'utente corrente
    const userMessagesArray = userMessages[username] || [];
    userMessagesArray.forEach((message, index) => {
      const messageElement = createMessageElement(username, message.content, message.timestamp, username, index);
      messageContainer.appendChild(messageElement);
    });
  }
}
```
Questa funzione mostra i messaggi nel contenitore dei messaggi. Se la checkbox "Show All Messages" è spuntata, mostra tutti i messaggi di tutti gli utenti; altrimenti, mostra solo i messaggi dell'utente corrente.

### 13. Funzione `createMessageElement`:
```javascript
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
```
Questa funzione crea un elemento del messaggio HTML con opzione di eliminazione se l'autore del messaggio è l'utente corrente.

### 14. Funzione `onDeleteMessage`:
```javascript
function onDeleteMessage(username, index) {
  let userMessages = JSON.parse(localStorage.getItem("userMessages")) || {};
  userMessages[username] = userMessages[username] || [];
  userMessages[username].splice(index, 1);
  localStorage.setItem("userMessages", JSON.stringify(userMessages));
  showMessage(username);
}
```
Questa funzione gestisce la cancellazione di un messaggio. Rimuove il messaggio dall'array dei messaggi nel localStorage e aggiorna la visualizzazione dei messaggi.

### 15. Funzione `loadMessages`:
```javascript
function loadMessages(username) {
  showMessage(username);
}
```
Questa funzione chiama `showMessage` per caricare e visualizzare i messaggi dell'utente corrente.

### 16. Funzione `clearInput`:
```javascript
function clearInput() {
  const inputMessage = document.querySelector(`#${inputLogoutButtonID}`);
  inputMessage.value = "";
}
```
Questa funzione svuota l'input del messaggio dopo che è stato inviato.

### 17. Funzione `handleShowAllChange`:
```javascript
function handleShowAllChange() {
  const userName = getCurrentUserName();
  showMessage(userName);
}
```
Questa funzione gestisce il cambiamento nella checkbox "Show All Messages" e aggiorna la visualizzazione dei messaggi.

### 18. `window.onload`:
```javascript
window.onload = function () {
  const userName = getCurrentUserName();
  if (!!userName) {
    writeMessage(userName);
  } else {
    writeLoginForm();
  }
};
```
Questo blocco di codice viene eseguito quando la pagina è completamente caricata. Verifica se c'è un username corrente nel localStorage e in base a ciò chiama `writeMessage` o `writeLoginForm`.

# *LOCAL STORAGE*, *JSON* E *STRINGIFY* NEL DETTAGLIO

In questo codice, l'utilizzo di `localStorage`, `JSON` e `stringify` è fondamentale per la memorizzazione e il recupero delle informazioni localmente nel browser. Vediamo come vengono utilizzati:

### 1. `localStorage`:
`localStorage` è un oggetto built-in del browser che consente di memorizzare dati localmente nel client web. Questi dati rimangono persistenti anche dopo la chiusura e il riavvio del browser. In questo contesto, viene utilizzato per salvare l'username corrente e i messaggi degli utenti.

### 2. `JSON`:
`JSON` è un formato di dati testuali utilizzato per rappresentare oggetti JavaScript come stringhe di testo. Nella gestione delle informazioni locali, è spesso utilizzato in combinazione con `localStorage` per memorizzare e recuperare strutture dati complesse come array e oggetti.

### 3. `JSON.stringify()`:
`JSON.stringify()` è un metodo di JavaScript che converte un oggetto JavaScript in una stringa JSON. È utilizzato quando si memorizzano dati complessi come array o oggetti nell'`localStorage`, poiché `localStorage` può memorizzare solo dati di tipo stringa.

### 4. `JSON.parse()`:
`JSON.parse()` è un metodo di JavaScript che converte una stringa JSON in un oggetto JavaScript. Viene utilizzato quando si recuperano dati precedentemente memorizzati come stringhe JSON nell'`localStorage`, in modo che possano essere utilizzati come oggetti JavaScript.

### Uso specifico nei metodi presenti:

#### A. `saveLoginCredentials()`:
```javascript
function saveLoginCredentials() {
  const userName = document.querySelector(`#${inputLoginID}`).value;
  localStorage.setItem("currentUserName", userName);
}
```
Questa funzione salva l'username corrente nell'`localStorage` con la chiave "currentUserName".

#### B. `deleteCredentials()`:
```javascript
function deleteCredentials() {
  localStorage.removeItem("currentUserName");
}
```
Questa funzione rimuove l'username corrente dall'`localStorage` utilizzando il metodo `removeItem()`.

#### C. `saveMessage(username, message)`:
```javascript
function saveMessage(username, message) {
  const now = new Date();
  const timestamp = now.toLocaleString();

  let userMessages = JSON.parse(localStorage.getItem("userMessages")) || {};
  userMessages[username] = userMessages[username] || [];
  userMessages[username].push({ content: message, timestamp: timestamp });
  localStorage.setItem("userMessages", JSON.stringify(userMessages));
}
```
Questa funzione salva un messaggio nell'`localStorage`. 
- `JSON.parse(localStorage.getItem("userMessages")) || {}` recupera l'oggetto dei messaggi precedentemente memorizzato.
- `userMessages[username] = userMessages[username] || [];` assicura che ci sia un array per gli eventuali messaggi dell'utente corrente.
- `userMessages[username].push({ content: message, timestamp: timestamp });` aggiunge il nuovo messaggio all'array.
- `localStorage.setItem("userMessages", JSON.stringify(userMessages));` memorizza l'oggetto aggiornato nell'`localStorage` dopo la conversione in una stringa JSON.

#### D. `showMessage(username)`:
```javascript
function showMessage(username) {
  // ...
  const userMessagesArray = userMessages[username] || [];
  // ...
}
```
Questa funzione recupera e visualizza i messaggi salvati nell'`localStorage`. 
- `userMessages[username]` recupera l'array di messaggi dell'utente corrente.
- `JSON.parse(localStorage.getItem("userMessages")) || {}` gestisce il recupero dell'oggetto dei messaggi precedentemente memorizzato.

### E. `onDeleteMessage(username, index)`:
```javascript
function onDeleteMessage(username, index) {
  let userMessages = JSON.parse(localStorage.getItem("userMessages")) || {};
  userMessages[username] = userMessages[username] || [];
  userMessages[username].splice(index, 1);
  localStorage.setItem("userMessages", JSON.stringify(userMessages));
  showMessage(username);
}
```
Questa funzione rimuove un messaggio dall'`localStorage`.
- `JSON.parse(localStorage.getItem("userMessages")) || {}` recupera l'oggetto dei messaggi precedentemente memorizzato.
- `userMessages[username].splice(index, 1);` rimuove il messaggio specificato dall'array.
- `localStorage.setItem("userMessages", JSON.stringify(userMessages));` memorizza l'oggetto aggiornato nell'`localStorage` dopo la conversione in una stringa JSON.

# L'ORARIO DEI MESSAGGI INVIATI

### Modifiche alle funzioni:

#### A. Aggiunta della proprietà `timestamp` ai messaggi salvati:
```javascript
function saveMessage(username, message) {
  const now = new Date();
  const timestamp = now.toLocaleString();

  let userMessages = JSON.parse(localStorage.getItem("userMessages")) || {};
  userMessages[username] = userMessages[username] || [];
  userMessages[username].push({ content: message, timestamp: timestamp });
  localStorage.setItem("userMessages", JSON.stringify(userMessages));
}
```
- Ho introdotto una nuova proprietà `timestamp` ai messaggi memorizzati. Questo timestamp è generato utilizzando l'oggetto `Date()` e il metodo `toLocaleString()`, che restituisce una rappresentazione di data e ora leggibile.

#### B. Modifica della funzione `createMessageElement`:
```javascript
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
```
- Ho modificato la funzione `createMessageElement` per includere l'orario del messaggio quando viene visualizzato. Ora, il testo dell'elemento del messaggio include l'orario tra parentesi.

### Implicazioni nella visualizzazione dei messaggi:

#### C. Modifica della funzione `showMessage`:
```javascript
function showMessage(username) {
  const showAllCheckbox = document.querySelector(`#${showAllCheckboxID}`);
  const userMessages = JSON.parse(localStorage.getItem("userMessages")) || {};
  const messageContainer = document.querySelector(`#${messageContainerID}`);
  messageContainer.innerHTML = "";

  if (showAllCheckbox.checked) {
    // Mostra tutti i messaggi di tutti gli utenti
    for (const user in userMessages) {
      userMessages[user].forEach((message, index) => {
        const messageElement = createMessageElement(user, message.content, message.timestamp, username, index);
        messageContainer.appendChild(messageElement);
      });
    }
  } else {
    // Mostra solo i messaggi dell'utente corrente
    const userMessagesArray = userMessages[username] || [];
    userMessagesArray.forEach((message, index) => {
      const messageElement = createMessageElement(username, message.content, message.timestamp, username, index);
      messageContainer.appendChild(messageElement);
    });
  }
}
```
- Nella funzione `showMessage`, ho fatto in modo che l'orario del messaggio venga passato alla funzione `createMessageElement`. Questo assicura che l'orario venga mostrato correttamente insieme al messaggio.

### Implicazioni nell'eliminazione dei messaggi:

#### D. Modifica della funzione `onDeleteMessage`:
```javascript
function onDeleteMessage(username, index) {
  let userMessages = JSON.parse(localStorage.getItem("userMessages")) || {};
  userMessages[username] = userMessages[username] || [];
  userMessages[username].splice(index, 1);
  localStorage.setItem("userMessages", JSON.stringify(userMessages));
  showMessage(username);
}
```
- Ho mantenuto la funzione `onDeleteMessage` invariata, poiché la modifica dell'orario non influisce sulla rimozione di un messaggio.

Con queste modifiche, ora ogni messaggio salvato include anche un timestamp che rappresenta l'orario in cui è stato inviato. Quando i messaggi vengono visualizzati, l'orario viene mostrato accanto al contenuto del messaggio.