const express = require("express");
const cors = require("cors");
const fetch = require ('cross-fetch');
const winston = require('winston');
require('winston-daily-rotate-file');
const {
  readFileSync
} = require('fs');


const PORT = 8000;
const app = express();

app.use(cors());
app.use(express.json());

let streamerStatus = {};

//setup winston logger
var transport = new winston.transports.DailyRotateFile({
  level: 'info',
  filename: 'logs/%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m'
});
transport.on('rotate', function (oldFilename, newFilename) {
  // do something fun
});
// format output
const {
  combine,
  timestamp,
  printf,
  colorize,
  align
} = winston.format;
//create logger
var logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    printf((info) => info.message)
  ),
  transports: [
    transport
  ]
});

// bei einem post auf /data speicher die daten als file ab || mache post request an eine middleware (command)
var middlewareUrls = {PC1:"http://10.15.253.7:3000", PC2:"http://10.15.253.7:3000", PC3:"http://10.15.253.7:3000"};

app.post("/data", (req, res) => {
  // !! speicher in ein config-file (JSON-format)
  const data = req.body;

  if (data.type === "action") {
    //post request zur middleware machen    
    const sendData = async () => {
      try {
        const response = await fetch(middlewareUrls[data.pc]+"/action", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: data.action
          }),
        });

        const json = await response.json();
        console.log(json);
      } catch (error) {
        console.log(error);
      }
    }
    sendData();
  } else if (data.type === "status") {
    logger.info(JSON.stringify(data));

    //antworte der middleware
    res.json({status: "ok", message: "data received"});
  }
});

app.listen(PORT, () => {
  console.log("Server running on port 8000");
});


// wenn eine get request auf /streamer gemacht wird, schicke die gesammelten daten zurück:
app.get("/streamer", (req, res) => {
  console.log("Route /streamer touched");

  // sammle alle daten von den streaming pc
  var collectedData = [];
  const array = readFileSync("logs/" + new Date().toISOString().slice(0, 10) + ".log").toString().replace(/\r\n/g, '\n').split('\n');
  array.pop();

  for (let i of array) {
    collectedData.push(JSON.parse(i));
  }
  res.json(collectedData);
});