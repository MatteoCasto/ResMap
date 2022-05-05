function parsingPointsXML(xmlToParse) {

    /* 

    This function parses the PRNx file (XML) to get
    all the points from the projects
    and add them to the ol map

    INPUT: XML toparse, coming from fr.result (FileReader method)
    OUPUT: [ Id list for fixed points, Id list for variable points ] (2D Array)

    */


    // Récupération des éléments des balises <point> des coordonnées approchées
    let approxCoords = xmlDoc.getElementsByTagName("coordinates")[0];
    let pointList = approxCoords.getElementsByTagName("point");


    // Séparation et listage des id des points nouveau (variables)
    let variablePoints = xmlDoc.getElementsByTagName("variablePoints")[2];
    let variablePointsList = variablePoints.getElementsByTagName("variablePoint");
    let variablePointsListId = [] // Liste des id des pts variables
    for (i = 0; i < variablePointsList.length; i++) {
        id = variablePointsList[i].getAttribute("name");
        variablePointsListId.push(id);
    };
    

    // Initialisation des Vector Layer et du tableau des if de pts fixes
    pointsSource = new ol.source.Vector({});
    VariablesPointsSource = new ol.source.Vector({});
    pointsListId = []
    listAllPoints = new Map();

    // Parcours de tous les points (coord approchées)
    for (i = 0; i < pointList.length; i++) {

      pointName_i = pointList[i].getAttribute("name");
      if (pointName_i !== "NULLBERN") {
        E_i = parseFloat(pointList[i].getAttribute("easting")).toFixed(4);
        N_i = parseFloat(pointList[i].getAttribute("northing")).toFixed(4);
        listAllPoints.set(pointName_i,[E_i,N_i]);

        // Création d'une Feature ol pour Point i (MN95)
        let featurePointMN95 = new ol.Feature({
            geometry: new ol.geom.Point([parseFloat(E_i), parseFloat(N_i)]),
            name: pointName_i,
        });
        
        // Check si c'est un point variable ou fixe
        if (variablePointsListId.includes(pointName_i) === false) { // pt fixe ->

            // Ajout de chaque geom Point à la source
            featurePointMN95.setId(pointName_i)
            pointsSource.addFeature(featurePointMN95);

            pointsListId.push(pointName_i)
            
        } else { // -> pt nouv (variable)

            // Ajout de chaque geom Point à la source
            featurePointMN95.setId(pointName_i)
            VariablesPointsSource.addFeature(featurePointMN95);
        };
      };
    };



    // <------ POINTS FIXES ------>

    // Création du style labelText pt fixe
    textStyleFixedPoints = new ol.style.Text({
        textAlign: "center",
        textBaseline: "middle",
        font: "bold 14px Calibri",
        fill: new ol.style.Fill({
          color: "blue"
        }),
        stroke: new ol.style.Stroke({
          color: "#ffffff", width: 3
        }),
        offsetX: 20.0,
        offsetY: -10.0,
        rotation: 0
    });
    // Création du style de Layer pour points fixes
    stylePointsFixedLayer = new ol.style.Style({
        image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
          src: './img/blueTriangle_icon.png',
          scale: '0.04',
          color: '#6600ff',
        })),
        text: textStyleFixedPoints,
    });
    // Création du Vector Layer avec les points fixes
    pointsLayer = new ol.layer.Vector({
        source: pointsSource,
        // la propriété style prend un callback qui doit retourner un style
        style: function (feature) {
            stylePointsFixedLayer.getText().setText(feature.getId());
            return stylePointsFixedLayer;
        },
    });
    // -> Ajout du Vector Layer à la carte
    map.addLayer(pointsLayer);
    pointsLayer.setZIndex(98);
    console.log("Fixed points has been added to map");



    
    // <------ POINTS NOUVEAUX ------>

    // Création du style labelText pt nouv
    textStyleVariablePoints = new ol.style.Text({
      textAlign: "center",
      textBaseline: "middle",
      font: "bold 14px Calibri",
      fill: new ol.style.Fill({
        color: "red"
      }),
      stroke: new ol.style.Stroke({
        color: "#ffffff", width: 3
      }),
      offsetX: 20.0,
      offsetY: -10.0,
      rotation: 0
    });
    // Création du style de Layer pour points variables
    stylePointsVariableLayer = new ol.style.Style({
        image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
        src: './img/redDot_icon.png',
        scale: '0.005',
      })),
      text: textStyleVariablePoints,
    });
    // -> Création du Vector Layer avec les points nouv
    pointsVariableLayer = new ol.layer.Vector({
        source: VariablesPointsSource,
        // la propriété style prend un callback qui doit retourner un style
        style: function (feature) {
            stylePointsVariableLayer.getText().setText(feature.getId());
            return stylePointsVariableLayer;
        },
    });
    // Ajout du Vector Layer à la carte
    map.addLayer(pointsVariableLayer);
    pointsVariableLayer.setZIndex(99);
    console.log("Variable points has been added to map");



    return listAllPoints;
};





  


