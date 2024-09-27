define(function () {
  var states = [];
  var statesDataCopies = [];
  var currentState = -1;

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
    var previousStateIndex = currentState;

    if (previousStateIndex >= 0) {
      states[previousStateIndex].onDestroy();
    }

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

  function saveStatesDataCopies() {
    for (var i = 0; i < states.length; ++i) {
      statesDataCopies[i] = states[i].data;
    }
  }

  function init(newStates, stateManagerDependencies) {
    states = newStates;

    saveStatesDataCopies();

    dependencies = stateManagerDependencies;
  }

  return {
    loadState,
    saveStateData,
    getDataFromState,
    init,
  };
});
