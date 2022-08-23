const os = require("os");
const express = require("express");
const cors = require("cors");
const fetch = require ('cross-fetch');
require('dotenv').config();

const PORT = process.env.PORT || 3000;
var serverpost = process.env.SERVERPOST || "http://10.15.253.6:8000/data";
var interval = process.env.UPDATE_INTERVAL || 5000;
var pcName = process.env.PC_NAME || "PC1";
var timeZ = process.env.TIME_ZONE || 'Europe/Vienna';

const app = express();

app.use(cors());
app.use(express.json());

var serviceKamera = "";
var serviceStandbild = "";

//send every 5 minutes os informations to server
setInterval(() => {
  getActiveService();
  const data = {
    type:"status",
    pc: pcName,
    timestamp: new Date().toLocaleString('de-AT', {timeZone: timeZ}),
    freemem: os.freemem(),
    hostname: os.hostname(),
    ostype: os.type(),
    uptime: os.uptime(),
    serviceKamera: serviceKamera,
    serviceStandbild: serviceStandbild
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
  },  interval);

function getActiveService(){
  var exec = require('child_process').exec;
    function User(cmd, callback) {
      exec('systemctl --no-pager status startkamera | grep active && systemctl --no-pager status startstandbild | grep active', function (error, stdout) {
        return callback(null, stdout);
      });
  }
  
  User('whoami', function(err, callback){
    //log callback to console delete everything except active or inactive
    serviceKamera = callback.split(" ")[6];
    serviceStandbild = callback.split("\n")[1].split(" ")[6];
  });
}

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

      case "startStandbild":
        exec('sudo -S /bin/systemctl stop startkamera.service && sudo -S /bin/systemctl start startstandbild.service', (error, stdout, stderr) => {
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
        exec('sudo -S /bin/systemctl stop startstandbild.service && sudo -S /bin/systemctl start startkamera.service', (error, stdout, stderr) => {
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
  
    }  });


//log that server started
app.listen(PORT, () => {
  console.log("Middleware running on port " + PORT);
});