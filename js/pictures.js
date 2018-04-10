'use strict';

var NUMBER_OF_PHOTOS = 25;
var COMMENTS = ['Всё отлично!', 'В целом всё неплохо. Но не всё.', 'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.', 'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.', 'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'];
var DESCRIPTIONS = ['Тестим новую камеру!', 'Затусили с друзьями на море', 'Как же круто тут кормят', 'Отдыхаем...', 'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......', 'Вот это тачка!'];

// ф-ция, определяющая рандомное значение в заданном диапазоне чисел
var getRandomNumber = function (min, max) {
  return min + Math.random() * (max - min);
};

// функция, возвращающая рандомный индекс массива
var getRandomIndex = function (number) {
  return Math.floor(Math.random() * number);
};

var shuffleArray = function (array) { // ф-ция, которая мешает массив
  var arrayCopy = array.slice();
  var mixedArray = [];
  while (mixedArray.length < array.length) {
    var randomIndex = getRandomIndex(arrayCopy.length);
    mixedArray.push(arrayCopy[randomIndex]);
    arrayCopy.splice(randomIndex, 1);
  }
  return mixedArray;
};

// создаю объект фотографии
var getPhotoObject = function (index) {
  var commentsArrayShuffleCopy = shuffleArray(COMMENTS);
  commentsArrayShuffleCopy.splice(1, COMMENTS.length);
  return {
    'url': 'photos/' + index + '.jpg',
    'likes': Math.round(getRandomNumber(15, 200)),
    'comments': commentsArrayShuffleCopy,
    'description': getRandomIndex(DESCRIPTIONS.length)
  };
};
// генерирую массив из 25 объектов-фотографий
var photos = [];
for (var i = 0; i < NUMBER_OF_PHOTOS; i++) {
  photos.push(getPhotoObject(i));
}
// нахожу нужный шаблон и клонирую его
var pictureTemplate = document.querySelector('#picture');
var photoElement = pictureTemplate.cloneNode(true);

// На основе данных объектов массива и шаблона создаю DOM-элементы, соответствующие фотографиям и заполняю их данными из массива
var createPhotoElement = function (object) {

  photoElement.content.querySelector('.picture__img').src = object.url;
  photoElement.content.querySelector('.picture__stat--likes').textContent = object.likes;
  photoElement.content.querySelector('.picture__stat--comments').textContent = object.comments;

  return photoElement;
};

// добиваюсь нужного мне количества фотографий при помощи ф-ции с циклом внутри, вставляю каждую во фрагмент и далее - в DOM
var picturesBlock = document.querySelector('.pictures');
var documentFragment = document.createDocumentFragment();
var renderPhotos = function () {
  for (i = 0; i < photos.length; i++) {
    documentFragment.appendChild(createPhotoElement(photos[i]));
  }
  picturesBlock.appendChild(documentFragment);
};
renderPhotos();

var bigPictureElement = document.querySelector('.big-picture');
bigPictureElement.classList.remove('hidden');

var renderBigPicture = function (object) {
  bigPictureElement.querySelector('.big-picture__img').src = object.url;
  bigPictureElement.querySelector('.likes-count').textContent = object.likes;
  bigPictureElement.querySelector('.comments-count').textContent = object.comments.length;

  var socialComments = bigPictureElement.querySelectorAll('.social__comment');
  socialComments[0].querySelector('.social__picture').src = 'img/avatar-' + Math.round(getRandomNumber(1, 6)) + '.svg';
  socialComments[0].textContent = object.comments;
  socialComments[1].classList.add('visually-hidden');
};

renderBigPicture(photos[0]);

// Прячу блоки счётчика комментариев и загрузки новых комментариев
var addVisuallyHiddenClass = function (element, selector) {
  element.querySelector(selector).classList.add('visually-hidden');
};

var socialCommentCountClass = '.social__comment-count';
var socialCommentLoadmoreClass = '.social__comment-loadmore';
addVisuallyHiddenClass(bigPictureElement, socialCommentCountClass);
addVisuallyHiddenClass(bigPictureElement, socialCommentLoadmoreClass);
