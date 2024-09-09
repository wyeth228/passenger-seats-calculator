var AIRCRAFTS_JSON_SRC = "./data/aircrafts.json";

var appRoot = document.getElementById("app");

function loadFile(src, callback) {
  fetch(src).then(function (response) {
    response.text().then(callback);
  });
}

function loadJSON(src, callback) {
  fetch(src).then(function (response) {
    response.json().then(callback);
  });
}

function innerHTML(element, text) {
  element.innerHTML = text;
}

function appendChildren(element, children) {
  for (var i = 0; i < children.length; ++i) {
    element.appendChild(children[i]);
  }
}

function elementValue(element, value) {
  element.value = value;
}

function element(type, classNames) {
  var element = document.createElement(type);

  if (classNames) {
    for (var i = 0; i < classNames.length; ++i) {
      var className = classNames[i];

      element.classList.add(className);
    }
  }

  return element;
}

var statesManager = {
  states: [
    {
      data: { passengersInformationFileContent: undefined },
      name: "file_load",
      htmlTemplateSrc: "./html_templates/file_load.html",
      callback: fileLoadInit,
    },
    {
      data: {
        options: [
          { value: "UP-CJ004" },
          { value: "UP-CJ005" },
          { value: "UP-CJ015" },
        ],
        aircraftRegistration: "UP-CJ004",
      },
      name: "aircraft_registration",
      htmlTemplateSrc: "./html_templates/aircraft_registration.html",
      callback: aircraftRegistrationInit,
    },
    {
      data: {
        aircrafts: undefined,
        passengers: [],
        renderedRowsQuantity: 0,
      },
      name: "cabin",
      htmlTemplateSrc: "./html_templates/cabin.html",
      callback: cabinInit,
    },
  ],
  loadState(name) {
    var state = this.states.find(function (state) {
      return state.name === name;
    });

    state.callback(state);
  },
  saveStateData(name, key, data) {
    var state = this.states.find(function (state) {
      return state.name === name;
    });

    state.data[key] = data;
  },
  getDataFromState(name) {
    var state = this.states.find(function (state) {
      return state.name === name;
    });

    return state.data;
  },
};

function isAdultPassenger(passenger) {
  return passenger.type === "ВЗ";
}

function adultPassengersQuantityInCertainZone(passengers, zoneName) {
  return passengers.reduce(function (quantity, passenger) {
    if (!passenger.zone) {
      return quantity;
    }

    if (isAdultPassenger(passenger) && passenger.zone === zoneName) {
      return quantity + 1;
    }

    return quantity;
  }, 0);
}

function isChildPassenger(passenger) {
  return passenger.type === "РБ";
}

function childPassengersQuantityInCertainZone(passengers, zoneName) {
  return passengers.reduce(function (quantity, passenger) {
    if (!passenger.zone) {
      return quantity;
    }

    if (isChildPassenger(passenger) && passenger.zone === zoneName) {
      return quantity + 1;
    }

    return quantity;
  }, 0);
}

function isInfantPassenger(passenger) {
  return passenger.type === "РМ";
}

function infantPassengersQuantity(passengers) {
  return passengers.reduce(function (quantity, passenger) {
    if (isInfantPassenger(passenger)) {
      return quantity + 1;
    }

    return quantity;
  }, 0);
}

function addRowToThePassengersTable(zoneName) {
  var row = element("tr");
  var zoneCell = element("td");
  var adultCell = element("td");
  var childCell = element("td");
  var infantCell = element("td");

  appendChildren(row, [zoneCell, adultCell, childCell, infantCell]);

  innerHTML(zoneCell, zoneName);
  innerHTML(
    adultCell,
    adultPassengersQuantityInCertainZone(
      statesManager.getDataFromState("cabin").passengers,
      zoneName
    )
  );
  innerHTML(
    childCell,
    childPassengersQuantityInCertainZone(
      statesManager.getDataFromState("cabin").passengers,
      zoneName
    )
  );
  innerHTML(infantCell, 0);

  appRoot.querySelector(".cabin__table-body").appendChild(row);
}

function getCurrentAircraft() {
  var aircrafts = statesManager.getDataFromState("cabin").aircrafts;
  var aircraftRegistration = statesManager.getDataFromState(
    "aircraft_registration"
  ).aircraftRegistration;

  return aircrafts[aircraftRegistration];
}

function getRowsQuantityOfZonesOnCurrentAircraft() {
  return Object.entries(getCurrentAircraft().rowsQuantityOfZones);
}

function getCellsQuantityOfRowsOnCurrentAircraft() {
  return Object.entries(getCurrentAircraft().cellsQuantityOfRows);
}

function renderPassengersTable() {
  for (var [zoneName] of getRowsQuantityOfZonesOnCurrentAircraft()) {
    addRowToThePassengersTable(zoneName);
  }
}

function fixPassengersRowNumbers(matchedPassengersInfo) {
  for (var i = 0; i < matchedPassengersInfo.length; ++i) {
    if (matchedPassengersInfo[i].match(/\d+[A-Z]/)) {
      matchedPassengersInfo[i] = matchedPassengersInfo[i].replace(/14/, 13);
    }
  }
}

function determineZoneOfPassenger(passengerRowNumber) {
  for (var [
    zoneName,
    zoneRowNumbers,
  ] of getRowsQuantityOfZonesOnCurrentAircraft()) {
    for (var rowNumber of zoneRowNumbers) {
      if (rowNumber == passengerRowNumber) {
        return zoneName;
      }
    }
  }
}

function serializePassengers(matchedPassengersInfo) {
  var passengers = [];

  for (var passengerInfo of matchedPassengersInfo) {
    if (passengerInfo.match(/РМ/g)) {
      passengers.push({
        type: "РМ",
        row: undefined,
        column: undefined,
        zone: undefined,
      });
    } else {
      var type = passengerInfo.match(/(ВЗ|РБ)(?=.)/g)[0];
      var row = passengerInfo.match(/\d+(?=[A-Z])/g)[0];
      var column = passengerInfo.match(/(?<=\d)[A-Z]/g)[0];

      passengers.push({
        type,
        row: Number(row),
        column,
        zone: determineZoneOfPassenger(row),
      });
    }
  }

  return passengers;
}

function adultPassengersQuantity(passengers) {
  return passengers.reduce(function (quantity, passenger) {
    if (isAdultPassenger(passenger)) {
      return quantity + 1;
    }

    return quantity;
  }, 0);
}

function childPassengersQuantity(passengers) {
  return passengers.reduce(function (quantity, passenger) {
    if (isChildPassenger(passenger)) {
      return quantity + 1;
    }

    return quantity;
  }, 0);
}

function renderAdditionalPassengersInformation() {
  appRoot.querySelector(".cabin__passengers-total").innerHTML =
    statesManager.getDataFromState("cabin").passengers.length;

  appRoot.querySelector(".cabin__adult-quantity").innerHTML =
    adultPassengersQuantity(statesManager.getDataFromState("cabin").passengers);

  appRoot.querySelector(".cabin__child-quantity").innerHTML =
    childPassengersQuantity(statesManager.getDataFromState("cabin").passengers);

  appRoot.querySelector(".cabin__infant-quantity").innerHTML =
    infantPassengersQuantity(
      statesManager.getDataFromState("cabin").passengers
    );
}

function renderCabinColumns() {
  var aircraft = getCurrentAircraft();

  for (var columnName of aircraft.columns) {
    var columnElement = element("div", ["cabin__column"]);
    innerHTML(columnElement, columnName);

    appRoot.querySelector(".cabin__columns").appendChild(columnElement);
  }
}

function isCellOcuppied(rowNumber, columnName) {
  return statesManager
    .getDataFromState("cabin")
    .passengers.find(function (passenger) {
      if (passenger.row === rowNumber && passenger.column === columnName) {
        return true;
      }
    });
}

function createCabinRow(rowNumber, columnNames, cellsQuantity) {
  var cabinRowElement = element("div", ["cabin__row"]);

  var cabinRowNumberElement = element("div", ["cabin__row-number"]);
  innerHTML(cabinRowNumberElement, rowNumber);

  cabinRowElement.appendChild(cabinRowNumberElement);

  for (var i = 0; i < cellsQuantity; ++i) {
    var currentColumnName = columnNames[i];

    if (isCellOcuppied(rowNumber, currentColumnName)) {
      var cabinCellElement = element("div", [
        "cabin__cell",
        "cabin__cell_ocuppied",
      ]);

      cabinRowElement.appendChild(cabinCellElement);
    } else {
      var cabinCellElement = element("div", ["cabin__cell"]);

      cabinRowElement.appendChild(cabinCellElement);
    }
  }

  return cabinRowElement;
}

function createCabinZone(
  zoneName,
  zoneRowsQuantity,
  cellsQuantityOfRows,
  columnNames
) {
  var zoneElement = element("div", ["cabin__zone"]);

  var zoneNameElement = element("div", ["cabin__zone-name"]);
  innerHTML(zoneNameElement, zoneName);

  zoneElement.appendChild(zoneNameElement);

  var zoneRowsWrapper = element("div", ["cabin__rows-wrapper"]);

  zoneElement.appendChild(zoneRowsWrapper);

  for (var i = 0; i < zoneRowsQuantity; ++i) {
    var renderedRowsQuantity =
      statesManager.getDataFromState("cabin").renderedRowsQuantity;
    statesManager.saveStateData(
      "cabin",
      "renderedRowsQuantity",
      renderedRowsQuantity + 1
    );

    zoneRowsWrapper.appendChild(
      createCabinRow(
        renderedRowsQuantity + 1,
        columnNames,
        cellsQuantityOfRows[renderedRowsQuantity + 1]
      )
    );
  }

  return zoneElement;
}

function getCellsQuantityOfZoneRows(zoneRowNumbers) {
  var cellsQuantityOfZoneRows = {};

  for (var row of zoneRowNumbers) {
    cellsQuantityOfZoneRows[row] =
      getCurrentAircraft().cellsQuantityOfRows[row];
  }

  return cellsQuantityOfZoneRows;
}

function renderCabinZones() {
  for (var [
    zoneName,
    zoneRowNumbers,
  ] of getRowsQuantityOfZonesOnCurrentAircraft()) {
    var cabinZoneElement = createCabinZone(
      zoneName,
      zoneRowNumbers.length,
      getCellsQuantityOfZoneRows(zoneRowNumbers),
      getCurrentAircraft().columns
    );

    appRoot.querySelector(".cabin__map-wrapper").appendChild(cabinZoneElement);
  }
}

function renderCabinMap() {
  renderCabinColumns();

  renderCabinZones();
}

function calculatePassengersInformation() {
  var fileContent =
    statesManager.getDataFromState(
      "file_load"
    ).passengersInformationFileContent;

  var matchedPassengersInfo = fileContent.match(
    /(?<=.)(ВЗ|РБ)(.+)(\d+[A-Z])(?=.)/gm
  );
  var matchedInfantsInfo = fileContent.match(/РМ/gm);

  matchedPassengersInfo = matchedPassengersInfo.concat(matchedInfantsInfo);

  fixPassengersRowNumbers(matchedPassengersInfo);

  statesManager.saveStateData(
    "cabin",
    "passengers",
    serializePassengers(matchedPassengersInfo)
  );

  renderPassengersTable();

  renderAdditionalPassengersInformation();

  renderCabinMap();
}

function onCabinTemplateLoad(template) {
  appRoot.innerHTML = template;

  loadJSON(AIRCRAFTS_JSON_SRC, function (json) {
    statesManager.saveStateData("cabin", "aircrafts", json);

    calculatePassengersInformation();
  });
}

function cabinInit(state) {
  loadFile(state.htmlTemplateSrc, onCabinTemplateLoad);
}

function onAircraftRegistrationTemplateLoad(template) {
  appRoot.innerHTML = template;

  var select = document.querySelector(".aircraft-registration__select");

  for (var optionData of statesManager.getDataFromState("aircraft_registration")
    .options) {
    var optionElement = element("option");
    elementValue(optionElement, optionData.value);
    innerHTML(optionElement, optionData.value);

    select.appendChild(optionElement);
  }

  select.addEventListener("change", function (event) {
    statesManager.saveStateData(
      "aircraft_registration",
      "aircraftRegistration",
      event.target.value
    );

    statesManager.loadState("cabin");
  });
}

function aircraftRegistrationInit(state) {
  loadFile(state.htmlTemplateSrc, onAircraftRegistrationTemplateLoad);
}

function getFileContentFromEvent(event, callback) {
  var fileReader = new FileReader();
  fileReader.readAsText(event.dataTransfer.files[0]);

  fileReader.onload = function () {
    callback(fileReader.result);
  };
}

function onFileLoadTemplateLoad(template) {
  appRoot.innerHTML = template;

  var dragZone = document.querySelector(".file-load__drag-zone");

  document.addEventListener("dragenter", function (event) {
    event.preventDefault();

    dragZone.classList.add("file-load__drag-zone_active");
  });

  document.addEventListener("dragover", function (event) {
    event.preventDefault();

    if (!dragZone.contains(event.target)) {
      dragZone.classList.remove("file-load__drag-zone_active");
    }
  });

  document.addEventListener("drop", function (event) {
    event.preventDefault();

    if (!dragZone.contains(event.target)) {
      return;
    }

    dragZone.classList.remove("file-load__drag-zone_active");

    getFileContentFromEvent(event, function (content) {
      statesManager.saveStateData(
        "file_load",
        "passengersInformationFileContent",
        content
      );

      localStorage.setItem("p", content);

      statesManager.loadState("aircraft_registration");
    });
  });
}

function fileLoadInit(state) {
  loadFile(state.htmlTemplateSrc, onFileLoadTemplateLoad);
}

statesManager.loadState("file_load");

if (localStorage.getItem("p")) {
  statesManager.saveStateData(
    "file_load",
    "passengersInformationFileContent",
    localStorage.getItem("p")
  );

  statesManager.loadState("cabin");
}
