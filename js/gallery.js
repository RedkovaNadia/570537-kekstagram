'use strict';

(function () {
  // НА ОСНОВАНИИ ДАННЫХ И Ф-ЦИИ СОЗДАНИЯ ФОТО - ВСТАВКА КАЖДОЙ ИЗ ФРАГМЕНТА В ДОМ (25 МИНИАТЮР)
  var photos = [];
  var NUMBER_OF_PHOTOS = 25;
  var picturesBlock = document.querySelector('.pictures');
  var filtersContainer = document.querySelector('.img-filters ');
  var filtersButtons = filtersContainer.querySelectorAll('.img-filters__button');
  var documentFragment = document.createDocumentFragment();

  var renderPhotos = function () {
    // добиваюсь нужного мне количества фотографий при помощи ф-ции с циклом внутри, вставляю каждую во фрагмент и далее - в DOM
    photos.forEach(function (item) {
      documentFragment.appendChild(window.picture.createPhotoElement(item));
    });
    picturesBlock.appendChild(documentFragment);
  };

  var lastTimeout;
  var onFiltersButtonClick = function (evt) {
    var activeElement = evt.target;
    activeElement.classList.add('img-filters__button--active');

    switch (activeElement.id) {
      case 'filter-popular':
        photos = photos.sort(function (first, second) {
          return second.likes - first.likes;
        });
        break;

      case 'filter-discussed':
        photos = photos.sort(function (first, second) {
          return second.comments.length - first.comments.length;
        });
        break;

      case 'filter-random':
        photos = window.util.shuffleArray(photos);
        break;
    }
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(function () {
      renderPhotos();
    }, 500);
  };

  var onLoadSuccess = function (response) {
    photos = response.slice(0, NUMBER_OF_PHOTOS);
    renderPhotos();
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
