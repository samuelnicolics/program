const express = require("express");
const cors = require("cors");
const fetch = require ('cross-fetch');
var mongo = require('mongodb');
require('dotenv').config();
const {readFileSync} = require('fs');

const PORT = process.env.PORT || 8000;
const app = express();


var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";


app.use(cors());
app.use(express.json());

// bei einem post auf /data speicher die daten als file ab || mache post request an eine middleware (command)
var middlewareUrls = process.env.MIDDLEWAREURL || {PC1:"http://10.15.253.7:3000", PC2:"http://10.15.253.7:3000", PC3:"http://10.15.253.7:3000"};

app.post("/data", (req, res) => {
  // !! speicher in ein config-file (JSON-format)
  const data = req.body;

  if (data.type === "action") {
    //post request zur middleware machen
    const sendData = async () => {
      try {
        const response = await fetch(middlewareUrls[data.pc] + "/action", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: data.action
          })
        });

        console.log("sent action to middleware: " + data.action);
        const json = await response.json();
        console.log(json);
        
      } catch (error) {
        console.log(error);
      }
    };
    sendData();
  } else if (data.type === "status") {
    //logger.info(JSON.stringify(data));

    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("mydb");

      dbo.collection("stats").insertOne(data, function(err, res) {
        if (err) throw err;
        console.log("1 document inserted");
        db.close();
      });
    }); 


    //antworte der middleware
    res.json({
      status: "ok",
      message: "data received"
    });
  }
  });

app.listen(PORT, () => {
  console.log("Server running on port 8000");
});


// wenn eine get request auf /streamer gemacht wird, schicke die gesammelten daten zurück:
app.get("/streamer", (req, res) => {
  console.log("Route /streamer touched");

  // sammle alle daten von den streaming pc
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    dbo.collection("stats").find({},{_id:0}).toArray(function(err, result) {
      if (err) throw err;
      res.json(result);
      db.close();
    });
  });
});