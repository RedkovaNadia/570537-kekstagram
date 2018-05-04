'use strict';

(function () {
  // ---------------------------------------------------------------------------------------------------
  // form.js — модуль, который работает с формой редактирования изображения
  var picturesBlock = document.querySelector('.pictures');
  var imgUploadForm = picturesBlock.querySelector('.img-upload__form');
  var uploadFileInput = imgUploadForm.querySelector('#upload-file'); // форма
  var imgUploadOverlay = imgUploadForm.querySelector('.img-upload__overlay');
  var imgUploadCancel = imgUploadOverlay.querySelector('.img-upload__cancel');
  var hashtagInput = imgUploadOverlay.querySelector('.text__hashtags');
  var descriptionTextarea = imgUploadOverlay.querySelector('.text__description');
  var imgUploadScale = imgUploadForm.querySelector('.img-upload__scale');
  var messageError = imgUploadForm.querySelector('.img-upload__message--error');

  var imgUploadPreview = imgUploadOverlay.querySelector('.img-upload__preview'); // фото
  var effectsRadioElements = imgUploadOverlay.querySelectorAll('.effects__radio');
  var scaleLine = imgUploadScale.querySelector('.scale__line'); // находим блок слайдера
  var scaleValue = imgUploadScale.querySelector('.scale__value'); // находим блок, который принимает уровень насыщенности эффекта
  var scalePin = scaleLine.querySelector('.scale__pin'); // находим блок пина
  var scaleLevel = scaleLine.querySelector('.scale__level'); // линия уровня (тянется за ползунком)
  var prevClass = 'effects__preview--none';

  // ф-ция-обработчик, которая закрывает окно редактирования по нажатию на esc
  // (и не закрывает, если инпут ввода хэш-тега или комментария в фокусе)
  var onUploadOverlayEscPress = function (evt) {
    if (hashtagInput === evt.target || descriptionTextarea === evt.target) {
      evt.stopPropagation();
    } else {
      window.util.isEscEvent(evt, onImgUploadCancelClick);
    }
  };

  var cleanImageFilters = function () {
    imgUploadForm.reset();

    applyImageFilter('effects__preview--none');
    imageResize(100);
  };

  // ф-ция открывает окно редактирования загруженного фото и добавляет обработчик закрытия окна настройки по нажатия esc на документе
  var onUploadFileInputChange = function () {
    imgUploadOverlay.classList.remove('hidden');
    document.addEventListener('keydown', onUploadOverlayEscPress);
    imgUploadScale.classList.add('hidden');
  };

    // ф-ция закрывает окно редактирования загруженного фото и удаляет обработчик закрытия окна настройки по нажатия esc на документе
  var onImgUploadCancelClick = function () {
    cleanImageFilters();
    imgUploadOverlay.classList.add('hidden');
    // сбрасываем значение инпута загрузки, чтобы было возможно загружать одно фото повторно
    uploadFileInput.value = null;
    document.removeEventListener('keydown', onUploadOverlayEscPress);
  };

    // добавление обработчика открытия окна редактирования фото на форму загрузки нового фото
  uploadFileInput.addEventListener('change', onUploadFileInputChange);

  // добавление обработчика закрытия окна редактирования фото на крестик окна редактирования
  imgUploadCancel.addEventListener('click', onImgUploadCancelClick);

  // ДОПОЛНИТЕЛЬНОЕ ЗАДАНИЕ ----- работаем с загрузкой фото

  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  uploadFileInput.addEventListener('change', function () {
    var file = uploadFileInput.files[0];
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        imgUploadPreview.querySelector('img').src = reader.result;
      });

      reader.readAsDataURL(file);
    }
  });

  // ---------------------------------------------------------------------------------------------------
  // ---------------------- ЭФФЕКТЫ
  // добавляем эффекты на загруженное фото

  // принимает уровень эффекта - берет его из поля
  var getFilterLevel = function () {
    return parseInt(scaleValue.value, 10);
  };

  // задает полю число, задает пину смещение, задает длину слайдера (линии)
  var setScaleLevelWidth = function (number) {
    scaleValue.value = number;
    scalePin.style.left = number + '%';
    scaleLevel.style.width = number + '%';
  };

    // задает ффильтр картинке в стилях - принимает на вход блок картинки, уровень насыщенности, выбранную радиокнопку
  var setImgFilter = function (img, level, selected) {
    var effectFilter;

    switch (selected) {
      case 'chrome':
        effectFilter = 'grayscale(' + (level / 100) + ')';
        break;

      case 'sepia':
        effectFilter = 'sepia(' + (level / 100) + ')';
        break;

      case 'marvin':
        effectFilter = 'invert(' + level + '%)';
        break;

      case 'phobos':
        effectFilter = 'blur(' + (3 * level / 100) + 'px)';
        break;

      case 'heat':
        var levelEffect = (3 * level / 100) || 1;
        effectFilter = 'brightness(' + levelEffect + ')';
        break;
        // фрагмент кода выполняется при отсутствии
        // совпадений со значениями представленных вариантов
      default:
        effectFilter = 'none';
        break;
    }
    img.style.filter = effectFilter;
  };

  // ф-ция, которая добавляет класс картинке в зависимости от выбранного эффекта
  var applyImageFilter = function (selected) {
    // определяем новый класс в зависимости от выбранной радиокнопки эффекта
    var newClass = 'effects__preview--' + selected;

    // добавляем картинке новый класс - удаляем предыдущий
    imgUploadPreview.classList.add(newClass);
    imgUploadPreview.classList.remove(prevClass);
    // вызываем ф-цию, задающей фильтр картинке в стилях
    setImgFilter(imgUploadPreview, getFilterLevel(), selected);

    prevClass = newClass;
  };

    // обработчик, добавляющий эффекты (добавлением соответствующего класса картинке)
  var onEffectRadioElementClick = function (evt) {
    // нижняя строка нужна при обработчике события ДВИЖЕНИЯ мыши
    setScaleLevelWidth(100);
    // добавляет картинке фильтр в зависимости от выбранной радиокнопки
    applyImageFilter(evt.target.value);
    if (imgUploadPreview.classList.contains('effects__preview--none')) {
      imgUploadScale.classList.add('hidden');
    } else {
      imgUploadScale.classList.remove('hidden');
    }
  };

  [].forEach.call(effectsRadioElements, function (filter) {
    filter.addEventListener('click', onEffectRadioElementClick);
  });
  // ---------------------------------------------------------------------------------------------------
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

  // ---------------------------------------------------------------------------------------------------
  // Движение пина

  var setImgFilerLevel = function (level) {
    var selectedFilter = imgUploadOverlay.querySelector('input[name=effect]:checked');
    applyImageFilter(selectedFilter.value);
    setImgFilter(imgUploadPreview, level, selectedFilter.value);
  };

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
      // задаем положение пина (нужны только x-координаты)
      scalePin.style.left = calculatedLeft + 'px';
      // вычисляем уровень насыщенности эффекта
      var scalePinLevel = Math.round(scalePin.offsetLeft * 100 / scaleLineWidth);
      setScaleLevelWidth(scalePinLevel);
      setImgFilerLevel(scalePinLevel);
    };

    var onMouseUp = function () {
      setImgFilerLevel(getFilterLevel());

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  // ---------------------------------------------------------------------------------------------------
  // Валидация - работа с хештегами
  var TAG_MAX_LENGTH = 20;
  var TAG_MIN_LENGTH = 2;
  var TAGS_MAX_QUANTITY = 5;

  var validateHashTags = function (hashtags) {
    for (var i = 0; i < hashtags.length; i++) {
      if (hashtags[i].length > TAG_MAX_LENGTH) {
        hashtagInput.setCustomValidity('Длина хэш-тега не должна превышать двадцати символов, включая знак "#"');
        return false;
      }
      if (hashtags[i].length < TAG_MIN_LENGTH) {
        hashtagInput.setCustomValidity('Пожалуйста, введите текст хэш-тега');
        return false;
      }
      if (hashtags[i] === '#') {
        hashtagInput.setCustomValidity('Хэш-тег должен начинаться с символа "#"');
        return false;
      }
      if (hashtags.length > TAGS_MAX_QUANTITY) {
        hashtagInput.setCustomValidity('Пожалуйста, сократите количество хэш-тегов: нельзя использовать больше пяти');
        return false;
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
        return false;
      }
    }
    return true;
  };

  hashtagInput.addEventListener('input', function () {
    var hashtagsString = hashtagInput.value.trim();
    var hashtags = hashtagsString.split(' ');

    // вынести валидацию в отдельную функцию,
    // убрать бы correct а вместо него расставить return,
    // чтобы не было лишних проверок
    if (hashtags.length > 0) {

      if (validateHashTags(hashtags)) {
        hashtagInput.setCustomValidity('');
      }
    }
  });
  // ------------------------------------------------работаем с отправкой данных

  var onUploadError = function () {
    messageError.classList.remove('hidden');
  };

  imgUploadForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    window.backend.uploadData(function () {
      imgUploadOverlay.classList.add('hidden');
      cleanImageFilters();
    }, onUploadError, new FormData(imgUploadForm));
  });
})();

