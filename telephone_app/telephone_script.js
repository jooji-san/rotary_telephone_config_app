require("dotenv").config();
const io = require("socket.io-client");
const fs = require("fs");
const socket = io("ws://127.0.0.1:5000");

const TELEPHONE_ID = process.env.TELEPHONE_ID;

socket.emit("connection", parseInt(TELEPHONE_ID));
console.log("hello");

socket.on("joined", () => {
  console.log("hurray!!");
  const data = fs.readFileSync("config.json");
  const jsonData = JSON.parse(data);
  console.log(jsonData);
  socket.emit("current config", jsonData);
});
