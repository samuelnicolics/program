// format time
  function format(seconds) {
    function pad(s) {
      return (s < 10 ? '0' : '') + s;
    }
    var hours = Math.floor(seconds / (60 * 60));
    var minutes = Math.floor(seconds % (60 * 60) / 60);
    var seconds = Math.floor(seconds % 60);

    return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds);
  }

  // convert bytes to gb
  function bytesToSize(bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Byte';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
  };

  // serverurl
  var serverurl =  "http://10.15.253.6:8000";
  var middlewareList = [];
  
  //middleware Liste -> get request an server
  async function getPCList(){
    const respone = await fetch(serverurl + "/pclist")
    const data = await respone.json();
    middlewareList = data;
  }

  // make post request to /action on server
  function sendAction(pc, action) {
    const sendData = async () => {
      try {
        const response = await fetch(serverurl + "/action", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            pc,
            action
          }),
        });

        const json = await response.json();
      } catch (error) {
        console.log(error);
      }
    };
    sendData();
  }

  // make post request to /addpc on server
  function addPC() {
    var pcname = document.querySelector("#pcname").value;
    var pcurl = document.querySelector("#ip").value
    if(pcname === "" || pcurl === ""){
      alert("Bitte füllen Sie alle Felder aus");
    }else{
      const sendData = async () => {
        try {
          const response = await fetch(serverurl + "/addpc", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              pcname,
              pcurl
            }),
          });

          const json = await response.json();
        } catch (error) {
          console.log(error);
        }
      };
      sendData();
      document.querySelector("#pcname").value = "";
      document.querySelector("#ip").value = "";
    }
  }

  function deletePC(pcname) {
    var pcname = document.querySelector("#pcname").value;
    if(pcname === ""){
      alert("Bitte füllen Sie alle Felder aus");
    }else{
      const sendData = async () => {
        try {
          const response = await fetch(serverurl + "/deletepc", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              pcname
            }),
          });
        } catch (error) {
          console.log(error);
        }
      };
      sendData();
      document.querySelector("#pcname").value = "";
    }
  }
  

  createHTML();
  
  async function createHTML(){
    await getPCList();

    // navigationsleiste anlegen
    middlewareList.forEach(element => {
      const button = document.createElement("button");
      button.className = "s-bar-item s-button testbtn s-padding-16";
      button.innerHTML = element.pcname;
      
      button.onclick = function() {
        openTab(event, element.pcname);
      }

      const d = document.getElementById("switchTabs");
      d.appendChild(button);
    }
    );

    //create a new tab for each pc
    for (var i = 0; i < middlewareList.length; i++) {
      var pc = middlewareList[i];
      var tab = document.createElement("div");
      tab.setAttribute("id", pc.pcname);
      tab.setAttribute("class", "s-container tab s-animate-opacity");

      tab.innerHTML = "<div class=\"s-row-padding\">\n" +

        "      <div class=\"s-half\">\n" +
        "        <div class=\"s-card-4 s-container w3334\">\n" +
        "          <h2>Stats</h2>\n" +
        "          <ul>\n" +
        "            <li>\n" +
        "              <p id=\"timestamp" + pc.pcname + "\"></p>\n" +
        "            </li>\n" +
        "            <li>\n" +
        "              <p id=\"ostype" + pc.pcname + "\"></p>\n" +
        "            </li>\n" +
        "            <li>\n" +
        "              <p id=\"hostname" + pc.pcname + "\"></p>\n" +
        "            </li>\n" +
        "            <li>\n" +
        "              <p id=\"freemem" + pc.pcname + "\"></p>\n" +
        "            </li>\n" +
        "            <li>\n" +
        "              <p id=\"uptime" + pc.pcname + "\"></p>\n" +
        "            </li>\n" +
        "            <br>\n" +
        "          </ul>\n" +
        "        </div>\n" +
        "\n" +
        "        <br>\n" +
        "        <div class=\"s-card-4 s-container w333\" id=\"actions\">\n" +
        "          <h2 class=\"s-center\">Actions</h2>\n" +
        "          <div class=\"s-center\">\n" +
        "            <br>\n" +
        "            <a class=\"s-button s-theme\" onclick=\"sendAction('"+ pc.pcname + "', 'restartMiddlewareSkript')\">Restart Middleware Skript</a>\n" +
        "          </div>\n" +
        "          <div class=\"s-center\">\n" +
        "            <br>\n" +
        "            <a class=\"s-button s-theme\" onclick=\"sendAction('"+ pc.pcname + "', 'startStandbild')\">Start Standbild</a>\n" +
        "          </div>\n" +
        "          <div class=\"s-center\">\n" +
        "            <br>\n" +
        "            <a class=\"s-button s-theme\" onclick=\"sendAction('"+ pc.pcname + "', 'startStream')\">Start Stream</a>\n" +
        "          </div>\n" +
        "          <br>\n" +
        "        </div>\n" +
        "\n" +
        "        <div class=\"s-card-4 s-container w333\">\n" +
        "          <h2 class=\"s-center\">Services</h2>\n" +
        "          <div class=\"s-center\">\n" +
        "            <br>\n" +
        "            <a id=\"serviceKamera" + pc.pcname + "\"></a>\n" +
        "            <br>\n" +
        "            <a id=\"serviceStandbild" + pc.pcname + "\"></a>\n" +
        "          </div>\n" +
        "          <br>\n" +
        "        </div>\n" +
        "\n" +
        "      </div>\n" +
        "    </div>";

      document.getElementById("showstats").appendChild(tab);
    }

    // zwischen Tabs wechseln
    function openTab(evt, pcName) {
      var x = document.getElementsByClassName("tab");

      for (var i = 0; i < x.length; i++) {
        x[i].style.display = "none";
      }
      var activebtn = document.getElementsByClassName("testbtn");

      for (i = 0; i < x.length; i++) {
        activebtn[i].className = activebtn[i].className.replace("w3-dark-grey", "");
      }
      document.getElementById(pcName).style.display = "block";
      evt.currentTarget.className += " w3-dark-grey";
    }
    var mybtn = document.getElementsByClassName("testbtn")[0];
    mybtn.click();

  // show stats
  fetch(serverurl + "/streamer")
    .then((response) => {
      return response.json();
    })
    .then((collectedData) => {
      //datenbank durchgehen und "pc" suchen und ausgeben
      var pcstats = [];
      
      // get pc stats
      for (var i = 0; i < middlewareList.length; i++) {
        pcstats[i] = collectedData.filter((item) => item.pc === middlewareList[i].pcname);
      }

      pcstats.forEach(element => {
        if(element.length === 0){
          console.log("no data");
        }
        else{
          // show last entry
          const timestampElement = document.getElementById("timestamp" + element.slice(-1).pop().pc);
          const ostypeElement = document.getElementById("ostype" + element.slice(-1).pop().pc);
          const hostnameElement = document.getElementById("hostname" + element.slice(-1).pop().pc);
          const freememElement = document.getElementById("freemem" + element.slice(-1).pop().pc);
          const uptimeElement = document.getElementById("uptime" + element.slice(-1).pop().pc);
          const serviceKameraElement = document.getElementById("serviceKamera" + element.slice(-1).pop().pc);
          const serviceStandbildElement = document.getElementById("serviceStandbild" + element.slice(-1).pop().pc);

          timestampElement.innerHTML = "Time: " + element.slice(-1).pop().timestamp;
          ostypeElement.innerHTML = "OS-Type: " + element.slice(-1).pop().ostype;
          hostnameElement.innerHTML = "Hostname: " + element.slice(-1).pop().hostname;
          freememElement.innerHTML = "Free Memory Space: " + bytesToSize(element.slice(-1).pop().freemem);
          uptimeElement.innerHTML = "Uptime: " + format(element.slice(-1).pop().uptime);
          serviceKameraElement.innerHTML = "Stream: " + element.slice(-1).pop().serviceKamera;
          serviceStandbildElement.innerHTML = "Standbild: " + element.slice(-1).pop().serviceStandbild;
        }
      });
    });

  }
//refresh every 10 seconds
//  setTimeout(function(){
//    window.location.reload();
// }, 10000);