const os = require("os");
const express = require("express");
const cors = require("cors");
const fetch = require ('cross-fetch');
require('dotenv').config();

const PORT = process.env.PORT || 3000;
var serverpost = process.env.SERVERPOST || "http://10.15.253.6:8000/data";

const app = express();

app.use(cors());
app.use(express.json());

//send every 5 minutes os informations to server
setInterval(() => {
  const data = {
    type:"status",
    pc: "PC1",
    timestamp: new Date().toLocaleString('de-AT', {timeZone: 'Europe/Vienna'}),
    freemem: os.freemem(),
    hostname: os.hostname(),
    ostype: os.type(),
    uptime: os.uptime()
    };

  //send data to the server
  const sendData = async () => {
    try {
      const response = await fetch(serverpost, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const json = await response.json();

      console.log(json);
    } catch (error) {
      console.log(error);
    }
  };

  sendData();
  }, 5000);



// bei einem post auf /action führe den command / action aus
app.post("/action", (req, res) => {
  const data = req.body;
  //action ausführen
  var exec = require('child_process').exec;
  
  switch (data.action) {
    case "restartMiddlewareSkript":
      exec('pm2 restart middleware', (error, stdout, stderr) => {
        if (error) {
          console.log(`error: ${error.message}`);
          return;
        }
        if (stderr) {
          console.log(`stderr: ${stderr}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
      });
      break;

      //case "startStandbild" führe einen command aus
      case "startStandbild":
        exec('sudo systemctl stop startkamera && sudo systemctl start startstandbild', (error, stdout, stderr) => {
          if (error) {
            console.log(`error: ${error.message}`);
            return;
          }
          if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
          }
          console.log(`stdout: ${stdout}`);
        }
        );
        break;

      case "startStream":
        exec('sudo -S systemctl stop startstandbild && sudo -S systemctl start startkamera', (error, stdout, stderr) => {
          if (error) {
            console.log(`error: ${error.message}`);
            return;
          }
          if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
          }
          console.log(`stdout: ${stdout}`);
        });
        break;
    case "startStream":
      exec('sudo -S systemctl stop startstandbild && sudo -S systemctl start startkamera', (error, stdout, stderr) => {
        if (error) {
          console.log(`error: ${error.message}`);
          return;
        }
        if (stderr) {
          console.log(`stderr: ${stderr}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
      });
      break;
  }
  });


//log that server started
app.listen(PORT, () => {
  console.log("Middleware running on port " + PORT);
});