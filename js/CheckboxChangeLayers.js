
function changeLayerVisibilityFixedPoints() {

    if (document.getElementById("checkboxPointsFixes").checked === false) {
        pointsLayer.setVisible(false);
    };
    if (document.getElementById("checkboxPointsFixes").checked === true) {
        pointsLayer.setVisible(true);
    }; 
};


function changeLayerVisibilityVariablePoints() {

    if (document.getElementById("checkboxPointsNouv").checked === false) {
        pointsVariableLayer.setVisible(false);
    };
    if (document.getElementById("checkboxPointsNouv").checked === true) {
        pointsVariableLayer.setVisible(true);
    };
};

function changeLayerVisibilityDistances() {

    if (document.getElementById("checkboxDistances").checked === false) {
        distanceLayer.setVisible(false);
    };
    if (document.getElementById("checkboxDistances").checked === true) {
        distanceLayer.setVisible(true);
    };
};


function changeLayerVisibilityDirections() {

    if (document.getElementById("checkboxDirections").checked === false) {
        directionLayer.setVisible(false);
    };
    if (document.getElementById("checkboxDirections").checked === true) {
        directionLayer.setVisible(true);
    };
};


function changeLayerVisibilityEllipses() {

    if (document.getElementById("checkboxEllipses").checked === false) {
        ellipseLayer.setVisible(false);
    };
    if (document.getElementById("checkboxEllipses").checked === true) {
        ellipseLayer.setVisible(true);
    };
};


function changeLayerVisibilityEllipsesRela() {

    if (document.getElementById("checkboxEllipsesRela").checked === false) {
        ellipseRelaLayer.setVisible(false);
    };
    if (document.getElementById("checkboxEllipsesRela").checked === true) {
        ellipseRelaLayer.setVisible(true);
    };
};



function changeLayerVisibilityRectangles() {

    if (document.getElementById("checkboxRectangles").checked === false) {
        rectangleLayer.setVisible(false);
    };
    if (document.getElementById("checkboxRectangles").checked === true) {
        rectangleLayer.setVisible(true);
    };
};



function changeLayerVisibilityRectanglesRela() {

    if (document.getElementById("checkboxRectanglesRela").checked === false) {
        rectangleRelaLayer.setVisible(false);
    };
    if (document.getElementById("checkboxRectanglesRela").checked === true) {
        rectangleRelaLayer.setVisible(true);
    };
};



function changeLayerVisibilityGnss() {

    if (document.getElementById("checkboxGnss").checked === false) {
        gnssLayer.setVisible(false);
    };
    if (document.getElementById("checkboxGnss").checked === true) {
        gnssLayer.setVisible(true);
    };
};


function changeLayerVisibilityCoordE() {

    if (document.getElementById("checkboxCoordE").checked === false) {
        obsCoordELayer.setVisible(false);
    };
    if (document.getElementById("checkboxCoordE").checked === true) {
        obsCoordELayer.setVisible(true);
    };
};


function changeLayerVisibilityCoordN() {

    if (document.getElementById("checkboxCoordN").checked === false) {
        obsCoordNLayer.setVisible(false);
    };
    if (document.getElementById("checkboxCoordN").checked === true) {
        obsCoordNLayer.setVisible(true);
    };
};


function changeLayerVisibilityFiabLoc() {
    
    if (document.getElementById("checkboxFiabLoc").checked === false) {
        fiabLocalLayer.setVisible(false);
    };
    if (document.getElementById("checkboxFiabLoc").checked === true) {
        fiabLocalLayer.setVisible(true);
        document.getElementById("checkboxResidusNormes").checked = false;
        document.getElementById("checkboxDistances").checked = false;
        document.getElementById("checkboxDirections").checked = false;
        if (xmlDoc.getElementsByTagName("biggestWi").length != 0) {  // seulement si pas pré-analyse
            wiLayer.setVisible(false);
        };
        distanceLayer.setVisible(false);
        directionLayer.setVisible(false);
    };
};


function changeLayerVisibilityWi() {
    
    if (document.getElementById("checkboxResidusNormes").checked === false) {
        wiLayer.setVisible(false);
    };
    if (document.getElementById("checkboxResidusNormes").checked === true) {
        wiLayer.setVisible(true);
        document.getElementById("checkboxFiabLoc").checked = false;
        document.getElementById("checkboxDistances").checked = false;
        document.getElementById("checkboxDirections").checked = false;
        fiabLocalLayer.setVisible(false);
        distanceLayer.setVisible(false);
        directionLayer.setVisible(false);
        
    };
};


function changeLayerVisibilityVect() {
    
    if (document.getElementById("checkboxVect").checked === false) {
        vectLayer.setVisible(false);
    };
    if (document.getElementById("checkboxVect").checked === true) {
        vectLayer.setVisible(true);
    };
};



function changeLayerVisibilityTextFixedPoints() {

    map.removeLayer(pointsLayer);
    
    if (document.getElementById("checkboxPointsFixesNo").checked === true) {
        // Création du Vector Layer avec les points fixes
        pointsLayer = new ol.layer.Vector({
            source: pointsSource,
            // la propriété style prend un callback qui doit retourner un style
            style: function (feature) {
                stylePointsFixedLayer.getText().setText(feature.getId());
                return stylePointsFixedLayer;
            },
        });
    };
    if (document.getElementById("checkboxPointsFixesNo").checked === false) {
        // Création du Vector Layer avec les points fixes
        pointsLayer = new ol.layer.Vector({
            source: pointsSource,
            // la propriété style prend un callback qui doit retourner un style
            style: function () {
                stylePointsFixedLayer.getText().setText(" ");
                return stylePointsFixedLayer;
            }
        });
    };
    pointsLayer.setZIndex(98);
    map.addLayer(pointsLayer);
    changeLayerVisibilityFixedPoints();
    console.log("Fixed points has been added to map");
    
};



function changeLayerVisibilityTextVariablePoints() {

    map.removeLayer(pointsVariableLayer);

    if (document.getElementById("checkboxPointsVariableNo").checked === true) {
        // Création du Vector Layer avec les points nouveaux
        pointsVariableLayer = new ol.layer.Vector({
            source: VariablesPointsSource,
            // la propriété style prend un callback qui doit retourner un style
            style: function (feature) {
                stylePointsVariableLayer.getText().setText(feature.getId());
                return stylePointsVariableLayer;
            },
        });
    };
    if (document.getElementById("checkboxPointsVariableNo").checked === false) {
        // Création du Vector Layer avec les points nouveaux
        pointsVariableLayer = new ol.layer.Vector({
            source: VariablesPointsSource,
            // la propriété style prend un callback qui doit retourner un style
            style: function () {
                stylePointsVariableLayer.getText().setText(" ");
                return stylePointsVariableLayer;
            }
        });
    };
    pointsVariableLayer.setZIndex(99);
    map.addLayer(pointsVariableLayer);
    changeLayerVisibilityVariablePoints();
    console.log("Variable points have been added to map");
    
};