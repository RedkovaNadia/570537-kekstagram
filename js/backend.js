'use strict';

(function () {
  var SUCCESS_STATUS_CODE = 200;
  var LOAD_URL = 'https://js.dump.academy/kekstagram/data';
  var UPLOAD_URL = 'https://js.dump.academy/kekstaram';

  var getServerConnection = function (onLoad, onError, method, url, data) {
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
  };

  window.backend = {
    loadData: function (onLoad, onError) {
      getServerConnection(onLoad, onError, 'GET', LOAD_URL);
    },
    uploadData: function (onLoad, onError, data) {
      getServerConnection(onLoad, onError, 'POST', UPLOAD_URL, data);
    }
  };
})();
