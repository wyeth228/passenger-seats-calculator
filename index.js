var app = document.getElementById("app");

function loadFile(src, callback) {
  fetch(src).then(function (response) {
    response.text().then(callback);
  });
}

var statesManager = {
  states: [
    {
      data: { paxInfo: undefined },
      name: "file_load", 
      htmlTemplateSrc: "./html_templates/file_load.html", 
      callback: fileLoadInit
    },
    {
      data: {
        options: [
          {value: "UP-CJ004"},
          {value: "UP-CJ005"},
          {value: "UP-CJ015"},
        ],
        aircraftRegistration: "UP_CJ004"
      },
      name: "aircraft_registration", 
      htmlTemplateSrc: "./html_templates/aircraft_registration.html", 
      callback: aircraftRegistrationInit
    },
  ],
  loadState(name) {
    var state = this.states.find(function (state) { return state.name === name });
    
    state.callback(state);
  },
  saveStateData(name, key, data) {
    var state = this.states.find(function (state) { return state.name === name });

    state.data[key] = data;
  },
  getDataFromState(name) {
    var state = this.states.find(function (state) { return state.name === name });

    return state.data;
  }
};

function onAircraftRegistrationTemplateLoad(template) {
  app.innerHTML = template;

  var select = document.querySelector(".aircraft-registration__select");
  
  for(var optionData of statesManager.getDataFromState("aircraft_registration").options) {
    var optionElement = document.createElement("option");
    optionElement.value = optionData.value;
    optionElement.innerHTML = optionData.value;
    select.appendChild(optionElement);
  }

  select.addEventListener("change", function(event) {
    statesManager.saveStateData("aircraft_registration", "aircraftRegistration", event.target.value);

    console.log(statesManager);
  
    statesManager.loadState("cabin");
  });
}

function aircraftRegistrationInit(state) {
  loadFile(state.htmlTemplateSrc, onAircraftRegistrationTemplateLoad);
}

function getFileContentFromEvent(event, callback) {
  var fileReader = new FileReader();
  fileReader.readAsText(event.dataTransfer.files[0]);
    
  fileReader.onload = function() {
    callback(fileReader.result);
  }
}

function onFileLoadTemplateLoad(template) {
  app.innerHTML = template;

  var dragZone = document.querySelector(".file-load__drag-zone");
 
  document.addEventListener("dragenter", function(event) { 
    event.preventDefault();
  
    dragZone.classList.add("file-load__drag-zone_active");
  });

  document.addEventListener("dragover", function(event) {  
    event.preventDefault();
  
    if (!dragZone.contains(event.target)) {
      dragZone.classList.remove("file-load__drag-zone_active");
    }
  });
  
  document.addEventListener("drop", function(event) {
    event.preventDefault();

    if (!dragZone.contains(event.target)) {
      return;
    }
    
    dragZone.classList.remove("file-load__drag-zone_active");

    getFileContentFromEvent(event, function (content) {
      statesManager.saveStateData("file_load", "paxInfo", content);

      statesManager.loadState("aircraft_registration");
    });
  });   
}

function fileLoadInit(state) {
  loadFile(state.htmlTemplateSrc, onFileLoadTemplateLoad);
}

statesManager.loadState("file_load");
