'use strict';

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
