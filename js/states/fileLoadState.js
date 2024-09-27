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

  function getDragZoneElement() {
    return document.querySelector("." + DRAG_ZONE_CLASSNAME);
  }

  function changeDragZoneBackground(event) {
    event.preventDefault();

    getDragZoneElement().classList.add(DRAG_ZONE_BACKGROUND_CHANGED_CLASSNAME);
  }

  function resetDragZoneBackground(event) {
    event.preventDefault();

    var dragZoneElement = getDragZoneElement();

    if (!dragZoneElement.contains(event.target)) {
      dragZoneElement.classList.remove(DRAG_ZONE_BACKGROUND_CHANGED_CLASSNAME);
    }
  }

  function initBackgroundChangeEvents() {
    document.addEventListener("dragenter", changeDragZoneBackground);
    document.addEventListener("dragover", resetDragZoneBackground);
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

  function onInit(moduleDependencies) {
    dependencies = moduleDependencies;

    initBackgroundChangeEvents();
    initFileDropEvent();
  }

  function onDestroy() {
    document.removeEventListener("dragenter", changeDragZoneBackground);
    document.removeEventListener("dragover", resetDragZoneBackground);
    document.removeEventListener("drop", onFileDrop);
  }

  return {
    onInit,
    onDestroy,
  };
});
