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
  ],
  loadState(name) {
    var state = this.states.find(function (state) { return state.name === name });
    
    state.callback(state);
  },
  saveStateData(name, key, data) {
    var state = this.states.find(function (state) { return state.name === name });
    
    console.log(state);  

    state.data[key] = data;
  }
};

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
    });
  });   
}

function fileLoadInit(state) {
   loadFile(state.htmlTemplateSrc, onFileLoadTemplateLoad);
}

statesManager.loadState("file_load");
