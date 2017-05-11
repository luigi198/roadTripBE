// Global Variables
var toggleModal,
    openLocationThumbModal,
    moveForward,
    checkPosition;

(function () {

  var init,
      loadPlacesInfo,
      loadPlacesInfoAjax,
      checkInfo,
      scrollCounter = 0,
      roadContainer = document.getElementById('roadContainer'),
      roadImg = document.getElementById('roadImg'),
      thumbsContainer = document.getElementById('locations-container'),
      carElement = document.getElementById('car'),
      modalElement = document.getElementById('modal'),
      locationThumbs = [],
      locationsThumbs,
      animationScroll,
      cornerAnimation,
      moveRoad,
      geolocation = false,
      transitionInProgress = false,
      showModal = false;

  locationsThumbs = [{
    top: 328,
    right: 185
  }, {
    top: 600,
    right: 535
  }, {
    top: 870,
    right: 185
  }, {
    top: 1140,
    right: 535
  }, {
    top: 1410,
    right: 185
  }];

  moveRoad = function (x, y) {
    x = x || 0, y = y || 0;
    roadImg.style.transform = 'translateX(' + x + 'px) translateY(' + y + 'px)';
    thumbsContainer.style.transform = 'translateX(' + x + 'px) translateY(' + y + 'px)';
    transitionInProgress = true;
  };

  cornerAnimation = function (roadY1, roadX1, carRot, roadY2, roadX2, callback) {
    var afterCarFunc = function () {
      moveRoad(roadX2, roadY2);
      carElement.removeEventListener("transitionend", afterCarFunc, true);

      if (typeof callback !== 'undefined') {
        setTimeout(function () {
          callback();
        }, 1000);
      }
    };

    moveRoad(roadX1, roadY1)
    carElement.style.transform = 'rotate(' + carRot + 'deg)';
    carElement.addEventListener("transitionend", afterCarFunc, true);
  };

  checkInfo = function (id) {
    if (!locationsThumbs[id - 1].data.checked) {
      openLocationThumbModal(id);
    }
  };

  animationScroll = function () {
    if (!geolocation) {
      alert("Please Allow the browser to use your Location and refresh the page");
    } else {
      switch (scrollCounter) {
        case 0:
          moveRoad(null, 0);
          break;
        case 1:
          carElement.style.transform = 'rotate(180deg)';
          moveRoad(null, -50);
          break;
        case 2:
          cornerAnimation(-82, -20, 90, -82, -600);
          break;
        case 3:
          cornerAnimation(-90, -635, 180, -220, -635, function () {
            checkInfo(1);
          });
          break;
        case 4:
          moveRoad(-635, -320);
          break;
        case 5:
          cornerAnimation(-357, -615, 270, -357, -40);
          break;
        case 6:
          cornerAnimation(-365, 0, 180, -490, 0, function () {
            checkInfo(2);
          });
          break;
        case 7:
          moveRoad(0, -590);
          break;
        case 8:
          cornerAnimation(-630, -20, 90, -630, -600);
          break;
        case 9:
          cornerAnimation(-638, -635, 180, -767, -635, function () {
            checkInfo(3);
          });
          break;
        case 10:
          moveRoad(-635, -867);
          break;
        case 11:
          cornerAnimation(-902, -615, 270, -902, -40);
          break;
        case 12:
          cornerAnimation(-912, 0, 180, -1035, 0, function () {
            checkInfo(4);
          });
          break;
        case 13:
          moveRoad(0, -1135);
          break;
        case 14:
          cornerAnimation(-1173, -20, 90, -1173, -600);
          break;
        case 15:
          cornerAnimation(-1181, -635, 180, -1411, -635, function () {
            checkInfo(5);
          });
          break;
      }
    }
  };

  toggleModal = function () {
    if (showModal) {
      modalElement.style.display = 'none';
    } else {
      modalElement.style.display = 'block';
    }
    showModal = !showModal;
  }

  openLocationThumbModal = function (id) {
    if (locationsThumbs[id - 1].data.checked) {
      document.getElementById('modalLocationName').innerText = locationsThumbs[id - 1].data.name;
      document.getElementById('modalLocationDescription').innerText = locationsThumbs[id - 1].data.description;
      document.getElementById('modalLocationImg').src = '/assets/place' + locationsThumbs[id - 1].data.code + '.jpg';
    } else {
      document.getElementById('modalLocationName').innerText = 'Encuentralo!';
      document.getElementById('modalLocationDescription').innerText = 'Dale click al link de waze, vayamos a la localización y dale click al botón de "Revisar Posición".';
      document.getElementById('modalLocationImg').src = '/assets/default-thumb.jpg';
    }
    document.getElementById('modalObjId').innerText = id;
    document.getElementById('modalLocationWaze').href = locationsThumbs[id - 1].data.waze;

    toggleModal();
  };

  roadImg.addEventListener("transitionend", function () {
    console.log('transitionend');
    transitionInProgress = false;
  }, true);

  window.addEventListener("mousewheel", function (e) {
    if (!showModal && !transitionInProgress) {
      // scroll down
      if (e.wheelDelta < 0) {
        scrollCounter++;
      }
      animationScroll();
    }
  }, false);

  moveForward = function () {
    if (!showModal && !transitionInProgress) {
      // scroll down
      scrollCounter++;
      animationScroll();
    }
  };

  loadPlacesInfo = function (data) {
    var i, n;

    for (i = 0, n = data.length; i<n; i++) {
      locationsThumbs[data[i].code - 1].data = data[i];
      if (data[i].checked) {
        document.getElementById('location-thumb' + data[i].code).src = '/assets/place' + data[i].code + '.jpg';
      }
    }
    console.log(data);
  };

  loadPlacesInfoAjax = function () {
      var xmlhttp = new XMLHttpRequest();

      xmlhttp.onreadystatechange = function() {
          if (xmlhttp.readyState === XMLHttpRequest.DONE ) {
             if (xmlhttp.status === 200) {
                 loadPlacesInfo(JSON.parse(xmlhttp.response));
             }
             else if (xmlhttp.status === 400) {
                alert('There was an error 400');
             }
             else {
                 alert('something else other than 200 was returned');
             }
          }
      };

      xmlhttp.open("GET", "/api/places", true);
      xmlhttp.send();
  }

  checkPosition = function () {
    var id = document.getElementById('modalObjId').innerText;
    navigator.geolocation.getCurrentPosition(function(position) {
      var testaparta = {
        lat:  9.925071,
        lon: -84.003236
      };
      var aux = {
        currentLat: position.coords.latitude,
        currentLon: position.coords.longitude,
        targetLat: testaparta.lat,
        targetLon: testaparta.lon
      };

      // if (aux.currentLon < 0) {
      //   aux.currentLon = (aux.currentLon * aux.currentLon) / aux.currentLon;
      // }
      // if (aux.currentLat < 0) {
      //   aux.currentLat = (aux.currentLat * aux.currentLat) / aux.currentLat;
      // }
      // if (aux.targetLat < 0) {
      //   aux.targetLat = (aux.targetLat * aux.targetLat) / aux.targetLat;
      // }
      // if (aux.targetLon < 0) {
      //   aux.targetLon = (aux.targetLon * aux.targetLon) / aux.targetLon;
      // }

      //actual
      // lat: 9.925231
      //      9.925071
      // lon: -84.003115
      //      -84.003236
      console.log(position);
      console.log(aux.currentLat);
      console.log(aux.targetLat + 0.001);
      console.log(((aux.currentLat >= aux.targetLat && aux.currentLat <= (aux.targetLat + 0.001)) || (aux.currentLat <= aux.targetLat && aux.currentLat >= (aux.targetLat - 0.001))));
      console.log(aux.currentLat <= (aux.targetLat - 0.001));
      if (((aux.currentLat >= aux.targetLat && aux.currentLat <= (aux.targetLat + 0.001)) || (aux.currentLat <= aux.targetLat && aux.currentLat >= (aux.targetLat - 0.001))) &&
          ((aux.currentLon >= aux.targetLon && aux.currentLon <= (aux.targetLon + 0.001)) || (aux.currentLon <= aux.targetLat && aux.currentLon >= (aux.targetLon - 0.001)))) {
          alert("yes!");
      } else {
        alert("no");
      }
    });
  };

  init = function () {
    var i,
        n;
    // Init values
    carElement.style.transform = 'rotate(180deg)';

    for (i = 1, n = 5; i<=n; i++) {
      locationThumbs.push({
        locationThumbContainer: document.getElementById('location-thumb-container-' + i),
        locationThumbImg: document.getElementById('location-thumb' + i)
      });
      locationThumbs[i-1].locationThumbContainer.style.top = locationsThumbs[i-1].top + 'px';
      locationThumbs[i-1].locationThumbContainer.style.right = locationsThumbs[i-1].right + 'px';
    }

    loadPlacesInfoAjax();

    if (navigator.geolocation) {
      geolocation = true;
    }
  };

  init();

})();
