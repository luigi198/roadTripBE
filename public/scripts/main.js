// Global Variables
var toggleModal,
    openLocationThumbModal;

(function () {

  var init,
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

  animationScroll = function () {
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
          toggleModal();
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
          toggleModal();
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
          toggleModal();
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
          toggleModal();
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
          toggleModal();
        });
        break;
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
      // else if (scrollCounter !== 0) {
      //   scrollCounter--;
      // }
      animationScroll();
    }
  }, false);

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
  };

  init();

})();
