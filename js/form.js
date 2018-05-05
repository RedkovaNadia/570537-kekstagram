'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var TAG_MAX_LENGTH = 20;
  var TAG_MIN_LENGTH = 2;
  var TAGS_MAX_QUANTITY = 5;

  var imgUploadForm = window.gallery.picturesBlock.querySelector('.img-upload__form');
  var uploadFileInput = imgUploadForm.querySelector('#upload-file');
  var imgUploadOverlay = imgUploadForm.querySelector('.img-upload__overlay');
  var imgUploadCancel = imgUploadOverlay.querySelector('.img-upload__cancel');
  var hashTagInput = imgUploadOverlay.querySelector('.text__hashtags');
  var descriptionTextarea = imgUploadOverlay.querySelector('.text__description');
  var imgUploadScale = imgUploadForm.querySelector('.img-upload__scale');

  var resizeMinusButton = imgUploadOverlay.querySelector('.resize__control--minus');
  var resizePlusButton = imgUploadOverlay.querySelector('.resize__control--plus');
  var resizeControlValueInput = imgUploadOverlay.querySelector('.resize__control--value');

  var imgUploadPreview = imgUploadOverlay.querySelector('.img-upload__preview');
  var effectsRadioElements = imgUploadOverlay.querySelectorAll('.effects__radio');
  var scaleLine = imgUploadScale.querySelector('.scale__line');
  var scaleValue = imgUploadScale.querySelector('.scale__value');
  var scalePin = scaleLine.querySelector('.scale__pin');
  var scaleLevel = scaleLine.querySelector('.scale__level');
  var prevClass = 'effects__preview--none';

  var cleanImageEditingWindow = function () {
    imgUploadForm.reset();

    applyImageFilter('effects__preview--none');
    resizeImage(100);
  };

  var onUploadOverlayEscPress = function (evt) {
    if (hashTagInput === evt.target || descriptionTextarea === evt.target) {
      evt.stopPropagation();
    } else {
      window.util.isEscEvent(evt, onImgUploadCancelClick);
    }
  };

  var onUploadFileInputChange = function () {
    imgUploadOverlay.classList.remove('hidden');
    document.addEventListener('keydown', onUploadOverlayEscPress);
    imgUploadScale.classList.add('hidden');
  };

  var onImgUploadCancelClick = function () {
    cleanImageEditingWindow();
    imgUploadOverlay.classList.add('hidden');

    uploadFileInput.value = null;
    document.removeEventListener('keydown', onUploadOverlayEscPress);
  };

  uploadFileInput.addEventListener('change', onUploadFileInputChange);

  imgUploadCancel.addEventListener('click', onImgUploadCancelClick);

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

  var getFilterLevel = function () {
    return parseInt(scaleValue.value, 10);
  };

  // задает полю число, задает пину смещение, задает длину слайдера (линии)
  var setScaleLevelWidth = function (number) {
    scaleValue.value = number;
    scalePin.style.left = number + '%';
    scaleLevel.style.width = number + '%';
  };

  var setImageFilter = function (img, level, selected) {
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

      default:
        effectFilter = 'none';
        break;
    }
    img.style.filter = effectFilter;
  };

  var applyImageFilter = function (selected) {
    var newClass = 'effects__preview--' + selected;

    imgUploadPreview.classList.add(newClass);
    imgUploadPreview.classList.remove(prevClass);

    setImageFilter(imgUploadPreview, getFilterLevel(), selected);

    prevClass = newClass;
  };

  var onEffectRadioElementClick = function (evt) {
    setScaleLevelWidth(100);

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

  var Resize = {
    STEP: 25,
    MAX: 100,
    MIN: 25
  };

  var resizeImage = function (resizeValue) {
    imgUploadPreview.style = 'transform: scale(' + (resizeValue / 100) + ')';
  };

  var printResizeValue = function (number) {
    resizeControlValueInput.value = number + '%';
    resizeImage(number);
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

  var setImageFilerLevel = function (level) {
    var selectedFilter = imgUploadOverlay.querySelector('input[name=effect]:checked');
    applyImageFilter(selectedFilter.value);
    setImageFilter(imgUploadPreview, level, selectedFilter.value);
  };

  scalePin.addEventListener('mousedown', function (evt) {

    var startCoords = {
      x: evt.clientX
    };

    var onMouseMove = function (moveEvt) {
      var shift = {
        x: startCoords.x - moveEvt.clientX
      };

      startCoords = {
        x: moveEvt.clientX
      };

      var scaleLineWidth = scaleLine.offsetWidth;
      var calculatedLeft = scalePin.offsetLeft - shift.x;
      calculatedLeft = (calculatedLeft > scaleLineWidth) ? scaleLineWidth : calculatedLeft;
      calculatedLeft = (calculatedLeft < 0) ? 0 : calculatedLeft;
      scalePin.style.left = calculatedLeft + 'px';

      var scalePinLevel = Math.round(scalePin.offsetLeft * 100 / scaleLineWidth);
      setScaleLevelWidth(scalePinLevel);
      setImageFilerLevel(scalePinLevel);
    };

    var onMouseUp = function () {
      setImageFilerLevel(getFilterLevel());

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  var validateHashTags = function (hashTags) {
    for (var i = 0; i < hashTags.length; i++) {
      if (hashTags[i].length > TAG_MAX_LENGTH) {
        hashTagInput.setCustomValidity('Длина хэш-тега не должна превышать двадцати символов, включая знак "#"');
        return false;
      }
      if (hashTags[i].charAt(0) !== '#') {
        hashTagInput.setCustomValidity('Хэш-тег должен начинаться с символа "#"');
        return false;
      }
      if (hashTags[i].length < TAG_MIN_LENGTH) {
        hashTagInput.setCustomValidity('Пожалуйста, введите текст хэш-тега');
        return false;
      }
      if (hashTags.length > TAGS_MAX_QUANTITY) {
        hashTagInput.setCustomValidity('Пожалуйста, сократите количество хэш-тегов: нельзя использовать больше пяти');
        return false;
      }

      var newArr = [];
      hashTags.forEach(function (item) {
        if (item.toLowerCase() === hashTags[i].toLowerCase()) {
          newArr.push(item);
        }
      });
      if (newArr.length > 1) {
        hashTagInput.setCustomValidity('Хеш-тэги не должны повторяться');
        return false;
      }
    }
    return true;
  };

  hashTagInput.addEventListener('input', function () {
    var hashtagsString = hashTagInput.value.trim();
    var hashTags = hashtagsString.split(' ');

    if (hashTags.length > 0) {

      if (validateHashTags(hashTags)) {
        hashTagInput.setCustomValidity('');
      }
    }
  });

  imgUploadForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    window.backend.uploadData(function () {
      imgUploadOverlay.classList.add('hidden');
      cleanImageEditingWindow();
    }, window.backend.onConnectionError, new FormData(imgUploadForm));
  });
})();

