define(function () {
  var AIRCRAFTS_JSON_SRC = "./data/aircrafts.json";

  var MAP_WRAPPER_CLASSNAME = "cabin__map-wrapper";
  var TABLE_BODY_CLASSNAME = "cabin__table-body";
  var PASSENGERS_TOTAL_CLASSNAME = "cabin__passengers-total";
  var ADULT_QUANTITY_CLASSNAME = "cabin__adult-quantity";
  var CHILD_QUANTITY_CLASSNAME = "cabin__child-quantity";
  var INFANT_QUANTITY_CLASSNAME = "cabin__infant-quantity";
  var COLUMNS_CLASSNAME = "cabin__columns";
  var RED_BUTTON_CLASSNAME = "cabin__button_red";
  var ORANGE_BUTTON_CLASSNAME = "cabin__button_orange";

  var dependencies = {
    appRoot: undefined,
    loadJSON: undefined,
    saveStateData: undefined,
    loadState: undefined,
    getDataFromState: undefined,
    appendChildren: undefined,
    createElement: undefined,
  };

  function isAdultPassenger(passenger) {
    return passenger.type === "ВЗ";
  }

  function isChildPassenger(passenger) {
    return passenger.type === "РБ";
  }

  function isInfantPassenger(passenger) {
    return passenger.type === "РМ";
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

  function adultPassengersQuantity(passengers) {
    return passengers.reduce(function (quantity, passenger) {
      if (isAdultPassenger(passenger)) {
        return quantity + 1;
      }

      return quantity;
    }, 0);
  }

  function infantPassengersQuantity(passengers) {
    return passengers.reduce(function (quantity, passenger) {
      if (isInfantPassenger(passenger)) {
        return quantity + 1;
      }

      return quantity;
    }, 0);
  }

  function getCellsQuantityOfZoneRows(zoneRowNumbers) {
    var cellsQuantityOfZoneRows = {};

    for (var row of zoneRowNumbers) {
      cellsQuantityOfZoneRows[row] =
        getCurrentAircraft().cellsQuantityOfRows[row];
    }

    return cellsQuantityOfZoneRows;
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

  function calculatePassengersInformation() {
    var fileContent =
      dependencies.getDataFromState(
        "file_load"
      ).passengersInformationFileContent;

    var matchedPassengersInfo = fileContent.match(
      /(?<=.)(ВЗ|РБ)(.+)(\d+[A-Z])(?=.)/gm
    );
    var matchedInfantsInfo = fileContent.match(/РМ/gm);

    matchedPassengersInfo = matchedPassengersInfo.concat(matchedInfantsInfo);

    fixPassengersRowNumbers(matchedPassengersInfo);

    dependencies.saveStateData(
      "cabin",
      "passengers",
      serializePassengers(matchedPassengersInfo)
    );
  }

  function addRowToThePassengersTable(zoneName) {
    var rowElement = document.createElement("tr");

    var zoneCellElement = document.createElement("td");
    var adultCellElement = document.createElement("td");
    var childCellElement = document.createElement("td");
    var infantCellElement = document.createElement("td");

    dependencies.appendChildren(rowElement, [
      zoneCellElement,
      adultCellElement,
      childCellElement,
      infantCellElement,
    ]);

    zoneCellElement.innerHTML = zoneName;
    adultCellElement.innerHTML = adultPassengersQuantityInCertainZone(
      dependencies.getDataFromState("cabin").passengers,
      zoneName
    );
    childCellElement.innerHTML = childPassengersQuantityInCertainZone(
      dependencies.getDataFromState("cabin").passengers,
      zoneName
    );
    infantCellElement.innerHTML = 0;

    dependencies.appRoot
      .querySelector("." + TABLE_BODY_CLASSNAME)
      .appendChild(rowElement);
  }

  function getCurrentAircraft() {
    var aircrafts = dependencies.getDataFromState("cabin").aircrafts;
    var aircraftRegistration = dependencies.getDataFromState(
      "aircraft_registration"
    ).aircraftRegistration;

    return aircrafts[aircraftRegistration];
  }

  function getRowsQuantityOfZonesOnCurrentAircraft() {
    return Object.entries(getCurrentAircraft().rowsQuantityOfZones);
  }

  function renderPassengersTable() {
    for (var zoneInfo of getRowsQuantityOfZonesOnCurrentAircraft()) {
      addRowToThePassengersTable(zoneInfo[0]);
    }
  }

  function childPassengersQuantity(passengers) {
    return passengers.reduce(function (quantity, passenger) {
      if (isChildPassenger(passenger)) {
        return quantity + 1;
      }

      return quantity;
    }, 0);
  }

  function infantPassengersQuantity(passengers) {
    return passengers.reduce(function (quantity, passenger) {
      if (isInfantPassenger(passenger)) {
        return quantity + 1;
      }

      return quantity;
    }, 0);
  }

  function renderAdditionalPassengersInformation() {
    document.querySelector("." + PASSENGERS_TOTAL_CLASSNAME).innerHTML =
      dependencies.getDataFromState("cabin").passengers.length;

    document.querySelector("." + ADULT_QUANTITY_CLASSNAME).innerHTML =
      adultPassengersQuantity(
        dependencies.getDataFromState("cabin").passengers
      );

    document.querySelector("." + CHILD_QUANTITY_CLASSNAME).innerHTML =
      childPassengersQuantity(
        dependencies.getDataFromState("cabin").passengers
      );

    document.querySelector("." + INFANT_QUANTITY_CLASSNAME).innerHTML =
      infantPassengersQuantity(
        dependencies.getDataFromState("cabin").passengers
      );
  }

  function renderCabinColumns() {
    var aircraft = getCurrentAircraft();

    for (var columnName of aircraft.columns) {
      var columnElement = dependencies.createElement("div", ["cabin__column"]);
      columnElement.innerHTML = columnName;

      appRoot.querySelector("." + COLUMNS_CLASSNAME).appendChild(columnElement);
    }
  }

  function isOcuppiedCell(rowNumber, columnName) {
    return dependencies
      .getDataFromState("cabin")
      .passengers.find(function (passenger) {
        if (passenger.row === rowNumber && passenger.column === columnName) {
          return true;
        }
      });
  }

  function createCabinRow(rowNumber, columnNames, cellsQuantity) {
    var cabinRowElement = dependencies.createElement("div", ["cabin__row"]);

    var cabinRowNumberElement = dependencies.createElement("div", [
      "cabin__row-number",
    ]);
    cabinRowNumberElement.innerHTML = rowNumber;

    cabinRowElement.appendChild(cabinRowNumberElement);

    for (var i = 0; i < cellsQuantity; ++i) {
      var currentColumnName = columnNames[i];

      if (isOcuppiedCell(rowNumber, currentColumnName)) {
        var cabinCellElement = dependencies.createElement("div", [
          "cabin__cell",
          "cabin__cell_ocuppied",
        ]);

        cabinRowElement.appendChild(cabinCellElement);
      } else {
        var cabinCellElement = dependencies.createElement("div", [
          "cabin__cell",
        ]);

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
    var zoneElement = dependencies.createElement("div", ["cabin__zone"]);

    var zoneNameElement = dependencies.createElement("div", [
      "cabin__zone-name",
    ]);
    zoneNameElement.innerHTML = zoneName;
    zoneElement.appendChild(zoneNameElement);

    var zoneRowsWrapper = dependencies.createElement("div", [
      "cabin__rows-wrapper",
    ]);
    zoneElement.appendChild(zoneRowsWrapper);

    for (var i = 0; i < zoneRowsQuantity; ++i) {
      var renderedRowsQuantity =
        dependencies.getDataFromState("cabin").renderedRowsQuantity;

      dependencies.saveStateData(
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

  function renderCabinZones() {
    var cabinMapWrapper = dependencies.appRoot.querySelector(
      "." + MAP_WRAPPER_CLASSNAME
    );

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

      cabinMapWrapper.appendChild(cabinZoneElement);
    }
  }

  function renderCabinMap() {
    renderCabinColumns();

    renderCabinZones();
  }

  function renderPassengersInformation() {
    renderPassengersTable();
    renderAdditionalPassengersInformation();
    renderCabinMap();
  }

  function returnBackToFileLoad() {
    localStorage.removeItem("file");

    dependencies.loadState("file_load");
  }

  function returnBackToAircraftRegistration() {
    localStorage.removeItem("aircraft_registration");

    dependencies.saveStateData(
      "aircraft_registration",
      "aircraftRegistration",
      undefined
    );

    dependencies.loadState("aircraft_registration");
  }

  function initEvents() {
    var fileLoadButton = appRoot.querySelector("." + RED_BUTTON_CLASSNAME);
    var aircraftRegistrationButton = appRoot.querySelector(
      "." + ORANGE_BUTTON_CLASSNAME
    );

    fileLoadButton.addEventListener("click", returnBackToFileLoad);

    aircraftRegistrationButton.addEventListener(
      "click",
      returnBackToAircraftRegistration
    );
  }

  // do we need move this function to utils? sure...
  function initTemplate(htmlTemplateSrc, callback) {
    dependencies.loadFile(htmlTemplateSrc, function (template) {
      dependencies.appRoot.innerHTML = template;

      callback();
    });
  }

  function onAircraftsInformationLoad(json) {
    dependencies.saveStateData("cabin", "aircrafts", json);

    calculatePassengersInformation();
    renderPassengersInformation();
    initEvents();
  }

  function onInit(moduleDependencies) {
    dependencies = moduleDependencies;

    dependencies.loadJSON(AIRCRAFTS_JSON_SRC, onAircraftsInformationLoad);
  }

  return {
    onInit,
  };
});
