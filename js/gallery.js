'use strict';

(function () {
  // НА ОСНОВАНИИ ДАННЫХ И Ф-ЦИИ СОЗДАНИЯ ФОТО - ВСТАВКА КАЖДОЙ ИЗ ФРАГМЕНТА В ДОМ (25 МИНИАТЮР)
  var photos = [];
  var NUMBER_OF_PHOTOS = 25;
  var picturesBlock = document.querySelector('.pictures');
  var filtersContainer = document.querySelector('.img-filters ');
  var filtersButtons = filtersContainer.querySelectorAll('.img-filters__button');
  var documentFragment = document.createDocumentFragment();

  var removeOldPhotos = function () {
    var oldPhotos = picturesBlock.querySelectorAll('.picture__link');
    if (oldPhotos !== null) {
      [].forEach.call(oldPhotos, function (element) {
        picturesBlock.removeChild(element);
      });
    }
  };

  var renderPhotos = function (filteredPhotos) {
    removeOldPhotos();
    // добиваюсь нужного мне количества фотографий при помощи ф-ции с циклом внутри, вставляю каждую во фрагмент и далее - в DOM
    filteredPhotos.forEach(function (item) {
      documentFragment.appendChild(window.picture.createPhotoElement(item));
    });
    picturesBlock.appendChild(documentFragment);
  };

  var lastTimeout;
  var onFiltersButtonClick = function (evt) {
    var activeElement = evt.target;
    filtersContainer.querySelector('.img-filters__button--active').classList.remove('img-filters__button--active');
    activeElement.classList.add('img-filters__button--active');
    var photosCopy = photos.slice();

    switch (activeElement.id) {
      case 'filter-popular':
        photosCopy = photos.sort(function (first, second) {
          return second.likes - first.likes;
        });
        break;

      case 'filter-discussed':
        photosCopy = photos.sort(function (first, second) {
          return second.comments.length - first.comments.length;
        });
        break;

      case 'filter-random':
        photosCopy = window.util.shuffleArray(photosCopy);
        break;
    }
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(function () {
      renderPhotos(photosCopy);
    }, 500);
  };

  var onLoadSuccess = function (response) {
    photos = response.slice(0, NUMBER_OF_PHOTOS);
    renderPhotos(photos);
    filtersContainer.classList.remove('img-filters--inactive');
    [].forEach.call(filtersButtons, function (button) {
      button.addEventListener('click', onFiltersButtonClick);
    });
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

  window.backend.loadData(onLoadSuccess, onLoadError);
})();
