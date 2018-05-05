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

  var addVisuallyHiddenClass = function (element, selector) {
    element.querySelector(selector).classList.add('visually-hidden');
  };

  var socialCommentCountClass = '.social__comment-count';
  var socialCommentLoadmoreClass = '.social__comment-loadmore';
  addVisuallyHiddenClass(bigPictureElement, socialCommentCountClass);
  addVisuallyHiddenClass(bigPictureElement, socialCommentLoadmoreClass);

  var openBigPicture = function () {
    bigPictureElement.classList.remove('hidden');
    document.querySelector('body').classList.add('modal-open');
    document.addEventListener('keydown', onBigPictureEscPress);
  };

  var onBigPictureEscPress = function (evt) {
    window.util.isEscEvent(evt, onBigPictureCancelClick);
  };

  var onBigPictureCancelClick = function () {
    bigPictureElement.classList.add('hidden');
    document.querySelector('body').classList.remove('modal-open');
    document.removeEventListener('keydown', onBigPictureEscPress);
  };

  bigPictureCancel.addEventListener('click', onBigPictureCancelClick);

  window.preview = {
    renderBigPicture: renderBigPicture,
    openBigPicture: openBigPicture
  };
})();
