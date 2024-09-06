var app = document.getElementById("app");

function loadFile(src, callback) {
  fetch(src).then(function (response) {
    response.text().then(callback);
  });
}

var statesManager = {
  states: [
    {name: "file_load", htmlTemplateSrc: "./html_templates/file_load.html", callback: fileLoadInit}
  ],
  loadState(name) {
    var state = this.states.find(function (state) { return state.name === name });
    
    state.callback(state);
  }
};

function fileLoadInit(state) {
   loadFile(state.htmlTemplateSrc, function(file) {
      app.innerHTML = file;
   });
}

statesManager.loadState("file_load");
