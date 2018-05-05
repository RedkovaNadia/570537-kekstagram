'use strict';

(function () {
  var LOAD_URL = 'https://js.dump.academy/kekstagram/data';
  var UPLOAD_URL = 'https://js.dump.academy/kekstagram';
  var SUCCESS_STATUS_CODE = 200;
  var LOAD_ERROR_MESSAGE = 'Произошла ошибка соединения';
  var UPLOAD_ERROR_MESSAGE = 'Ошибка загрузки файла';

  var getServerConnection = function (onLoad, onError, method, message, url, data) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      if (xhr.status === SUCCESS_STATUS_CODE) {
        onLoad(xhr.response);
      } else {
        onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError(message);
    });

    xhr.open(method, url);
    xhr.send(data);
  };

  var onConnectionError = function (errorMessage) {
    var node = document.createElement('div');
    node.style = 'z-index: 100; margin: 0 auto; text-align: center; background-color: red;';
    node.style.position = 'absolute';
    node.style.left = '0';
    node.style.right = '0';
    node.style.fontSize = '30px';

    node.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', node);
  };

  window.backend = {
    onConnectionError: onConnectionError,
    loadData: function (onLoad, onError) {
      getServerConnection(onLoad, onError, 'GET', LOAD_ERROR_MESSAGE, LOAD_URL);
    },
    uploadData: function (onLoad, onError, data) {
      getServerConnection(onLoad, onError, 'POST', UPLOAD_ERROR_MESSAGE, UPLOAD_URL, data);
    }
  };
})();
