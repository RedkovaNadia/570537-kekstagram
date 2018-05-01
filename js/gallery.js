'use strict';

(function () {
  // НА ОСНОВАНИИ ДАННЫХ И Ф-ЦИИ СОЗДАНИЯ ФОТО - ВСТАВКА КАЖДОЙ ИЗ ФРАГМЕНТА В ДОМ (25 МИНИАТЮР)
  var photos = [];
  var NUMBER_OF_PHOTOS = 25;
  var picturesBlock = document.querySelector('.pictures');
  var documentFragment = document.createDocumentFragment();

  var renderPhotos = function () {
    // добиваюсь нужного мне количества фотографий при помощи ф-ции с циклом внутри, вставляю каждую во фрагмент и далее - в DOM
    for (var i = 0; i < photos.length; i++) {
      documentFragment.appendChild(window.picture.createPhotoElement(photos[i]));
    }
    picturesBlock.appendChild(documentFragment);
  };
  renderPhotos();

  var onLoadSuccess = function (response) {
    photos = response.slice(0, NUMBER_OF_PHOTOS);
    renderPhotos();
  };

  var onLoadError = function (errorMessage) {
    var node = document.createElement('div');
    node.style = 'z-index: 100; margin: 0 auto; text-align: center; background-color: red;';
    node.style.position = 'absolute';
    node.style.left = '0';
    node.style.right = '0';
    node.style.fontSize = '30px';

    node.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', node);
  };

  window.backend.getServerConnection(onLoadSuccess, onLoadError, 'GET', window.backend.LOAD_URL);
})();

// старый вариант этого модуля
/*
(function () {
  // НА ОСНОВАНИИ ДАННЫХ МАССИВА И Ф-ЦИИ СОЗДАНИЯ ФОТО ВТСТАВКА КАЖДОЙ ИЗ ФРАГМЕНТА В ДОМ (25 МИНИАТЮР)
  var picturesBlock = document.querySelector('.pictures');
  var documentFragment = document.createDocumentFragment();

  var renderPhotos = function () {
    // добиваюсь нужного мне количества фотографий при помощи ф-ции с циклом внутри, вставляю каждую во фрагмент и далее - в DOM
    for (var i = 0; i < window.data.photos.length; i++) {
      documentFragment.appendChild(window.picture.createPhotoElement(window.data.photos[i]));
    }
    picturesBlock.appendChild(documentFragment);
  };
  renderPhotos();
})();
*/
