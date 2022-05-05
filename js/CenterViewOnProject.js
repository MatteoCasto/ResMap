listCoordsProject = []

function logMapElements(value, key, map) {
    listCoordsProject.push(value);
};

function centerViewOnProject(listAllPoints) {
// Function which set view and zoom on the zone of the project (mean of coords)
    listAllPoints.forEach(logMapElements);
    extentProject = ol.extent.boundingExtent(listCoordsProject);
    bufferProject = ol.extent.buffer(extentProject,50);
    view.fit(bufferProject)
};