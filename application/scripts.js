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

  // show stats for pc1
  const timestampElement = document.getElementById("timestamp");
  const ostypeElement = document.getElementById("ostype");
  const hostnameElement = document.getElementById("hostname");
  const freememElement = document.getElementById("freemem");
  const uptimeElement = document.getElementById("uptime");

  fetch("http://localhost:8000/streamer")
    .then((response) => {
      return response.json();
    })
    .then((collectedData) => {
      timestampElement.innerHTML = "Time: " + collectedData.slice(-1).pop().timestamp;
      ostypeElement.innerHTML = "OS-Type: " + collectedData.slice(-1).pop().ostype;
      hostnameElement.innerHTML = "Hostname: " + collectedData.slice(-1).pop().hostname;
      freememElement.innerHTML = "Free Memory Space: " + collectedData.slice(-1).pop().freemem / 1073741824 + " GB";
      uptimeElement.innerHTML = "Uptime: " + format(collectedData.slice(-1).pop().uptime);
    });

  // Tabs
  function openCity(evt, cityName) {
    var i;
    var x = document.getElementsByClassName("city");
    for (i = 0; i < x.length; i++) {
      x[i].style.display = "none";
    }
    var activebtn = document.getElementsByClassName("testbtn");
    for (i = 0; i < x.length; i++) {
      activebtn[i].className = activebtn[i].className.replace(" w3-dark-grey", "");
    }
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " w3-dark-grey";
  }

  var mybtn = document.getElementsByClassName("testbtn")[0];
  mybtn.click();