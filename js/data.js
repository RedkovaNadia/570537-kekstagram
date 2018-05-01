'use strict';
(function () {
  var NUMBER_OF_PHOTOS = 25;
  var COMMENTS = ['Всё отлично!', 'В целом всё неплохо. Но не всё.', 'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
    'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.', 'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.', 'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'];
  var DESCRIPTIONS = ['Тестим новую камеру!', 'Затусили с друзьями на море', 'Как же круто тут кормят', 'Отдыхаем...', 'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......', 'Вот это тачка!'];
  // создаю объект фотографии
  var getPhotoObject = function (index) {
    var commentsArrayShuffleCopy = window.util.shuffleArray(COMMENTS);
    commentsArrayShuffleCopy.splice(1, COMMENTS.length);
    return {
      'url': 'photos/' + (index + 1) + '.jpg',
      'likes': Math.round(window.util.getRandomNumber(15, 200)),
      'comments': commentsArrayShuffleCopy,
      'description': DESCRIPTIONS[window.util.getRandomIndex(DESCRIPTIONS)]
    };
  };
  // генерирую массив из 25 объектов-фотографий
  var getObjectsArray = function () {
    var array = [];
    for (var i = 0; i < NUMBER_OF_PHOTOS; i++) {
      array.push(getPhotoObject(i));
    }
    return array;
  };

  window.data = {
    photos: getObjectsArray()
  };
})();

