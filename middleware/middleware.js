const os = require("os");
const express = require("express");
const cors = require("cors");
const fetch = require ('cross-fetch');
require('dotenv').config();

const PORT = process.env.PORT || 3000;
var serverpost = process.env.SERVERPOST || "http://localhost:8000/data";

const app = express();

app.use(cors());
app.use(express.json());

//send every 5 minutes os informations to server
setInterval(() => {
  const data = {
    pc: "PC1",
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
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

//log that server started
app.listen(PORT, () => {
  console.log("Middleware running on port " + PORT);
});