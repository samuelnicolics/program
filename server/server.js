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


var middlewareUrls = [];

//add new pc
function newPC(pcname, pcurl){
  var pc = {pcname, pcurl};
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    dbo.collection("middlewareList").insertOne(pc, function (err, res) {
      if (err) throw err;
      db.close();
    });
  });
}



// get pc from db await
async function getPCawait() {
  const client = new MongoClient(url);
  await client.connect();

  const db = client.db('mydb');
  const collection = db.collection('middlewareList');
  const result = await collection.find({}).toArray();
  middlewareUrls = result;
}

//start async server
start();
async function start(){

// bei einem post auf /action -> mache post request an die jeweilige middleware (command)
app.post("/action", (req, res) => {
  const data = req.body;
  console.log("data: " + data);
  if (data === null || data === undefined) {
    res.status(400).send("no data");
  } else {
    //post request zur middleware machen
    const sendData = async () => {
      try {
        await getPCawait();
        console.log(data);
        console.log(middlewareUrls);
        const response = await fetch(middlewareUrls.find((item) => item.pcname === data.pc).pcurl + "/action", {
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
      } catch (error) {
        res.json({
          error
        });
        console.log(error);
      }
      //antworte der middleware
      res.json({
        status: "ok",
        message: "data received"
      });
    };
    sendData();
  }
});

// bei einem post auf /data -> speicher die daten in db
app.post("/data", (req, res) => {
  const data = req.body;

    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("mydb");

      dbo.collection("stats").insertOne(data, function(err, res) {
        if (err) throw err;
        db.close();
      });
    }); 

    //antworte der middleware
    res.json({status: "ok", message: "data received"});
  });

// wenn eine get request auf /streamer gemacht wird, schicke die gesammelten daten zurück:
app.get("/streamer", (req, res) => {
  // sammle alle daten von den middleware pcs
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

// wenn eine post request auf /newPc gemacht wird, füge einen neuen pc hinzu
app.post("/addpc", (req, res) => {
  const data = req.body;
  newPC(data.pcname, data.pcurl);
  res.json({status: "ok", message: "pc added"});
});

// wenn eine get request auf /pcList gemacht wird, schicke die liste aller pcs zurück
app.get("/pclist", (req, res) => {

  async function returnPCList(){
    await getPCawait();
    res.json(middlewareUrls);
  }
returnPCList();
});

// wenn eine post request auf /deletePc gemacht wird, lösche einen pc aus der liste
app.post("/deletepc", (req, res) => {
  const data = req.body;
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    dbo.collection("middlewareList").deleteOne({pcname: data.pcname}, function(err, obj) {
      if (err) throw err;
      db.close();
    });
  });
  res.json({status: "ok", message: "pc deleted"});
});

}
app.listen(PORT, () => {
  console.log("Server running on port 8000");
});