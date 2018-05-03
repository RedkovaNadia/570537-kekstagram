'use strict';

(function () {

  var bigPictureElement = document.querySelector('.big-picture');
  var bigPictureCancel = bigPictureElement.querySelector('.big-picture__cancel');
  var socialComments = bigPictureElement.querySelector('.social__comments');

  var appendComment = function (text) {
    var commentElement = document.createElement('li');
    commentElement.classList.add('social__comment', 'social__comment--text');

    var avatar = document.createElement('img');
    avatar.classList.add('social__picture');
    avatar.width = 35;
    avatar.height = 35;
    avatar.src = 'img/avatar-' + Math.round(window.util.getRandomNumber(1, 6)) + '.svg';

    commentElement.appendChild(avatar);

    var textElement = document.createTextNode(text);
    commentElement.appendChild(textElement);

    return commentElement;
  };

  // ЗАПОЛНЕНИЕ ЭЛЕМЕНТА БОЛЬШОЙ ФОТОГРАФИИ ДАННЫМИ ИЗ МАССИВА
  var renderBigPicture = function (object) {
    bigPictureElement.querySelector('img').src = object.url;
    bigPictureElement.querySelector('.likes-count').textContent = object.likes;
    bigPictureElement.querySelector('.comments-count').textContent = object.comments.length;

    var documentFragment = document.createDocumentFragment();
    socialComments.innerHTML = '';

    object.comments.forEach(function (item) {
      documentFragment.appendChild(appendComment(item));
    });

    socialComments.appendChild(documentFragment);
    bigPictureElement.querySelector('.social__caption').textContent = object.comments[0];
  };

  /*
  var socialComment = socialComments.querySelectorAll('.social__comment');

  // ЗАПОЛНЕНИЕ ЭЛЕМЕНТА БОЛЬШОЙ ФОТОГРАФИИ ДАННЫМИ ИЗ МАССИВА
  var renderBigPicture = function (object) {
    bigPictureElement.querySelector('img').src = object.url;
    bigPictureElement.querySelector('.likes-count').textContent = object.likes;
    bigPictureElement.querySelector('.comments-count').textContent = object.comments.length;
    socialComment[0].classList.add('visually-hidden');
    socialComment[1].classList.add('visually-hidden');
    var documentFragment = document.createDocumentFragment();
    for (var i = 0; i < object.comments.length; i++) {
      // social__comment social__comment--text
      var imgElement = document.createElement('img');
      var spanElement = document.createElement('span');
      imgElement.className = 'social__picture';
      imgElement.src = 'img/avatar-' + Math.round(window.util.getRandomNumber(1, 6)) + '.svg';
      imgElement.width = 35;
      imgElement.height = 35;
      spanElement.textContent = object.comments[i];
      spanElement.appendChild(imgElement);
      documentFragment.appendChild(spanElement);
    }
    socialComments.appendChild(documentFragment);
    bigPictureElement.querySelector('.social__caption').textContent = object.comments[0];
  };
  */

  // Прячу блоки счётчика комментариев и загрузки новых комментариев
  var addVisuallyHiddenClass = function (element, selector) {
    element.querySelector(selector).classList.add('visually-hidden');
  };

  var socialCommentCountClass = '.social__comment-count';
  var socialCommentLoadmoreClass = '.social__comment-loadmore';
  addVisuallyHiddenClass(bigPictureElement, socialCommentCountClass);
  addVisuallyHiddenClass(bigPictureElement, socialCommentLoadmoreClass);

  // НАЧИНАЕМ РАБОТАТЬ С ОБРАБОТЧИКАМИ СОБЫТИЙ

  // ф-ция открывает большое фото удалением у блока класса hidden
  var openBigPicture = function () {
    bigPictureElement.classList.remove('hidden');
    document.querySelector('body').classList.add('modal-open');
    document.addEventListener('keydown', onBigPictureEscPress);
  };

  // ф-ция закрывает большую фотографию по нажатию esc на документа
  var onBigPictureEscPress = function (evt) {
    window.util.isEscEvent(evt, onBigPictureCancelClick);
  };

  // ф-ция закрывает большое фото длбавлением блоку класс hidden и удаляет обработчик закрытия фото по esc
  var onBigPictureCancelClick = function () {
    bigPictureElement.classList.add('hidden');
    document.removeEventListener('keydown', onBigPictureEscPress);
  };
  // добавление обработчика закрытия большого фото по клику на крестик элемента
  bigPictureCancel.addEventListener('click', onBigPictureCancelClick);

  window.preview = {
    renderBigPicture: renderBigPicture,
    openBigPicture: openBigPicture
  };
})();
