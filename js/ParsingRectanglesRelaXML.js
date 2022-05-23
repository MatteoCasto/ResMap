
function parsingRectanglesRelaXML(xmlToParse) {

  /* 

  This function parses the PRNx file (XML) to get and 
  generate the relatives reliability rectangles 
  on the map.

  INPUT: XML toparse, coming from fr.result (FileReader method)
  OUPUT: None
  
  */


  // Check si il y a bien des ellipses relatives dans le PRNx 
  if (xmlDoc.getElementsByTagName("relativeRectangles").length != 0){

    let relativeRectangles = xmlDoc.getElementsByTagName("relativeRectangles")[0];
    let rectRelaList = relativeRectangles.getElementsByTagName("rectangle");

    // Initialisation des boucles pour création des rectangles 
    let allListENrect = []
    let allListAzimut = []
    let allListCenters = []
    let allListP1P2 = []
    let listNA = []

    // Récupération des éléments du fichier PRNx et calcul des coords du rectangle
    for (i=0; i<rectRelaList.length; i++){
      if ( rectRelaList[i].getAttribute("na") != null) {
        let pointName1 = rectRelaList[i].getAttribute("point1");
        let pointName2 = rectRelaList[i].getAttribute("point2");
        let na = rectRelaList[i].getAttribute("na")/1000.0; // en [m]
        listNA.push([String((na*1000.0).toFixed(1)) + "mm"]); // Pour l'ajout du label
        let nb = rectRelaList[i].getAttribute("nb")/1000.0; // en [m]
        let coord1 = [parseFloat(listAllPoints.get(pointName1)[0])+0.001,parseFloat(listAllPoints.get(pointName1)[1])]
        let coord2 = [parseFloat(listAllPoints.get(pointName2)[0]),parseFloat(listAllPoints.get(pointName2)[1])]
        allListP1P2.push([coord1,coord2]);
        let moyCenter = [parseFloat(((coord1[0]+coord2[0])/2).toFixed(3)), parseFloat(((coord1[1]+coord2[1])/2).toFixed(3))]
        allListAzimut.push([rectRelaList[i].getAttribute("azimuthA")/3.1415*180.0]) // en [rad]
        allListCenters.push([moyCenter[0],moyCenter[1]]); // Centre moyen des 2 points


        // Calcul des coords (echelleEllipses = échelle d'affichage des rect. et ell.)
        listENrectangle = []
        listENrectangle.push([moyCenter[0]-nb*echelleEllipses, echelleEllipses*na+moyCenter[1]]);
        listENrectangle.push([moyCenter[0]+nb*echelleEllipses, echelleEllipses*na+moyCenter[1]]);
        listENrectangle.push([moyCenter[0]+nb*echelleEllipses, -echelleEllipses*na+moyCenter[1]]);
        listENrectangle.push([moyCenter[0]-nb*echelleEllipses, -echelleEllipses*na+moyCenter[1]]);
        listENrectangle.push([moyCenter[0]-nb*echelleEllipses, echelleEllipses*na+moyCenter[1]]);

        allListENrect.push(listENrectangle); // tableau de toutes les coordonnées de chaque rectangle (grand)
      };

    };

      // création et ajout des recangles sur la map (MultiLineString)
    let rectanglesRelaLineSource = new ol.source.Vector({});

    for (let i = 0; i < allListENrect.length; i++) {
      
      let featureRectangle = new ol.Feature({
        geometry: new ol.geom.LineString(allListENrect[i]),
        properties: listNA[i][0],
      });
      let featureLineP1P2 = new ol.Feature({ // Ligne simple reliant les 2 points relatifs
        geometry: new ol.geom.LineString(allListP1P2[i]),
      });

      featureRectangle.getGeometry().rotate(allListAzimut[i],allListCenters[i]);
      rectanglesRelaLineSource.addFeature(featureRectangle);
      rectanglesRelaLineSource.addFeature(featureLineP1P2);
      
    };


    // Création du style labelText pour demi-grand axe na du rect.
    let textStyleRectangle = new ol.style.Text({
      textAlign: "center",
      textBaseline: "middle",
      font: "italic 13px Calibri",
      fill: new ol.style.Fill({
        color: "#00D5A7"
      }),
      stroke: new ol.style.Stroke({
        color: "#ffffff", width: 3
      }),
      offsetX: -10,
      offsetY: 10,
      rotation: 0,
      placement: "point"
    });

    // Création du style rectangles
    let styleRectangle = new ol.style.Style({
      stroke: new ol.style.Stroke({ color: '#00D5A7', width: 1, lineDash: [6,2] }),
      text: textStyleRectangle
    });
    
    // Création du Layer rectangles
    rectangleRelaLayer = new ol.layer.Vector({
      source: rectanglesRelaLineSource,
      style: function (feature) { // la propriété style prend un callback qui doit retourner un style
        styleRectangle.getText().setText(feature.get("properties")); 
        return styleRectangle;
      }
    });

    
    rectangleRelaLayer.setZIndex(91);
    document.getElementById("AffichageEchelleRectanglesRela").textContent = "⤷ Echelle: " + echelleEllipses + ":1";
    map.addLayer(rectangleRelaLayer);
    changeLayerVisibilityRectanglesRela();
    console.log("Relative rectangles have been added to map");


  } else {
    console.log("There's no relatives rectangles")
    document.getElementById("legendeRectRela").className = "checkboxLabel legendeBarree";
  };


};
