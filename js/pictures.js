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
// НАЧИНАЕМ РАБОТАТЬ С ОБРАБОТЧИКАМИ СОБЫТИЙ
// ф-ция закрывает большую фотографию по нажатию esc на документа
var onBigPictureEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    onBigPictureCancelClick();
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

// -----------------------------------------
// Работаем с окном редактирования загруженного фото
var uploadFileInput = document.querySelector('#upload-file');
var imgUploadOverlay = document.querySelector('.img-upload__overlay');
var imgUploadCancel = imgUploadOverlay.querySelector('.img-upload__cancel');
var hashtagInput = imgUploadOverlay.querySelector('.text__hashtags');
var descriptionTextarea = imgUploadOverlay.querySelector('.text__description');
var imgUploadScale = document.querySelector('.img-upload__scale');

// ф-ция-обработчик, которая закрывает окно редактирования по нажатию на esc
// (и не закрывает, если инпут ввода хэш-тега или комментария в фокусе)
var onUploadOverlayEscPress = function (evt) {
  if (hashtagInput === document.activeElement || descriptionTextarea === document.activeElement) {
    evt.stopPropagation();
  } else if (evt.keyCode === ESC_KEYCODE) {
    onImgUploadCancelClick();
  }
};

// ф-ция открывает окно редактирования загруженного фото и добавляет обработчик закрытия окна настройки по нажатия esc на документе
var onUploadFileInputChange = function () {
  imgUploadOverlay.classList.remove('hidden');
  document.addEventListener('keydown', onUploadOverlayEscPress);
  imgUploadScale.classList.add('hidden');
};

// ф-ция закрывает окно редактирования загруженного фото и удаляет обработчик закрытия окна настройки по нажатия esc на документе
var onImgUploadCancelClick = function () {
  imgUploadOverlay.classList.add('hidden');
  // сбрасываем значение инпута загрузки, чтобы было возможно загружать одно фото повторно
  uploadFileInput.value = null;
  document.removeEventListener('keydown', onUploadOverlayEscPress);
};

// добавление обработчика открытия окна редактирования фото на форму загрузки нового фото
uploadFileInput.addEventListener('change', onUploadFileInputChange);

// добавление обработчика закрытия окна редактирования фото на крестик окна редактирования
imgUploadCancel.addEventListener('click', onImgUploadCancelClick);

// ---------------------- ЭФФЕКТЫ

// добавляем эффекты на загруженное фото
var imgUploadPreview = imgUploadOverlay.querySelector('.img-upload__preview');
var effectsRadioElements = imgUploadOverlay.querySelectorAll('.effects__radio');
var scaleLine = imgUploadScale.querySelector('.scale__line'); // находим блок слайдера
var scaleValue = imgUploadScale.querySelector('.scale__value'); // находим блок, который принимает уровень насыщенности эффекта
var prevClass = 'effects__preview--none';
var scalePin = scaleLine.querySelector('.scale__pin'); // находим блок пина
var scaleLevel = scaleLine.querySelector('.scale__level');

var getFilterLevel = function () {
  return parseInt(scaleValue.value, 10);
};

var setFilterLevel = function (number) {
  scaleValue.value = number;
  scalePin.style.left = number + '%';
  scaleLevel.style.width = number + '%';
};

var setImgClass = function (img, level, selected) {
  var effectFilter;

  switch (selected) {
    case 'chrome':
      effectFilter = 'grayscale(' + (level / 100) + ')';
      break;

    case 'sepia':
      effectFilter = 'sepia(' + (level / 100) + ')';
      break;

    case 'marvin':
      effectFilter = 'invert(' + level + ')';
      break;

    case 'phobos':
      effectFilter = 'blur(' + (3 * level / 100) + 'px)';
      break;

    case 'heat':
      effectFilter = 'brightness(' + (level) + '%)';
      break;
  }
  img.style.filter = effectFilter;
};

// ф-ция, которая добавляет класс картинке в зависимости от выбранного фильтра
var applyImageFilter = function (selected) {
  var newClass = 'effects__preview--' + selected;

  // добавляем картинке новый класс
  imgUploadPreview.classList.add(newClass);
  imgUploadPreview.classList.remove(prevClass);

  setImgClass(imgUploadPreview, getFilterLevel(), selected);

  prevClass = newClass;
};

// обработчик, добавляющий эффекты (добавлением соответствующего класса картинке)
var onEffectRadioElementClick = function (evt) {
  applyImageFilter(evt.target.value);
  if (imgUploadPreview.classList.contains('effects__preview--none')) {
    imgUploadScale.classList.add('hidden');
  } else {
    imgUploadScale.classList.remove('hidden');
  }
};

// циклом вешаем обработчики на все элементы
[].forEach.call(effectsRadioElements, function (filter) {
  filter.addEventListener('click', onEffectRadioElementClick);
});

// -------------------------------- Работаем с масштабом загруженного фото
var resizeMinusButton = imgUploadOverlay.querySelector('.resize__control--minus');
var resizePlusButton = imgUploadOverlay.querySelector('.resize__control--plus');
var resizeControlValueInput = imgUploadOverlay.querySelector('.resize__control--value');

var Resize = {
  STEP: 25,
  MAX: 100,
  MIN: 25
};

var imageResize = function (resizeValue) {
  imgUploadPreview.style = 'transform: scale(' + (resizeValue / 100) + ')';
};

var printResizeValue = function (number) {
  resizeControlValueInput.value = number + '%';
  imageResize(number);
};

var onResizePlusButtonClick = function () {
  var resizeValue = parseInt(resizeControlValueInput.value, 10) + Resize.STEP;
  resizeValue = (resizeValue > Resize.MAX) ? Resize.MAX : resizeValue;

  printResizeValue(resizeValue);
};

var onResizeMinusButtonClick = function () {
  var resizeValue = parseInt(resizeControlValueInput.value, 10) - Resize.STEP;
  resizeValue = (resizeValue < Resize.MIN) ? Resize.MIN : resizeValue;

  printResizeValue(resizeValue);
};

resizeMinusButton.addEventListener('click', onResizeMinusButtonClick);
resizePlusButton.addEventListener('click', onResizePlusButtonClick);

// ------------------------------------------------ Работаем с ползунком -- для начала вводим все нужные переменные

// вешаем обработчик отпаускания мыши на пин слайдреа
scalePin.addEventListener('mouseup', function () {
  var scaleLineWidth = scaleLine.offsetWidth; // находим ширину блока слайдера
  // высчитываем уровень насыщенности через пропорцию
  var scalePinLevel = Math.round(scalePin.offsetLeft * 100 / scaleLineWidth);
  setFilterLevel(scalePinLevel);
  // обновляем фильтр большой картинки
  var selectedFilter = imgUploadOverlay.querySelector('input[name=effect]:checked');
  applyImageFilter(selectedFilter.value);
  setImgClass(imgUploadPreview, scalePinLevel, selectedFilter.value);
});

setFilterLevel(100);

// --------------------------------------------
// Валидация - работа с хештегами
var TAG_MAX_LENGTH = 20;
var TAG_MIN_LENGTH = 2;
var TAGS_MAX_QUANTITY = 5;

hashtagInput.addEventListener('input', function () {
  var hashtagsString = hashtagInput.value.trim();
  var hashtags = hashtagsString.split(' ');
  var correct = true;

  if (hashtags.length > 0) {
    for (i = 0; i < hashtags.length; i++) {
      if (hashtags[i].length > TAG_MAX_LENGTH) {
        hashtagInput.setCustomValidity('Длина хэш-тега не должна превышать двадцати символов, включая знак "#"');
        correct = false;
      }
      if (hashtags[i].length < TAG_MIN_LENGTH) {
        hashtagInput.setCustomValidity('Пожалуйста, введите текст хэш-тега');
        correct = false;
      }
      if (hashtags[i] === '#') {
        hashtagInput.setCustomValidity('Хэш-тег должен начинаться с символа "#"');
        correct = false;
      }
      if (hashtags.length > TAGS_MAX_QUANTITY) {
        hashtagInput.setCustomValidity('Пожалуйста, сократите количество хэш-тегов: нельзя использовать больше пяти');
        correct = false;
      }
      // создаем новый массив и добавляем в него повторяющеся элементы из исходного массива хэш-тегов -
      // - на каждой итерации в новый массив записыватся повторения одного и того же хештега
      var newArr = [];
      hashtags.forEach(function (item) {
        if (item === hashtags[i]) {
          newArr.push(item);
        }
      });
      if (newArr.length > 1) {
        hashtagInput.setCustomValidity('Хеш-тэги не должны повторяться');
        correct = false;
      }
      if (correct) {
        hashtagInput.setCustomValidity('');
      }
    }
  }
});

// ----------------------------------------------------- Движение пина
/*
scalePin.addEventListener('mousedown', function (evt) {

  // получаем стартовые координаты курсора
  var startCoords = {
    x: evt.clientX
  };

  var onMouseMove = function (moveEvt) {
    // вычисляем расстояние, на которое сместился курсор мыши
    var shift = {
      x: startCoords.x - moveEvt.clientX
    };
    // переписываем 'точку отсчета' - она каждый раз меняется
    startCoords = {
      x: moveEvt.clientX
    };
    // в координаты пина записываем новые координаты
    var scaleLineWidth = scaleLine.offsetWidth;
    var calculatedLeft = scalePin.offsetLeft - shift.x;
    calculatedLeft = (calculatedLeft > scaleLineWidth) ? scaleLineWidth : calculatedLeft;
    calculatedLeft = (calculatedLeft < 0) ? 0 : calculatedLeft;

    scalePin.style.left = calculatedLeft + 'px';

    var scalePinLevel = Math.round(scalePin.offsetLeft * 100 / scaleLineWidth);
    setFilterLevel(scalePinLevel);

    var selectedFilter = imgUploadOverlay.querySelector('input[name=effect]:checked');
    applyImageFilter(selectedFilter.value);
    setImgClass(imgUploadPreview, scalePinLevel, selectedFilter.value);
  };

  var onMouseUp = function () {

    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
});
*/
