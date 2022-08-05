const http = require("http");
const fs = require('fs');
const cron = require("node-cron");
const winston = require('winston');
require('winston-daily-rotate-file');

const host = 'localhost';
const port = 8000;

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
 //format output
 const { combine, timestamp, printf, colorize, align } = winston.format;
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

//log that server started
logger.info(new Date().toLocaleString() + ": Server started");

//every 5 minutes save stats and rewrite every day
cron.schedule(`*/5 * * * *`, async function() {
  //log that server is running
  logger.info(new Date().toLocaleString() + ": Server running");
})

//send stats at request
const requestListener = function (req, res) {

  //convert .log file to .csv
  var filename = new Date().toISOString().slice(0, 10) + ".log";
  fs.copyFile(filename, 'today.csv', (err) => {
    if (err) throw err;
  });

  //send file from today to client
  fs.readFile("today.csv", function(error, content) {
    res.setHeader("Content-Disposition", "attachment;filename=today.csv");
    res.setHeader("Content-Type", "text/csv");
    res.writeHead(200);
    res.end(content);
  })
}

const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});