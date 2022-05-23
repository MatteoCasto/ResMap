
// simple function used to create an array with steps
// between 2 values
function range(start, stop, step){
  step = step || 1;
  var arr = [];
  for (var i=start;i<stop;i+=step){
     arr.push(i);
  }
  return arr;
};


function parsingEllipsesXML(xmlToParse) {

    /* 
  
    This function parses the PRNx file (XML) to get and 
    generate the ellipses on the map (with scale factor)
  
    INPUT: XML to parse, coming from fr.result (FileReader method)
    OUPUT: None
    
    */

  


  // Récupération des éléments des balises <coordinates>
  let coordinates = xmlDoc.getElementsByTagName("coordinates")[0];
  let pointsList = coordinates.getElementsByTagName("point");


  // ------- NIVEAU DE CONFIANCE ELLIPSES -------
  let progvers = xmlDoc.getElementsByTagName("progvers")[0];
  titreProg = progvers.getAttribute("name");
  nameProg = progvers.textContent;

  if (nameProg==="1") {
    nivConfianceEllipses = "95%";
    kSigma = 2.45; //  pour passer de 1 sigma à k sigma
  }
  else if (nameProg==="2") {
    nivConfianceEllipses = "39%";
    kSigma = 1.0;
  }
  else if (nameProg==="3") {
    nivConfianceEllipses = "39%";
    kSigma = 1.0;
  }
  else if (nameProg==="4") {
    nivConfianceEllipses = "39%";
    kSigma = 1.0;
  }
  else if (nameProg==="5") {
    nivConfianceEllipses = "39%";
    kSigma = 1.0;
  }
  document.getElementById("nivConfiance").textContent = "Niveau de confiance des ellipses → " + String(nivConfianceEllipses)



  // Initialisation des boucles pour création d'ellipses
  let t = range(0, 390, 10);
  let allListENellipse = []
  let allListAzimut = []
  let allListCenter = []
  let listA = []

  for (i=0; i<pointsList.length; i++){

    if ( pointsList[i].getAttribute("meanErrorA") != null) {
      let pointName = pointsList[i].getAttribute("name");
      let a = pointsList[i].getAttribute("meanErrorA")/1000.0; // en [m]
      listA.push([(a*1000.0*kSigma).toFixed(1)]);
      let b = pointsList[i].getAttribute("meanErrorB")/1000.0; // en [m]
      let center = [parseFloat(listAllPoints.get(pointName)[0]),parseFloat(listAllPoints.get(pointName)[1])]
      allListAzimut.push([pointsList[i].getAttribute("azimuthA")/3.1415*180.0]) // en [rad]
      allListCenter.push([center[0],center[1]]);
      
      let listENellipse = []
      t.forEach(gis => listENellipse.push( [parseFloat(a*kSigma*echelleEllipses*Math.cos(gis*3.1415/180.0)+center[0]),
        parseFloat(b*kSigma*echelleEllipses*Math.sin(gis*3.1415/180.0)+center[1])]) )
      allListENellipse.push(listENellipse); // tableau de toutes les coordonnées de chaque ellipses (grand)
    };

  };

  

  // création et ajout des feature dans la source (contient geom) pour ellipses (LineString)
  let ellipsesLineSource = new ol.source.Vector({});

  for (let i = 0; i < allListENellipse.length; i++) {

    let coordArray_i = allListENellipse[i];
    let featureEllipse = new ol.Feature({
      geometry: new ol.geom.LineString(coordArray_i),
      properties: String(listA[i]) + "mm",
    })
    featureEllipse.getGeometry().rotate(allListAzimut[i],allListCenter[i])   
    ellipsesLineSource.addFeature(featureEllipse);
  };

  // Création du style labelText pour demi-grand axe a
  let textStyleEllipse = new ol.style.Text({
    textAlign: "center",
    textBaseline: "middle",
    font: "italic 13px Calibri",
    fill: new ol.style.Fill({
      color: "#FF6BF1"
    }),
    stroke: new ol.style.Stroke({
      color: "#ffffff", width: 3
    }),
    offsetX: -10,
    offsetY: 10,
    rotation: 0,
    placement: "point"
  });

  // Création du style ellipses
  let styleEllipse = new ol.style.Style({
    stroke: new ol.style.Stroke({ color: '#FF6BF1', width: 1 }),
    text: textStyleEllipse
  });

  // Création du Layer ellipses
  ellipseLayer = new ol.layer.Vector({
    source: ellipsesLineSource,
    style: function (feature) { // la propriété style prend un callback qui doit retourner un style
      styleEllipse.getText().setText(feature.get("properties")); 
      return styleEllipse;
    }
  })

  map.addLayer(ellipseLayer);
  ellipseLayer.setZIndex(89)
  changeLayerVisibilityEllipses()
  document.getElementById("AffichageEchelleEllipse").textContent = "⤷ Echelle: " + echelleEllipses + ":1";
  console.log("Ellipses have been added to map");



};