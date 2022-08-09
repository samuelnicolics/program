const express = require("express");
const cors = require("cors");
const fs = require('fs');
const winston = require('winston');
require('winston-daily-rotate-file');

const PORT = 8000;
const app = express();

app.use(cors());
app.use(express.json());

let streamerStatus = {};

//setup winston logger
var transport = new winston.transports.DailyRotateFile({
  level: 'info',
  filename: '%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m'
});
transport.on('rotate', function(oldFilename, newFilename) {
  // do something fun
});


// bei einem post auf /data speicher die daten als file ab
app.post("/data", (req, res) => {
  
  // !! speicher in ein config-file (JSON-format)
  const data = req.body;

  const loggeddata = fs.readFileSync(new Date().toISOString().slice(0, 10)+".log");
  const json = JSON.parse(loggeddata);
  json.push(data);

  fs.writeFileSync(new Date().toISOString().slice(0, 10)+".log", JSON.stringify(json));
  
  //antworte der middleware
  res.json({ status: "ok", message: "data received" });
});

app.listen(PORT, () => {
  console.log("Server running on port 8000");
});


// wenn eine get request auf /streamer gemacht wird, schicke die gesammelten daten zurück:
app.get("/streamer", (req, res) => {
  console.log("Route /streamer touched");

  // sammle alle daten von den streaming pc
  var collectedData = JSON.parse(fs.readFileSync(new Date().toISOString().slice(0, 10)+".log", 'utf8'));
  
  res.json(collectedData);
});
