define(function () {
  return {
    loadFile: function (src, callback) {
      var request = new XMLHttpRequest();
      request.overrideMimeType("text/plain");
      request.open("GET", src, true);
      request.onload = function () {
        callback(request.responseText);
      };

      request.send(null);
    },

    loadJSON: function (src, callback) {
      var request = new XMLHttpRequest();
      request.overrideMimeType("application/json");
      request.open("GET", src, true);
      request.onload = function () {
        callback(JSON.parse(request.responseText));
      };

      request.send(null);
    },

    innerHTML: function (element, text) {
      element.innerHTML = text;
    },

    appendChildren: function (element, children) {
      for (var i = 0; i < children.length; ++i) {
        element.appendChild(children[i]);
      }
    },

    createElement: function (type, classNames) {
      var element = document.createElement(type);

      if (classNames) {
        for (var i = 0; i < classNames.length; ++i) {
          var className = classNames[i];

          element.classList.add(className);
        }
      }

      return element;
    },

    getFileContentFromEvent: function (event, callback) {
      var fileReader = new FileReader();
      fileReader.readAsText(event.dataTransfer.files[0]);

      fileReader.onload = function () {
        callback(fileReader.result);
      };
    },

    contains: function (element1, element2) {
      if (element1.contains(element2)) {
        return true;
      }
    },

    searchIn: function (array, callback) {
      for (var i = 0; i < array.length; ++i) {
        if (callback(array[i])) {
          return {
            find: array[i],
            index: i,
          };
        }
      }

      return null;
    },

    copy: function (object) {
      return JSON.parse(JSON.stringify(object));
    },
  };
});
