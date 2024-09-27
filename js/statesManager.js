define(function () {
  var states = [];
  var currentState = 0;

  var dependencies = {
    appRoot: undefined,
    loadFile: undefined,
    searchIn: undefined,
  };

  function initTemplate(htmlTemplateSrc, callback) {
    dependencies.loadFile(htmlTemplateSrc, function (template) {
      dependencies.appRoot.innerHTML = template;

      callback();
    });
  }

  function loadState(name) {
    var stateSearchResult = dependencies.searchIn(states, function (state) {
      return state.name === name;
    });

    currentState = stateSearchResult.index;

    initTemplate(
      stateSearchResult.find.htmlTemplateSrc,
      stateSearchResult.find.onInit
    );
  }

  function saveStateData(name, key, data) {
    var stateSearchResult = dependencies.searchIn(states, function (state) {
      return state.name === name;
    });

    stateSearchResult.find.data[key] = data;
  }

  function getDataFromState(name) {
    var stateSearchResult = dependencies.searchIn(states, function (state) {
      return state.name === name;
    });

    return stateSearchResult.find.data;
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
});
