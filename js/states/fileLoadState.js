define(function () {
  var DRAG_ZONE_BACKGROUND_CHANGED_CLASSNAME = "file-load__drag-zone_active";
  var DRAG_ZONE_CLASSNAME = "file-load__drag-zone";

  var dependencies = {
    appRoot: undefined,
    saveStateData: undefined,
    getFileContentFromEvent: undefined,
    loadState: undefined,
  };

  function saveFileToLocalStorage(content) {
    localStorage.setItem("file", content);
  }

  function changeDragZoneBackground(event, dragZone) {
    event.preventDefault();
    dragZone.classList.add(DRAG_ZONE_BACKGROUND_CHANGED_CLASSNAME);
  }

  function resetDragZoneBackground(event, dragZone) {
    event.preventDefault();

    if (!dragZone.contains(event.target)) {
      dragZone.classList.remove(DRAG_ZONE_BACKGROUND_CHANGED_CLASSNAME);
    }
  }

  function initBackgroundChangeEvents() {
    var dragZone = document.querySelector("." + DRAG_ZONE_CLASSNAME);

    document.addEventListener("dragenter", function (event) {
      changeDragZoneBackground(event, dragZone);
    });
    document.addEventListener("dragover", function (event) {
      resetDragZoneBackground(event, dragZone);
    });
  }

  function onFileContentReaded(content) {
    dependencies.saveStateData(
      "file_load",
      "passengersInformationFileContent",
      content
    );
    saveFileToLocalStorage(content);
    dependencies.loadState("aircraft_registration");
  }

  function onFileDrop(event) {
    var dragZone = document.querySelector("." + DRAG_ZONE_CLASSNAME);
    if (!dragZone.contains(event.target)) {
      return;
    }

    resetDragZoneBackground(event, dragZone);

    dependencies.getFileContentFromEvent(event, onFileContentReaded);
  }

  function initFileDropEvent() {
    document.addEventListener("drop", onFileDrop);
  }

  function initTemplate(htmlTemplateSrc, callback) {
    dependencies.loadFile(htmlTemplateSrc, function (template) {
      dependencies.appRoot.innerHTML = template;

      callback();
    });
  }

  function onInit(moduleDependencies) {
    dependencies = moduleDependencies;

    initBackgroundChangeEvents();
    initFileDropEvent();
  }

  return {
    onInit,
  };
});
