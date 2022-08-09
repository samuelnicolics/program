var serverlist = ["localhost", "localhost", "localhost"];

var http = require("http");

//jeden server durchgehen
serverlist.forEach(element => {

  var options = {
    hostname: element,
    port: 8000,
    path: '',
    method: 'GET'
  };

  var req = http.request(options, function(_res) {
    //console.log("statusCode: ", res.statusCode);
    //console.log("headers: ", res.headers);

    //zurückgeben ob der server erreichbar ist
    console.log(`${element} online`)

    //res.on('data', function(d) {
    //  process.stdout.write(d);
    //});
  });

  req.end();
  // Error handled here.
  req.on('error', function(e) {
    console.log(`${element} offline`)
  });

});