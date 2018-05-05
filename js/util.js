'use strict';
(function () {
  var ESC_KEYCODE = 27;

  var getRandomNumber = function (min, max) {
    return min + Math.random() * (max - min);
  };

  var getRandomIndex = function (array) {
    return Math.round(getRandomNumber(0, (array.length - 1)));
  };

  var shuffleArray = function (array) {
    var arrayCopy = array.slice();
    var mixedArray = [];
    while (mixedArray.length < array.length) {
      var randomIndex = getRandomIndex(arrayCopy);
      mixedArray.push(arrayCopy[randomIndex]);
      arrayCopy.splice(randomIndex, 1);
    }
    return mixedArray;
  };

  var isEscEvent = function (evt, action) {
    if (evt.keyCode === ESC_KEYCODE) {
      action();
    }
  };
  window.util = {
    getRandomNumber: getRandomNumber,
    shuffleArray: shuffleArray,
    isEscEvent: isEscEvent
  };
})();


