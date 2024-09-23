define((function () {
  var states = [];

  function loadState(name) {
    var state = states.find(function (state) {
      return state.name === name;
    });

    state.onInit(state);
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

  function init(newStates) {
    states = newStates;
  }

  return {
    loadState,
    saveStateData,
    getDataFromState,
    init,
  };
})());
