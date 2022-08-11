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

  // make post request to server
  function sendAction(action) {
    const sendData = async () => {
    try {
      const response = await fetch("http://10.15.253.6:8000/data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "action: ": action
        }),
      });

      const json = await response.json();

      console.log(json);
    } catch (error) {
      console.log(error);
    }
  };
    sendData();
  }

  // show stats
  fetch("http://localhost:8000/streamer")
    .then((response) => {
      return response.json();
    })
    .then((collectedData) => {
      //json durchgehen und "pc" suchen und ausgeben
      var pclist = [];
      pclist[1] = collectedData.filter((item) => item.pc === "PC1");
      pclist[2] = collectedData.filter((item) => item.pc === "PC2");
      pclist[3] = collectedData.filter((item) => item.pc === "PC3");

      pclist.forEach(element => {
        if(element.length == 0){
          console.log("no data");
        }
        else{
          const timestampElement = document.getElementById("timestamp" + element.slice(-1).pop().pc);
          const ostypeElement = document.getElementById("ostype" + element.slice(-1).pop().pc);
          const hostnameElement = document.getElementById("hostname" + element.slice(-1).pop().pc);
          const freememElement = document.getElementById("freemem" + element.slice(-1).pop().pc);
          const uptimeElement = document.getElementById("uptime" + element.slice(-1).pop().pc);

          timestampElement.innerHTML = "Time: " + element.slice(-1).pop().timestamp;
          ostypeElement.innerHTML = "OS-Type: " + element.slice(-1).pop().ostype;
          hostnameElement.innerHTML = "Hostname: " + element.slice(-1).pop().hostname;
          freememElement.innerHTML = "Free Memory Space: " + bytesToSize(element.slice(-1).pop().freemem);
          uptimeElement.innerHTML = "Uptime: " + format(element.slice(-1).pop().uptime);
        }
      });
    });



  // Tabs
  function openTab(evt, pcName) {
    var i;
    var x = document.getElementsByClassName("tab");
    for (i = 0; i < x.length; i++) {
      x[i].style.display = "none";
    }
    var activebtn = document.getElementsByClassName("testbtn");
    for (i = 0; i < x.length; i++) {
      activebtn[i].className = activebtn[i].className.replace(" w3-dark-grey", "");
    }
    document.getElementById(pcName).style.display = "block";
    evt.currentTarget.className += " w3-dark-grey";
  }

  var mybtn = document.getElementsByClassName("testbtn")[0];
  mybtn.click();