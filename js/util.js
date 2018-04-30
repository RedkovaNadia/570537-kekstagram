'use strict';
(function () {
  var ESC_KEYCODE = 27;
  // ф-ция, определяющая рандомное значение в заданном диапазоне чисел
  var getRandomNumber = function (min, max) {
    return min + Math.random() * (max - min);
  };

  // функция, возвращающая рандомный индекс массива
  var getRandomIndex = function (array) {
    return Math.round(getRandomNumber(0, (array.length - 1)));
  };

  var shuffleArray = function (array) { // ф-ция, которая мешает массив
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
    getRandomNumber: getRandomNumber, // data, gallery
    getRandomIndex: getRandomIndex, // data
    shuffleArray: shuffleArray, // data
    isEscEvent: isEscEvent // gallery, form
  };
})();

/*
// 'модуль' backend.js - черновое
(function () {
  var UPLOAD_URL = 'https://js.dump.academy/kekstagram';
  var LOAD_URL = 'https://js.dump.academy/kekstagram/data';

  // ф-ция загрузки данных
  var loadData = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onLoad(xhr.response);
      } else {
        onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.open('GET', LOAD_URL);
    xhr.send();
  };

  // ф-ция отправки данных
  var uploadData = function (data, onLoad) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      onLoad(xhr.response);
    });

    xhr.open('POST', UPLOAD_URL);
    xhr.send(data);
  };

  // экспортируем ф-ции
  window.backend = {
    uploadData: uploadData,
    loadData: loadData
  };
})();
*/
