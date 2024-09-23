define(function () {
  var dependencies = {
    appRoot: undefined,
    saveStateData: undefined,
    loadState: undefined,
    getDataFromState: undefined,
  };

  function resetAircraftRegistrationValue() {
    var value = dependencies.getDataFromState("aircraft_registration")
      .options[0].value;

    dependencies.saveStateData(
      "aircraft_registration",
      "aircraftRegistration",
      value
    );

    localStorage.setItem("aircraft_registration", value);
  }

  function onSelect(event) {
    dependencies.saveStateData(
      "aircraft_registration",
      "aircraftRegistration",
      event.target.value
    );

    localStorage.setItem("aircraft_registration", event.target.value);

    dependencies.loadState("cabin");
  }

  function renderSelectOptions(parent) {
    for (var optionData of dependencies.getDataFromState(
      "aircraft_registration"
    ).options) {
      var optionElement = document.createElement("option");
      optionElement.innerHTML = optionData.value;
      optionElement.value = optionData.value;

      parent.appendChild(optionElement);
    }
  }

  function skipSelection() {
    dependencies.loadState("cabin");
  }

  function onInit(moduleDependecies) {
    dependencies = moduleDependecies;

    var selectElement = document.querySelector(
      ".aircraft-registration__select"
    );
    var skipButton = document.querySelector(".aircraft-registration__button");

    renderSelectOptions(selectElement);

    // do we need reset value here?
    resetAircraftRegistrationValue();

    selectElement.addEventListener("change", onSelect);
    skipButton.addEventListener("click", skipSelection);
  }

  return {
    onInit,
  };
});
