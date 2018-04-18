'use strict';

var NUMBER_OF_PHOTOS = 25;
var COMMENTS = ['Всё отлично!', 'В целом всё неплохо. Но не всё.', 'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.', 'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.', 'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'];
var DESCRIPTIONS = ['Тестим новую камеру!', 'Затусили с друзьями на море', 'Как же круто тут кормят', 'Отдыхаем...', 'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......', 'Вот это тачка!'];
var ESC_KEYCODE = 27;

// ф-ция, определяющая рандомное значение в заданном диапазоне чисел
var getRandomNumber = function (min, max) {
  return min + Math.random() * (max - min);
};

// функция, возвращающая рандомный индекс массива
var getRandomIndex = function (array) {
  return Math.round(getRandomNumber(0, (array.length - 1)));
};

var shuffleArray = function (array) { // ф-ция, которая мешает массив
  var arrayCopy = array.slice();
  var mixedArray = [];
  while (mixedArray.length < array.length) {
    var randomIndex = getRandomIndex(arrayCopy);
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
    'url': 'photos/' + (index + 1) + '.jpg',
    'likes': Math.round(getRandomNumber(15, 200)),
    'comments': commentsArrayShuffleCopy,
    'description': DESCRIPTIONS[getRandomIndex(DESCRIPTIONS)]
  };
};
// генерирую массив из 25 объектов-фотографий
var photos = [];
for (var i = 0; i < NUMBER_OF_PHOTOS; i++) {
  photos.push(getPhotoObject(i));
}

var bigPictureElement = document.querySelector('.big-picture');
var bigPictureCancel = bigPictureElement.querySelector('.big-picture__cancel');
var pictureTemplate = document.querySelector('#picture').content.querySelector('.picture__link');

// ----------------------------------------------
// ф-ция закрывает большую фотографию по нажатию esc на документа
var onBigPictureEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    onBigPictureCancelClick();
    // console.log('esc');
  }
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
  // console.log('closeBigPicture');
};

// На основе данных объектов массива и шаблона создаю DOM-элементы, соответствующие фотографиям и заполняю их данными из массива
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
    // console.log('photoClick');
  });

  return photoElement;
};

// добавление обработчика закрытия большого фото по клику на крестик элемента
bigPictureCancel.addEventListener('click', onBigPictureCancelClick);

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

// bigPictureElement.classList.remove('hidden');

var socialComments = bigPictureElement.querySelector('.social__comments');
var socialComment = socialComments.querySelectorAll('.social__comment');

// ф-ция заполнения элемента фотографии данными
var renderBigPicture = function (object) {
  bigPictureElement.querySelector('img').src = object.url;
  bigPictureElement.querySelector('.likes-count').textContent = object.likes;
  bigPictureElement.querySelector('.comments-count').textContent = object.comments.length;
  socialComment[1].classList.add('visually-hidden');
  socialComment[0].innerHTML = '';
  var imgElement = document.createElement('img');
  var spanElement = document.createElement('span');
  imgElement.className = 'social__picture';
  imgElement.src = 'img/avatar-' + Math.round(getRandomNumber(1, 6)) + '.svg';
  imgElement.width = 35;
  imgElement.height = 35;
  spanElement.textContent = object.comments;
  socialComment[0].appendChild(imgElement);
  socialComment[0].appendChild(spanElement);
};

// отрисовка главной фотографии с данными первого объекта массива фотографий
// renderBigPicture(photos[0]);

// Прячу блоки счётчика комментариев и загрузки новых комментариев
var addVisuallyHiddenClass = function (element, selector) {
  element.querySelector(selector).classList.add('visually-hidden');
};

var socialCommentCountClass = '.social__comment-count';
var socialCommentLoadmoreClass = '.social__comment-loadmore';
addVisuallyHiddenClass(bigPictureElement, socialCommentCountClass);
addVisuallyHiddenClass(bigPictureElement, socialCommentLoadmoreClass);

// ------------------------------------
var uploadFileInput = document.querySelector('#upload-file');
var imgUploadOverlay = document.querySelector('.img-upload__overlay');
var imgUploadCancel = imgUploadOverlay.querySelector('.img-upload__cancel');
var hashtagInput = imgUploadOverlay.querySelector('.text__hashtags');
var descriptionTextarea = imgUploadOverlay.querySelector('.text__description');

// ф-ция-обработчик, которая закрывает окно редактирования по нажатию на esc
// (и не закрывает, если инпут ввода хэш-тега или комментария в фокусе)
var onUploadOverlayEscPress = function (evt) {
  if (hashtagInput === document.activeElement || descriptionTextarea === document.activeElement) {
    evt.stopPropagation();
    // console.log('stopPropagation');
  } else if (evt.keyCode === ESC_KEYCODE) {
    onImgUploadCancelClick();
    // console.log('esc');
  }
};

// ф-ция открывает окно редактирования загруженного фото и добавляет обработчик закрытия окна настройки по нажатия esc на документе
var onUploadFileInputChange = function () {
  imgUploadOverlay.classList.remove('hidden');
  document.addEventListener('keydown', onUploadOverlayEscPress);
};

// ф-ция закрывает окно редактирования загруженного фото и удаляет обработчик закрытия окна настройки по нажатия esc на документе
var onImgUploadCancelClick = function () {
  imgUploadOverlay.classList.add('hidden');
  // сбрасываем значение инпута загрузки, чтобы было возможно загружать одно фото повторно
  uploadFileInput.value = null;
  document.removeEventListener('keydown', onUploadOverlayEscPress);
  // console.log('closeUploadOverlay');
};

// добавление обработчика открытия окна редактирования фото на форму загрузки нового фото
uploadFileInput.addEventListener('change', onUploadFileInputChange);

// добавление обработчика закрытия окна редактирования фото на крестик окна редактирования
imgUploadCancel.addEventListener('click', onImgUploadCancelClick);

// добавляем эффекты на загруженное фото
var imgUploadPreview = imgUploadOverlay.querySelector('.img-upload__preview');
var effectsRadioElements = imgUploadOverlay.querySelectorAll('.effects__radio');

// обработчик, добавляющий эффекты (добавлением соответствующего класса картинке)
var onEffectRadioElementClick = function (evt) {
  imgUploadPreview.className = 'effects__preview--' + evt.target.value;
};

// циклом вешаем обработчики на все элементы
for (i = 0; i < effectsRadioElements.length; i++) {
  effectsRadioElements[i].addEventListener('click', onEffectRadioElementClick);
}

// изменяем масштаб
var resizeMinusButton = imgUploadOverlay.querySelector('.resize__control--minus');
var resizePlusButton = imgUploadOverlay.querySelector('.resize__control--plus');
var resizeControlValueInput = imgUploadOverlay.querySelector('.resize__control--value');

resizeControlValueInput.value = '100%';
var resizeControlValue = resizeControlValueInput.value;

// обработчики, увеличивающие и уменьшающие масштаб загруженного фото
var onResizeMinusButtonClick = function () {
  if (parseInt(resizeControlValue, 10) >= 50) {
    resizeControlValue = (parseInt(resizeControlValue, 10) - 25) + '%';
    resizeControlValueInput.value = resizeControlValue;
    // console.log(resizeControlValue);
    imgUploadPreview.style = 'transform: scale(0.' + parseInt(resizeControlValue, 10) + ')';
  }
};

var onResizePlusButtonClick = function () {
  if (parseInt(resizeControlValue, 10) >= 25 && parseInt(resizeControlValue, 10) <= 75) {
    resizeControlValue = (parseInt(resizeControlValue, 10) + 25) + '%';
    resizeControlValueInput.value = resizeControlValue;
    // console.log(resizeControlValue);
    if (parseInt(resizeControlValue, 10) === 100) {
      imgUploadPreview.style = 'transform: scale(1)';
    } else {
      imgUploadPreview.style = 'transform: scale(0.' + parseInt(resizeControlValue, 10) + ')';
    }
  }
};

resizeMinusButton.addEventListener('click', onResizeMinusButtonClick);
resizePlusButton.addEventListener('click', onResizePlusButtonClick);

// ползунок

/*
var effectFilter = {
  'chrome': 'filter: grayscale(0..1)', // 1 * scalePinLevel / 100;
  'sepia': 'filter: sepia(0..1)', // 1 * scalePinLevel / 100;
  'marvin': 'filter: invert(0..100%)', // scalePinLevel
  'phobos': 'filter: blur(0..3px)', // 3 * scalePinLevel / 100 + 'px';
  'heat': 'filter: brightness(1..3)' //
};
*/

var scaleLine = document.querySelector('.scale__line'); // находим блок слайдера
var scalePin = scaleLine.querySelector('.scale__pin'); // находим блок пина
var scaleValue = document.querySelector('.scale__value'); // находим блок, который принимает уровень насыщенности эффекта
var scaleLineWidth = scaleLine.style.width; // находим ширину блока слайдера
// var scaleLineWidth = 453; // данные о ширине из elements

// высчитываем уровень насыщенности через пропорцию
var scalePinLevel = scalePin.left * 100 / scaleLineWidth;

scalePin.addEventListener('mouseup', function () {
  // console.log(scaleLineWidth);
  // console.log(scalePin.left);
  scaleValue.value = scalePinLevel;
  // console.log(scaleValue.value);
  // обновляем фильтр большой картинки (незаконченное)
  // imgUploadPreview.style.filter =
});


// ----- черновики - уберу

// console.log(scalePin.getBoundingClientRect());
// console.log(scalePin.position());
// console.log(scalePin.offsetHeight);

// var pinCoordinates = scalePin.getBoundingClientRect();
// var scalePinLevel = scalePin.style.left * 100 / scaleLineWidth;
// var scalePinLevel = pinCoordinates.left * 100 / scaleLineWidth;

// scaleLineWidth = 100%
// scalePin.offsetLeft = x;
// x = scalePin.offsetLeft * 100 / scaleLineWidth
