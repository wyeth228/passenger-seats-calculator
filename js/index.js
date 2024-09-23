var AIRCRAFTS_JSON_SRC = "./data/aircrafts.json";

var appRoot = document.getElementById("app");

var main = function (
  utils,
  statesManager,
  fileLoadState,
  aircraftRegistrationState,
  cabinState
) {
  statesManager.init([
    {
      name: "file_load",
      data: { passengersInformationFileContent: undefined },
      htmlTemplateSrc: "./html_templates/file_load.html",
      onInit: function (state) {
        var dependecies = {
          appRoot: appRoot,
          loadFile: utils.loadFile,
          saveStateData: statesManager.saveStateData,
          getFileContentFromEvent: utils.getFileContentFromEvent,
          loadState: statesManager.loadState,
        };

        fileLoadState.onInit(state, dependecies);
      },
    },
    {
      name: "aircraft_registration",
      data: {
        options: [
          { value: "UP-CJ004" },
          { value: "UP-CJ005" },
          { value: "UP-CJ015" },
        ],
        aircraftRegistration: undefined,
      },
      htmlTemplateSrc: "./html_templates/aircraft_registration.html",
      onInit: function (state) {
        var dependencies = {
          appRoot: appRoot,
          loadFile: utils.loadFile,
          saveStateData: statesManager.saveStateData,
          loadState: statesManager.loadState,
          getDataFromState: statesManager.getDataFromState,
        };

        aircraftRegistrationState.onInit(state, dependencies);
      },
    },
    {
      name: "cabin",
      data: {
        aircrafts: undefined,
        passengers: [],
        renderedRowsQuantity: 0,
      },
      htmlTemplateSrc: "./html_templates/cabin.html",
      onInit: function (state) {
        var dependencies = {
          appRoot: appRoot,
          loadFile: utils.loadFile,
          loadJSON: utils.loadJSON,
          saveStateData: statesManager.saveStateData,
          loadState: statesManager.loadState,
          getDataFromState: statesManager.getDataFromState,
          appendChildren: utils.appendChildren,
          createElement: utils.createElement,
        };

        cabinState.onInit(state, dependencies);
      },
    },
  ]);

  statesManager.loadState("file_load");
};

requirejs(
  [
    "utils",
    "statesManager",
    "fileLoadState",
    "aircraftRegistrationState",
    "cabinState",
  ],
  main
);
