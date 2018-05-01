'use strict';

(function () {
  var SUCCESS_STATUS_CODE = 200;

  window.backend = {
    LOAD_URL: 'https://js.dump.academy/kekstagram/data',
    UPLOAD_URL: 'https://js.dump.academy/kekstagram',
    getServerConnection: function (data, onLoad, onError, method, url) {
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
        onError('Произошла ошибка соединения');
      });

      xhr.open(method, url);
      xhr.send(data);
    }
  };

  // СТАРЫЙ КОД МОДУЛЯ
  /*
  // ф-ция загрузки данных
  var loadData = function (onLoad, onError) {
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
      onError('Произошла ошибка соединения');
    });

    xhr.open('GET', LOAD_URL);
    xhr.send();
  };

  // ф-ция отправки данных
  var uploadData = function (data, onLoad, onError) {
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
      onError('Произошла ошибка соединения');
    });

    xhr.open('POST', UPLOAD_URL);
    xhr.send(data);
  };

  // экспортируем ф-ции
  window.backend = {
    loadData: loadData,
    uploadData: uploadData
  };
  */
})();
