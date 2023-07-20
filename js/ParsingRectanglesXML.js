function parsingRectanglesXML(xmlToParse) {

    /* 
  
    This function parses the PRNx file (XML) to get and 
    generate the external reliability
    rectangles on the map (with scale factor(same as ellipses))
  
    INPUT: XML toparse, coming from fr.result (FileReader method)
    OUPUT: None
    
    */


  // Récupération des éléments des balises <externalReliabilityApriori>
  // Check si il y a bien des rectangles de fiabilité dans le PRNx 
  if (xmlDoc.getElementsByTagName("externalReliabilityApriori").length != 0){
    let externalReliabilityApriori = xmlDoc.getElementsByTagName("externalReliabilityApriori")[0];
    let pointsList = externalReliabilityApriori.getElementsByTagName("point");

    allListENrectangle = []
    allListAzimut = []
    allListCenter = []
    listNA = []

    // Récupération des éléments du fichier PRNx et calcul des coords du rectangle
    for (i=0; i<pointsList.length; i++){
      if ( pointsList[i].getAttribute("na") != null && pointsList[i].getAttribute("na") != "infinite") {
        let pointName = pointsList[i].getAttribute("name");
        let na = pointsList[i].getAttribute("na")/1000.0; // en [m]
        let nb = pointsList[i].getAttribute("nb")/1000.0; // en [m]
        center = [parseFloat(listAllPoints.get(pointName)[0]),parseFloat(listAllPoints.get(pointName)[1])]
        allListAzimut.push([pointsList[i].getAttribute("azimuthN")*3.1415/200.0]) // en [rad]
        allListCenter.push([center[0],center[1]]);
        listNA.push([String((na*1000.0).toFixed(1)) + "mm"]); // Pour l'ajout du label
        
        // Calcul des coords (echelleEllipses = échelle d'affichage des rect. et ell.)
        listENrectangle = []
        listENrectangle.push([center[0]-nb*echelleEllipses, echelleEllipses*na+center[1]]);
        listENrectangle.push([center[0]+nb*echelleEllipses, echelleEllipses*na+center[1]]);
        listENrectangle.push([center[0]+nb*echelleEllipses, -echelleEllipses*na+center[1]]);
        listENrectangle.push([center[0]-nb*echelleEllipses, -echelleEllipses*na+center[1]]);
        listENrectangle.push([center[0]-nb*echelleEllipses, echelleEllipses*na+center[1]]);

        allListENrectangle.push(listENrectangle); // tableau de toutes les coordonnées de chaque rectangle (grand)
      }
      // Si il n'y a pas de fiab. externe -->  = infini sur la map
      else if (pointsList[i].getAttribute("na") != null && pointsList[i].getAttribute("na") === "infinite") {
        let pointName = pointsList[i].getAttribute("name");
        let center = [parseFloat(listAllPoints.get(pointName)[0]),parseFloat(listAllPoints.get(pointName)[1])]
        allListAzimut.push([0.0])
        allListCenter.push([center[0],center[1]]);
        listNA.push(['INFINI']);
        
        listENrectangle = []
        for(let j=0; j<5; j++) {
          listENrectangle.push([center[0], center[1]]);
        };

        allListENrectangle.push(listENrectangle);
      };

    };

    
    // création et ajout des recangles sur la map (MultiLineString)
    let rectanglesLineSource = new ol.source.Vector({});

    for (let i = 0; i < allListENrectangle.length; i++) {
      
      coordArray_i = allListENrectangle[i];
      featureRectangle = new ol.Feature({
        geometry: new ol.geom.LineString(coordArray_i),
        properties: listNA[i][0],
      })
      featureRectangle.getGeometry().rotate(-allListAzimut[i],allListCenter[i])   
      rectanglesLineSource.addFeature(featureRectangle);
    };


    // Création du style labelText pour demi-grand axe na du rect.
    let textStyleRectangle = new ol.style.Text({
      textAlign: "center",
      textBaseline: "middle",
      font: "italic 13px Calibri",
      fill: new ol.style.Fill({
        color: "#00AD02"
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
      stroke: new ol.style.Stroke({ color: '#00AD02', width: 1 }),
      text: textStyleRectangle
    });

    // Création du Layer rectangles
    rectangleLayer = new ol.layer.Vector({
      source: rectanglesLineSource,
      style: function (feature) { // la propriété style prend un callback qui doit retourner un style
        styleRectangle.getText().setText(feature.get("properties")); 
        return styleRectangle;
      }
    });

    map.addLayer(rectangleLayer);
    rectangleLayer.setZIndex(88);
    changeLayerVisibilityRectangles();
    document.getElementById("AffichageEchelleRectangles").textContent = "⤷ Echelle: " + echelleEllipses + ":1";
    console.log("Rectangles have been added to map");
    
  }






}