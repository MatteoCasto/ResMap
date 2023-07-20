
function parsingEllipsesRelaXML(xmlToParse) {

    /* 
  
    This function parses the PRNx file (XML) to get and 
    generate the relatives ellipses on the map (with scale factor)
  
    INPUT: XML toparse, coming from fr.result (FileReader method)
    OUPUT: None
    
    */

  
    

  // Check si il y a bien des ellipses relatives dans le PRNx 
  if (xmlDoc.getElementsByTagName("relativeEllipses").length != 0){

    let relativeEllipses = xmlDoc.getElementsByTagName("relativeEllipses")[0];
    let ellRelaList = relativeEllipses.getElementsByTagName("ellipse");

    // Initialisation des boucles pour création d'ellipses
    let t = range(0, 410, 10);
    let allListENellipse = []
    let allListAzimut = []
    let allListCenters = []
    let allListP1P2 = []
    let listA = []

    // Récupération des éléments du fichier PRNx et calcul des coords de l'éllipse
    for (i=0; i<ellRelaList.length; i++){
      if ( ellRelaList[i].getAttribute("meanErrorA") != null) {
        let pointName1 = ellRelaList[i].getAttribute("point1");
        let pointName2 = ellRelaList[i].getAttribute("point2");
        let a = ellRelaList[i].getAttribute("meanErrorA")/1000.0; // en [m]
        listA.push([(a*1000.0*kSigma).toFixed(1)]);
        let b = ellRelaList[i].getAttribute("meanErrorB")/1000.0; // en [m]
        let coord1 = [parseFloat(listAllPoints.get(pointName1)[0]),parseFloat(listAllPoints.get(pointName1)[1])]
        let coord2 = [parseFloat(listAllPoints.get(pointName2)[0]),parseFloat(listAllPoints.get(pointName2)[1])]
        allListP1P2.push([coord1,coord2]);
        let moyCenter = [parseFloat(((coord1[0]+coord2[0])/2).toFixed(3)), parseFloat(((coord1[1]+coord2[1])/2).toFixed(3))]
        allListAzimut.push([ellRelaList[i].getAttribute("azimuthA")*3.1415/200.0]) // en [rad]
        allListCenters.push([moyCenter[0],moyCenter[1]]); // Centre moyen des 2 points
        
        // Calcul des coords (echelleEllipses = échelle d'affichage des rect. et ell.)
        let listENellipse = [];
        t.forEach( gis => listENellipse.push( [parseFloat(a*kSigma*echelleEllipses*Math.cos(gis*3.1415/200.0)+moyCenter[0]),
          parseFloat(b*kSigma*echelleEllipses*Math.sin(gis*3.1415/200.0)+moyCenter[1])] ) )
        allListENellipse.push(listENellipse); // tableau de toutes les coordonnées de chaque ellipses (grand)
        
      };
    };

    // création et ajout des feature dans la source (contient geom) pour ellipses (LineString)
    let ellipsesRelaLineSource = new ol.source.Vector({});

    for (let i = 0; i < allListENellipse.length; i++) {

      let coordArray_i = allListENellipse[i];
      // let coord12Array_i = [[0,0],[0,0]]
      
      let lineStringEllRela = new ol.geom.LineString(coordArray_i);
      // let lineStringP1P2 = new ol.geom.LineString(coord12Array_i);
      let geomEllRela = lineStringEllRela;

      let featureEllipse = new ol.Feature({
        geometry: geomEllRela,
        properties: String(listA[i]) + "mm",
      })
      let featureLineP1P2 = new ol.Feature({ // Ligne simple reliant les 2 points relatifs
        geometry: new ol.geom.LineString(allListP1P2[i]),
      });

      featureEllipse.getGeometry().rotate(-allListAzimut[i]+Math.PI/2,allListCenters[i])   
      ellipsesRelaLineSource.addFeature(featureEllipse);
      ellipsesRelaLineSource.addFeature(featureLineP1P2);
    };


    // Création du style labelText pour demi-grand axe a
    let textStyleEllipse = new ol.style.Text({
      textAlign: "center",
      textBaseline: "middle",
      font: "italic 13px Calibri",
      fill: new ol.style.Fill({
        color: "#FFAF42"
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
      stroke: new ol.style.Stroke({ color: '#FFAF42', width: 1, lineDash: [6,2] }),
      text: textStyleEllipse
    });

    // Création du Layer ellipses
    ellipseRelaLayer = new ol.layer.Vector({
      source: ellipsesRelaLineSource,
      style: function (feature) { // la propriété style prend un callback qui doit retourner un style
        styleEllipse.getText().setText(feature.get("properties")); 
        return styleEllipse;
      }
    });
    
    map.addLayer(ellipseRelaLayer);
    changeLayerVisibilityEllipsesRela()
    ellipseRelaLayer.setZIndex(90);
    document.getElementById("AffichageEchelleEllipseRela").textContent = "⤷ Echelle: " + echelleEllipses + ":1";
    console.log("Relative ellipses have been added to map");
    

  



  } else {
    console.log("There's no relatives ellipses")
    document.getElementById("legendeEllRela").className = "checkboxLabel legendeBarree";
  };




};