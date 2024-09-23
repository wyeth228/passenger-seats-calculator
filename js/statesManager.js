define((function () {
  var states = [];

  var dependencies = {
    appRoot: undefined,
    loadFile: undefined,
  };

  function initTemplate(htmlTemplateSrc, callback) {
    dependencies.loadFile(htmlTemplateSrc, function (template) {
      dependencies.appRoot.innerHTML = template;

      callback();
    });
  }

  function loadState(name) {
    var state = states.find(function (state) {
      return state.name === name;
    });

    initTemplate(state.htmlTemplateSrc, state.onInit);
  }

  function saveStateData(name, key, data) {
    var state = states.find(function (state) {
      return state.name === name;
    });

    state.data[key] = data;
  }

  function getDataFromState(name) {
    var state = states.find(function (state) {
      return state.name === name;
    });

    return state.data;
  }

  function init(newStates, stateManagerDependencies) {
    states = newStates;

    dependencies = stateManagerDependencies;
  }

  return {
    loadState,
    saveStateData,
    getDataFromState,
    init,
  };
})());
