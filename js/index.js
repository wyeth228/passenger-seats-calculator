var AIRCRAFTS_JSON_SRC = "./data/aircrafts.json";

var appRoot = document.getElementById("app");

var main = function (
  utils,
  statesManager,
  fileLoadState,
  aircraftRegistrationState,
  cabinState
) {
  var statesManagerDependencies = {
    appRoot: appRoot,
    loadFile: utils.loadFile,
  };

  statesManager.init(
    [
      {
        name: "file_load",
        data: { passengersInformationFileContent: undefined },
        htmlTemplateSrc: "./html_templates/file_load.html",
        onInit: function () {
          var dependecies = {
            appRoot: appRoot,
            saveStateData: statesManager.saveStateData,
            getFileContentFromEvent: utils.getFileContentFromEvent,
            loadState: statesManager.loadState,
          };

          fileLoadState.onInit(dependecies);
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
        onInit: function () {
          var dependencies = {
            appRoot: appRoot,
            saveStateData: statesManager.saveStateData,
            loadState: statesManager.loadState,
            getDataFromState: statesManager.getDataFromState,
          };

          aircraftRegistrationState.onInit(dependencies);
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
        onInit: function () {
          var dependencies = {
            appRoot: appRoot,
            loadJSON: utils.loadJSON,
            saveStateData: statesManager.saveStateData,
            loadState: statesManager.loadState,
            getDataFromState: statesManager.getDataFromState,
            appendChildren: utils.appendChildren,
            createElement: utils.createElement,
          };

          cabinState.onInit(dependencies);
        },
      },
    ],
    statesManagerDependencies
  );

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
