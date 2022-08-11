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



// bei einem post auf /action führe die action aus
app.post("/action", (req, res) => {
  const data = req.body;


  //antworte dem server
  res.json({ status: "ok", message: "action received" });

  //action ausführen
  var exec = require('child_process').exec;
  var child;
  
  child = exec(data.action,
     function (error, stdout, stderr) {
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        if (error !== null) {
            console.log('exec error: ' + error);
        }
     });
});


//log that server started
app.listen(PORT, () => {
  console.log("Middleware running on port " + PORT);
});