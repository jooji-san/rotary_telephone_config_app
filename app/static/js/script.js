import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";

const socket = io();

const email = document.querySelector("#email").textContent;

socket.emit("connection", email);

socket.on("joined", () => console.log("hurray!!"));

socket.on("current config", (json) => displayJson(json));

socket.on("successful update", () => console.log("everything succesful"));

function createItem(firstData, secondData, isSensitive) {
  let item = document.createElement("div");
  item.className = "item";

  let content = document.createElement("div");
  content.className = "content";
  let first = document.createElement("div");
  first.textContent = firstData;
  let second = document.createElement("div");
  if (isSensitive) second.textContent = "*****";
  else second.textContent = secondData;
  content.appendChild(first);
  content.appendChild(second);

  let actions = document.createElement("div");
  actions.className = "actions";
  if (isSensitive) {
    let viewButton = document.createElement("button");
    viewButton.className = "view";
    viewButton.textContent = "view";
    viewButton.addEventListener("click", (event) => {
      let pass = event.target.parentNode.parentNode.firstChild.lastChild;
      if (pass.textContent === "*****") pass.textContent = secondData;
      else pass.textContent = "*****";
    });
    actions.appendChild(viewButton);
  }
  let deleteButton = document.createElement("button");
  deleteButton.className = "delete";
  deleteButton.textContent = "delete";
  deleteButton.addEventListener("click", (e) => {
    e.target.parentNode.parentNode.remove();
  });
  actions.appendChild(deleteButton);

  item.appendChild(content);
  item.appendChild(actions);

  return item;
}

function displayJson(json) {
  console.log("displaying...");
  let wifiItems = document.querySelector(".wifi");
  for (const [ssid, password] of Object.entries(json["wifi-networks"])) {
    let item = createItem(ssid, password, true);
    wifiItems.appendChild(item);
  }
  let messengerItems = document.querySelector(".messenger");
  for (const [username, password] of Object.entries(
    json.messenger_credentials
  )) {
    let item = createItem(username, password, true);
    messengerItems.appendChild(item);
  }
  let contactItems = document.querySelector(".contact");
  for (const [username, number] of Object.entries(json.contacts)) {
    let item = createItem(username, number, false);
    contactItems.appendChild(item);
  }
}

let modal = document.querySelector(".modal");
let AddBtns = document.querySelectorAll(".add");
let itemsNode;
AddBtns.forEach((btn) =>
  btn.addEventListener("click", (e) => {
    itemsNode = e.target.parentNode.querySelector(".items");
    modal.classList.remove("none");
  })
);

let modalAddBtn = document.querySelector(".modal>button");
modalAddBtn.addEventListener("click", () => {
  let isSensitive = true;
  console.log(itemsNode);
  if (itemsNode.classList.contains("contact")) isSensitive = false;
  let first = modal.querySelector(".modal-first");
  let second = modal.querySelector(".modal-second");
  itemsNode.appendChild(createItem(first.value, second.value, isSensitive));
  first.value = "";
  second.value = "";
  modal.classList.add("none");
});

const submitBtn = document.querySelector(".submit");
submitBtn.addEventListener("click", handle_submit);

function handle_submit() {
  socket.emit("updated config", convertToJson(), email);
  location.reload();
}

function convertToJson() {
  let newJson = {
    "wifi-networks": {},
    messenger_credentials: {},
    contacts: {},
  };
  let wifiItems = document.querySelector(".wifi");
  for (let item of wifiItems.querySelectorAll(".item")) {
    let content = item.firstChild;
    let firstData = content.childNodes[0].textContent;
    let second = content.childNodes[1];
    let viewBtn = item.lastChild.firstChild;
    viewBtn.click();
    let secondData = second.textContent;
    newJson["wifi-networks"][firstData] = secondData;
  }
  let messengerItems = document.querySelector(".messenger");
  for (let item of messengerItems.querySelectorAll(".item")) {
    let content = item.firstChild;
    let firstData = content.childNodes[0].textContent;
    let second = content.childNodes[1];
    let viewBtn = item.lastChild.firstChild;
    viewBtn.click();
    let secondData = second.textContent;
    newJson["messenger_credentials"][firstData] = secondData;
  }
  let contactItems = document.querySelector(".contact");
  for (let item of contactItems.querySelectorAll(".item")) {
    let content = item.firstChild;
    let firstData = content.childNodes[0].textContent;
    let secondData = content.childNodes[1].textContent;
    newJson["contacts"][firstData] = secondData;
  }
  return newJson;
}

// socket.on('connect', () => {
//   console.log('connected');
//   socket.emit('new player in the lobby', { id: socket.id });

//   let joinBtn = document.querySelector('#stranger-btn');
//   joinBtn.addEventListener('click', handleJoinBtnClick);
//   let startBtn = document.querySelector('#friendly-btn');
//   startBtn.addEventListener('click', handleStartBtnClick);
// });

// socket.on('other player disconnected', () => {
//   console.log('let me join');
//   socket.emit('newPlayer', { id: socket.id });
// });

// socket.on('can join', (roomId) => {
//   window.location.href = `gameplay?roomId=` + encodeURIComponent(roomId);
// });

// socket.on('count updated', function ({ playerLobbyCnt, playerGameplayCnt }) {
//   let playerLobbyCntSpan = document.querySelector('#player-lobby-cnt');
//   playerLobbyCntSpan.textContent = playerLobbyCnt;
//   let playerGameplayCntSpan = document.querySelector('#player-gameplay-cnt');
//   playerGameplayCntSpan.textContent = playerGameplayCnt;
//   console.log(playerGameplayCnt);
// });

// function handleJoinBtnClick() {
//   socket.emit('player wants to join a room', { id: socket.id });
// }

// function handleStartBtnClick() {
//   socket.emit('player wants to start', { id: socket.id });
// }

// function updateCnt(playerCnt, playerInLobbyCnt) {
//   let playerCntSpan = document.querySelector('#playerCnt');
//   let playerInLobbyCntSpan = document.querySelector('#playerInLobbyCnt');
//   playerCntSpan.textContent = playerCnt;
//   playerInLobbyCntSpan.textContent = playerInLobbyCnt;
// }

// export { updateCnt };
