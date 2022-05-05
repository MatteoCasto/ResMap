function parsingViseesXML(xmlToParse) {

  /* 

  This function parses the PRNx file (XML) to get
  all the points from the projects (approximate coordinates)
  and add them on the ol map

  INPUT: XML toparse, coming from fr.result (FileReader method)
  OUPUT: None
  
  */


  // Récupération des éléments des balises <station> 
  let planimetricAbriss = xmlDoc.getElementsByTagName("planimetricAbriss")[0];
  let stationsList = planimetricAbriss.getElementsByTagName("station");



  // <--------------- DISTANCES --------------->

  // Récupérer les paires [No Station, No Point visé] (No en str) - distances
  noPointsDistances = []

  for (i = 0; i < stationsList.length; i++) {
    obsType = stationsList[i].getAttribute("obsType");
    if (obsType === "distance") {
      stationXml = stationsList[i];
      noSt = stationXml.getAttribute("name");
      observationsXml = stationXml.getElementsByTagName("obs");
      for (j = 0; j < observationsXml.length; j++) {
        noVis = observationsXml[j].getAttribute("target");
        zi_i = observationsXml[j].getAttribute("zi");
        noObs = observationsXml[j].getAttribute("obsNr");
        wi_i = observationsXml[j].getAttribute("wi");
        nabla_rzi = observationsXml[j].getAttribute("nabla_rzi");
        v = observationsXml[j].getAttribute("improv");
        noPointsDistances.push([noSt,noVis,zi_i,noObs,wi_i,nabla_rzi,v]);
      };
    };
  };

  // Récupérer les coord des St et Vis [E1,N1,E2,N2] - distances
  geometryDistances = []
  
  for (i = 0; i < noPointsDistances.length; i++) {
    noSt = noPointsDistances[i][0];
    noVis = noPointsDistances[i][1];
    zi_i = noPointsDistances[i][2];
    noObs = noPointsDistances[i][3];
    wi_i = noPointsDistances[i][4];
    nabla_rzi = noPointsDistances[i][5];
    v = noPointsDistances[i][6];
    E_St = listAllPoints.get(noSt)[0];
    N_St = listAllPoints.get(noSt)[1];
    E_Vis = listAllPoints.get(noVis)[0];
    N_Vis = listAllPoints.get(noVis)[1];
    geometryDistances.push([E_St,N_St,E_Vis,N_Vis,zi_i,noObs,wi_i,nabla_rzi,v]);
  };

  // Création du layer distance
  distanceLayer = new ol.layer.Vector({});

  // création et ajout des lignes de distances sur la map - distances
  distanceLineSource = new ol.source.Vector({});

  for (i = 0; i < geometryDistances.length; i++) {
    
    let coordArray_i = [ [parseFloat(geometryDistances[i][0]),parseFloat(geometryDistances[i][1])] ,
                         [parseFloat(geometryDistances[i][2]),parseFloat(geometryDistances[i][3])] ];
    
    // calculs pour faire figurer les traits épais de 10% à 30% du vecteur
    let dE_inf = (coordArray_i[1][0] - coordArray_i[0][0])*0.1
    let dE_sup = (coordArray_i[1][0] - coordArray_i[0][0])*0.2
    let dN_inf = (coordArray_i[1][1] - coordArray_i[0][1])*0.1
    let dN_sup = (coordArray_i[1][1] - coordArray_i[0][1])*0.2
    let coordArray_i_epais = [ [dE_inf+coordArray_i[0][0] , dN_inf+coordArray_i[0][1]] ,
                              [dE_sup+coordArray_i[0][0] , dN_sup+coordArray_i[0][1]] ];

    // Création de la feature pour la symbologie de distance (sinon transparent pour obs. supp)
    featureDistanceEpais = new ol.Feature({
      geometry: new ol.geom.LineString(coordArray_i_epais),
      properties: geometryDistances[i][5] + "/dist/" + geometryDistances[i][4] + "/" + geometryDistances[i][6] + "/" + geometryDistances[i][7] + "/" + geometryDistances[i][8] + " mm"// "noObs/zi/wi/nabla_rzi/v"
    });
    if (geometryDistances[i][5] != "" ) {
      featureDistanceEpais.setStyle( new ol.style.Style({
        stroke: new ol.style.Stroke({ color: '#000000', width: 5, lineCap: "square" })
        })
      )
    } else { // si obs. supp.
        featureDistanceEpais.setStyle( new ol.style.Style({
          stroke: new ol.style.Stroke({ color: 'rgba(0, 0, 0, 0.0)', width: 0})
          })
        )
    };

    // Ajout des features
    featureDistance = new ol.Feature({
      geometry: new ol.geom.LineString(coordArray_i),
      properties: geometryDistances[i][5] + "/dist/" + geometryDistances[i][4] + "/" + geometryDistances[i][6] + "/" + geometryDistances[i][7] + "/" + geometryDistances[i][8] + " mm" // "noObs/zi/wi/nabla_rzi/v"
    });
    if (geometryDistances[i][5] === "" ) { // si l'obs. a pas de numéro (supp.), elle sera en rose et épaisse
      distanceStyle = new ol.style.Style({
        stroke: new ol.style.Stroke({ color: 'rgba(0, 0, 0, 0.0)', width: 0, })
      });
      nbObsSuppr += 1;
    }
    else { // Si l'obs a un numéro = elle est gardée
      distanceStyle = new ol.style.Style({
        stroke: new ol.style.Stroke({ color: '#000000', width: 1 })
      });
    };
    featureDistance.setStyle(distanceStyle);
    distanceLineSource.addFeature(featureDistance);
    distanceLineSource.addFeature(featureDistanceEpais);
    distanceLayer.setSource(distanceLineSource);
    // console.log(featureDistance.getProperties().properties)
  };
  
  map.addLayer(distanceLayer);
  console.log("Distances have been added to map")







  // <------------- DIRECTIONS --------------->

  // Récupérer les paires [No Station, No Point visé] (No en str) - directions
  noPointsDirections = []

  for (i = 0; i < stationsList.length; i++) {
    obsType = stationsList[i].getAttribute("obsType");
    if (obsType === "direction") {
      stationXml = stationsList[i];
      noSt = stationXml.getAttribute("name");
      observationsXml = stationXml.getElementsByTagName("obs");
      for (j = 0; j < observationsXml.length; j++) {
        noVis = observationsXml[j].getAttribute("target");
        zi_i = observationsXml[j].getAttribute("zi");
        noObs = observationsXml[j].getAttribute("obsNr");
        wi_i = observationsXml[j].getAttribute("wi");
        nabla_rzi = observationsXml[j].getAttribute("nabla_rzi");
        v = observationsXml[j].getAttribute("improv");
        noPointsDirections.push([noSt,noVis,zi_i,noObs,wi_i,nabla_rzi,v]);
      };
    };
  };

  // Récupérer les coord des St et Vis [E1,N1,E2,N2] - directions
  geometryDirections = []
  
  for (i = 0; i < noPointsDirections.length; i++) {
    noSt = noPointsDirections[i][0];
    noVis = noPointsDirections[i][1];
    zi_i = noPointsDirections[i][2];
    noObs = noPointsDirections[i][3];
    wi_i = noPointsDirections[i][4];
    nabla_rzi = noPointsDirections[i][5];
    v = noPointsDirections[i][6];
    E_St = parseFloat(listAllPoints.get(noSt)[0]);
    N_St = parseFloat(listAllPoints.get(noSt)[1]);
    E_Vis = parseFloat(listAllPoints.get(noVis)[0]);
    N_Vis = parseFloat(listAllPoints.get(noVis)[1]);
    geometryDirections.push([E_St,N_St,E_Vis,N_Vis,zi_i,noObs,wi_i,nabla_rzi,v]);
  };


  // Création du layer distance
  directionLayer = new ol.layer.Vector({});

  // création et ajout des lignes de distances sur la map - directions
  directionLineSource = new ol.source.Vector({});

  for (i = 0; i < geometryDirections.length; i++) {
    
    coordArray_i = [[geometryDirections[i][0],geometryDirections[i][1]],[geometryDirections[i][2],geometryDirections[i][3]]];
    
    // Calculs pour faire figurer les traits pleins jusqu'à 70% de la visée
    let dE_sup = (coordArray_i[1][0] - coordArray_i[0][0])*0.7
    let dN_sup = (coordArray_i[1][1] - coordArray_i[0][1])*0.7
    let coordArray_i_plein = [ [dE_sup+coordArray_i[0][0],dN_sup+coordArray_i[0][1]] ,
                               [coordArray_i[0][0],coordArray_i[0][1]] ];

    // Création de la feature pour la symbologie de direction (trait plein)
    featureDirPlein = new ol.Feature({
      geometry: new ol.geom.LineString(coordArray_i_plein),
      properties: geometryDirections[i][5] + "/dir/" + geometryDirections[i][4] + "/" + geometryDirections[i][6] + "/" + geometryDirections[i][7] + "/" + geometryDirections[i][8] + " cc"   // "noObs/typeObs/zi/wi/nabla_rzi/v"
    });
    if (geometryDirections[i][5] != "" ) {
      featureDirPlein.setStyle( new ol.style.Style({
        stroke: new ol.style.Stroke({ color: '#717171', width: 1 })
        }) 
      )
    } else {
      featureDirPlein.setStyle( new ol.style.Style({
        stroke: new ol.style.Stroke({ color: 'rgba(0, 0, 0, 0.0)', width: 0 })
        }) 
      )
    };

    // Création de la feature pour une direction (traittillés)
    featureDirection = new ol.Feature({
      geometry: new ol.geom.LineString(coordArray_i),
      properties: geometryDirections[i][5] + "/dir/" + geometryDirections[i][4] + "/" + geometryDirections[i][6] + "/" + geometryDirections[i][7] + "/" + geometryDirections[i][8] + " cc"   // "noObs/typeObs/zi/wi/nabla_rzi/v"
    });
    if (geometryDirections[i][5] === "" ) { // si l'obs. a pas de numéro, elle sera transparente
      directionStyle = new ol.style.Style({
        stroke: new ol.style.Stroke({ color: 'rgba(0, 0, 0, 0.0)', width: 0, })
      });
      nbObsSuppr += 1;
    }
    else { // Si l'obs a un numéro = elle est figurée normalement
      directionStyle = new ol.style.Style({
        stroke: new ol.style.Stroke({ color: '#717171', width: 1, lineDash: [15,7]})
      });
    };
    featureDirection.setStyle(directionStyle);
    directionLineSource.addFeature(featureDirection);
    directionLineSource.addFeature(featureDirPlein);
    directionLayer.setSource(directionLineSource);
    // console.log(featureDirection.getProperties().properties)

  };
  

  map.addLayer(directionLayer);
  console.log("Directions have been added to map")

  
  // Passer les points au dessus (ZIndex)
  distanceLayer.setZIndex(2);
  directionLayer.setZIndex(1);
  


  







};
