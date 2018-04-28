'use strict';

(function () {

  var bigPictureElement = document.querySelector('.big-picture');
  var bigPictureCancel = bigPictureElement.querySelector('.big-picture__cancel');

  var socialComments = bigPictureElement.querySelector('.social__comments');
  var socialComment = socialComments.querySelectorAll('.social__comment');

  // ЗАПОЛНЕНИЕ ЭЛЕМЕНТА БОЛЬШОЙ ФОТОГРАФИИ ДАННЫМИ ИЗ МАССИВА
  var renderBigPicture = function (object) {
    bigPictureElement.querySelector('img').src = object.url;
    bigPictureElement.querySelector('.likes-count').textContent = object.likes;
    bigPictureElement.querySelector('.comments-count').textContent = object.comments.length;
    socialComment[1].classList.add('visually-hidden');
    socialComment[0].innerHTML = '';
    var imgElement = document.createElement('img');
    var spanElement = document.createElement('span');
    imgElement.className = 'social__picture';
    imgElement.src = 'img/avatar-' + Math.round(window.util.getRandomNumber(1, 6)) + '.svg';
    imgElement.width = 35;
    imgElement.height = 35;
    spanElement.textContent = object.comments;
    socialComment[0].appendChild(imgElement);
    socialComment[0].appendChild(spanElement);
  };

  // Прячу блоки счётчика комментариев и загрузки новых комментариев
  var addVisuallyHiddenClass = function (element, selector) {
    element.querySelector(selector).classList.add('visually-hidden');
  };

  var socialCommentCountClass = '.social__comment-count';
  var socialCommentLoadmoreClass = '.social__comment-loadmore';
  addVisuallyHiddenClass(bigPictureElement, socialCommentCountClass);
  addVisuallyHiddenClass(bigPictureElement, socialCommentLoadmoreClass);

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
      renderBigPicture(object);
      openBigPicture();
    });

    return photoElement;
  };

  // ---------------
  // НА ОСНОВАНИИ ДАННЫХ МАССИВА И Ф-ЦИИ СОЗДАНИЯ ФОТО ВТСТАВКА КАЖДОЙ ИЗ ФРАГМЕНТА В ДОМ (25 МИНИАТЮР)
  var picturesBlock = document.querySelector('.pictures');
  var documentFragment = document.createDocumentFragment();

  var renderPhotos = function () {
    // добиваюсь нужного мне количества фотографий при помощи ф-ции с циклом внутри, вставляю каждую во фрагмент и далее - в DOM
    for (var i = 0; i < window.data.photos.length; i++) {
      documentFragment.appendChild(createPhotoElement(window.data.photos[i]));
    }
    picturesBlock.appendChild(documentFragment);
  };
  renderPhotos();

  // ---------------------------------------------------------------------------------------------------
  // НАЧИНАЕМ РАБОТАТЬ С ОБРАБОТЧИКАМИ СОБЫТИЙ
  // ф-ция закрывает большую фотографию по нажатию esc на документа
  var onBigPictureEscPress = function (evt) {
    window.util.isEscEvent(evt, onBigPictureCancelClick);
  };

  // ф-ция открывает большое фото удалением у блока класса hidden
  var openBigPicture = function () {
    bigPictureElement.classList.remove('hidden');
    document.addEventListener('keydown', onBigPictureEscPress);
  };

  // ф-ция закрывает большое фото длбавлением блоку класс hidden и удаляет обработчик закрытия фото по esc
  var onBigPictureCancelClick = function () {
    bigPictureElement.classList.add('hidden');
    document.removeEventListener('keydown', onBigPictureEscPress);
  };
  // добавление обработчика закрытия большого фото по клику на крестик элемента
  bigPictureCancel.addEventListener('click', onBigPictureCancelClick);
})();
