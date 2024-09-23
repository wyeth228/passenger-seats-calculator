/**
 * polyfills
 */

/**
 * Object.entries()
 */
if (!Object.entries) {
  Object.entries = function (obj) {
    var ownProps = Object.keys(obj),
      i = ownProps.length,
      resArray = new Array(i);

    while (i--) resArray[i] = [ownProps[i], obj[ownProps[i]]];

    return resArray;
  };
}

/**
 * application
 */
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

  var aircraftRegistration = localStorage.getItem("aircraft_registration");
  var file = localStorage.getItem("file");

  if (file) {
    statesManager.saveStateData(
      "file_load",
      "passengersInformationFileContent",
      file
    );

    statesManager.saveStateData(
      "aircraft_registration",
      "aircraftRegistration",
      aircraftRegistration
    );

    statesManager.loadState("cabin");

    return;
  }

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
