define(function () {
  var states = [];
  var statesDataCopies = [];
  var currentStateIndex = -1;

  var dependencies = {
    appRoot: undefined,
    loadFile: undefined,
    searchIn: undefined,
    copy: undefined,
  };

  function initTemplate(htmlTemplateSrc, callback) {
    dependencies.loadFile(htmlTemplateSrc, function (template) {
      dependencies.appRoot.innerHTML = template;

      callback();
    });
  }

  function resetDataOfState(index) {
    states[index].data = dependencies.copy(statesDataCopies[index]);
  }

  function loadState(name) {
    if (currentStateIndex >= 0) {
      states[currentStateIndex].onDestroy();
    }

    var stateSearchResult = dependencies.searchIn(states, function (state) {
      return state.name === name;
    });

    resetDataOfState(stateSearchResult.index);

    currentStateIndex = stateSearchResult.index;

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
      statesDataCopies[i] = dependencies.copy(states[i].data);
    }
  }

  function init(newStates, stateManagerDependencies) {
    states = newStates;

    dependencies = stateManagerDependencies;

    saveStatesDataCopies();
  }

  return {
    loadState,
    saveStateData,
    getDataFromState,
    init,
  };
});
