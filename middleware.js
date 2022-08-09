const os = require("os");
const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const PORT = 3000;
var serverpost = "http://localhost:8000/data";

//send every 5 minutes os informations to server
const app = express();

app.use(cors());
app.use(express.json());

setInterval(() => {
  const data = {
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    freemem: os.freemem(),
    hostname: os.hostname(),
    loadavg: os.loadavg(),
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

app.listen(PORT, () => {
  console.log("Middleware running on port " + PORT);
});