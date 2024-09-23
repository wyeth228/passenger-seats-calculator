define(function () {
  return {
    loadFile: function (src, callback) {
      fetch(src).then(function (response) {
        response.text().then(callback);
      });
    },

    loadJSON: function (src, callback) {
      fetch(src).then(function (response) {
        response.json().then(callback);
      });
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
  };
});
