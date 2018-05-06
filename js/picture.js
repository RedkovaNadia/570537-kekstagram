'use strict';

(function () {
  var pictureTemplate = document.querySelector('#picture').content.querySelector('.picture__link');
  var createPhotoElement = function (object) {
    var photoElement = pictureTemplate.cloneNode(true);

    photoElement.querySelector('.picture__img').src = object.url;
    photoElement.querySelector('.picture__stat--likes').textContent = object.likes;
    photoElement.querySelector('.picture__stat--comments').textContent = object.comments.length;

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
