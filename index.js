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

function addRowToThePassengersTable(
  zoneName,
  createElement,
  appendChildren,
  innerHTML
) {
  var row = createElement("tr");
  var zoneCell = createElement("td");
  var adultCell = createElement("td");
  var childCell = createElement("td");
  var infantCell = createElement("td");

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

function renderCabinColumns(createElement, innerHTML) {
  var aircraft = getCurrentAircraft();

  for (var columnName of aircraft.columns) {
    var columnElement = createElement("div", ["cabin__column"]);
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

function createCabinRow(
  rowNumber,
  columnNames,
  cellsQuantity,
  createElement,
  innerHTML
) {
  var cabinRowElement = createElement("div", ["cabin__row"]);

  var cabinRowNumberElement = createElement("div", ["cabin__row-number"]);
  innerHTML(cabinRowNumberElement, rowNumber);

  cabinRowElement.appendChild(cabinRowNumberElement);

  for (var i = 0; i < cellsQuantity; ++i) {
    var currentColumnName = columnNames[i];

    if (isCellOcuppied(rowNumber, currentColumnName)) {
      var cabinCellElement = createElement("div", [
        "cabin__cell",
        "cabin__cell_ocuppied",
      ]);

      cabinRowElement.appendChild(cabinCellElement);
    } else {
      var cabinCellElement = createElement("div", ["cabin__cell"]);

      cabinRowElement.appendChild(cabinCellElement);
    }
  }

  return cabinRowElement;
}

function createCabinZone(
  zoneName,
  zoneRowsQuantity,
  cellsQuantityOfRows,
  columnNames,
  createElement,
  innerHTML
) {
  var zoneElement = createElement("div", ["cabin__zone"]);

  var zoneNameElement = createElement("div", ["cabin__zone-name"]);
  innerHTML(zoneNameElement, zoneName);

  zoneElement.appendChild(zoneNameElement);

  var zoneRowsWrapper = createElement("div", ["cabin__rows-wrapper"]);

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

  appRoot
    .querySelector(".cabin__button_red")
    .addEventListener("click", function () {
      localStorage.removeItem("file");

      statesManager.loadState("file_load");
    });

  appRoot
    .querySelector(".cabin__button_orange")
    .addEventListener("click", function () {
      localStorage.removeItem("aircraft_registration");

      statesManager.saveStateData(
        "aircraft_registration",
        "aircraftRegistration",
        undefined
      );

      statesManager.loadState("aircraft_registration");
    });
}

function onCabinTemplateLoad(template, loadJSON) {
  appRoot.innerHTML = template;

  loadJSON(AIRCRAFTS_JSON_SRC, function (json) {
    statesManager.saveStateData("cabin", "aircrafts", json);

    calculatePassengersInformation();
  });
}

function cabinInit(state, loadFile) {
  loadFile(state.htmlTemplateSrc, onCabinTemplateLoad);
}

function setDefaultValueForAircraftRegistration() {
  var value = statesManager.getDataFromState("aircraft_registration").options[0]
    .value;

  statesManager.saveStateData(
    "aircraft_registration",
    "aircraftRegistration",
    value
  );

  localStorage.setItem("aircraft_registration", value);
}

function onAircraftRegistrationTemplateLoad(template, innerHTML) {
  appRoot.innerHTML = template;

  var select = document.querySelector(".aircraft-registration__select");

  for (var optionData of statesManager.getDataFromState("aircraft_registration")
    .options) {
    var optionElement = createElement("option");
    elementValue(optionElement, optionData.value);
    innerHTML(optionElement, optionData.value);

    select.appendChild(optionElement);
  }

  setDefaultValueForAircraftRegistration();

  select.addEventListener("change", function (event) {
    statesManager.saveStateData(
      "aircraft_registration",
      "aircraftRegistration",
      event.target.value
    );

    localStorage.setItem("aircraft_registration", event.target.value);

    statesManager.loadState("cabin");
  });

  appRoot
    .querySelector(".aircraft-registration__button")
    .addEventListener("click", function () {
      statesManager.loadState("cabin");
    });
}

function aircraftRegistrationInit(state, loadFile) {
  loadFile(state.htmlTemplateSrc, onAircraftRegistrationTemplateLoad);
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

      saveFileToLocalStorage(content);

      statesManager.loadState("aircraft_registration");
    });
  });
}

// startup

var file = localStorage.getItem("file");
var aircraftRegistration = localStorage.getItem("aircraft_registration");

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
} else {
  statesManager.loadState("file_load");
}
