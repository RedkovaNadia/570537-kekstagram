'use strict';

(function () {
  // ---------------
// СОЗДАНИЕ DOM-элемента (ЭЛЕМЕНТ ФОТОГРАФИИ, МИНИАТЮРА)

// На основе данных объектов массива и шаблона создаю DOM-элементы, соответствующие фотографиям и заполняю их данными из массива
  var pictureTemplate = document.querySelector('#picture').content.querySelector('.picture__link');
  var createPhotoElement = function (object) {
    // нахожу нужный шаблон и клонирую его
    var photoElement = pictureTemplate.cloneNode(true);

    photoElement.querySelector('.picture__img').src = object.url;
    photoElement.querySelector('.picture__stat--likes').textContent = object.likes;
    photoElement.querySelector('.picture__stat--comments').textContent = object.comments.length;

    // добавление обработчика открытия большого фото по клику на элемент
    photoElement.addEventListener('click', function () {
      window.preview.renderBigPicture(object);
      window.preview.openBigPicture();
    });

    return photoElement;
  };
  window.picture = {
    createPhotoElement: createPhotoElement
  };
})();
