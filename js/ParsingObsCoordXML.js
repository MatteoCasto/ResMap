function parsingObsCoord(xmlToParse) {

    /* 

    This function parses the PRNx file (XML) to get
    all the coordinates observation (most of them for "libre-ajusté"
    compensation), add them to the map
    and style them with forms and/or color.

    INPUT: XML toparse, coming from fr.result (FileReader method)
    OUPUT: None

    */

    
    let parser = new DOMParser();
    let xmlDoc = parser.parseFromString(xmlToParse,"text/xml");
    let planimetricAbriss = xmlDoc.getElementsByTagName("planimetricAbriss")[0];
    let stationsList = planimetricAbriss.getElementsByTagName("station");

    // Initialisation du Vector Source
    obsCoordSourceE = new ol.source.Vector({});
    obsCoordSourceN = new ol.source.Vector({});

    // Récupérer les No des observation de coordonnées YX et obtenir les coordonnées des points concernés
    for (let i = 0; i < stationsList.length; i++) {

        if (stationsList[i].getAttribute("obsType") === "coordinate") {
    
            let pointObs = stationsList[i];
            let listTargets = pointObs.getElementsByTagName("target");

            for (let j = 0; j < listTargets.length; j++) {
                let targetObs = listTargets[j];
                let pointName_i = targetObs.getAttribute("name");
                let E = parseFloat(listAllPoints.get(pointName_i)[0]);
                let N = parseFloat(listAllPoints.get(pointName_i)[1]);

                // Création d'une Feature ol pour chaque point avec des obs. de coord.
                
                
                // let obsCoordType_0 = targetObs.getElementsByTagName("obs")[0];
                // let obsCoordType_1 = targetObs.getElementsByTagName("obs")[1];
                let grandeurSymbole = 8.0
                
                // Choix pour chaque symbole (si E ou N)
                for(k=0; k<targetObs.getElementsByTagName("obs").length; k++) { 
                
                    if (targetObs.getElementsByTagName("obs")[k].getAttribute("target") === "Y") {
                        symbolCoords = [E,N] 
                        featureObsCoord = new ol.Feature({
                            geometry: new ol.geom.Point(symbolCoords),
                            name: pointName_i,
                            properties: "divXXXXXXXXXXXX"
                        });
                        obsCoordSourceE.addFeature(featureObsCoord);
                    };
                    if (targetObs.getElementsByTagName("obs")[k].getAttribute("target") === "X") {
                        symbolCoords = [E,N] 
                        featureObsCoord = new ol.Feature({
                            geometry: new ol.geom.Point(symbolCoords),
                            name: pointName_i,
                            properties: "divXXXXXXXXXXXX"
                        });
                        obsCoordSourceN.addFeature(featureObsCoord);
                    };
                    if (targetObs.getElementsByTagName("obs")[k].getAttribute("target") === "X" ) {
                        symbolCoords = [E,N] 
                        featureObsCoord = new ol.Feature({
                            geometry: new ol.geom.Point(symbolCoords),
                            name: pointName_i,
                            properties: "divXXXXXXXXXXXX"
                        });
                        obsCoordSourceN.addFeature(featureObsCoord);
                    };


                };
            
                
            };

        };
    
    };

    obsCoordELayer = new ol.layer.Vector({
        source: obsCoordSourceE,
        style: new ol.style.Style({
            image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                src: './img/E_obs.png',
                scale: '0.13',
                color: '#000000',
                width: 5,
            })),
        }),
    });
    obsCoordNLayer = new ol.layer.Vector({
        source: obsCoordSourceN,
        style: new ol.style.Style({
            image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                src: './img/N_obs.png',
                scale: '0.13',
                color: '#000000',
            })),
        }),
    });


    map.addLayer(obsCoordELayer);
    map.addLayer(obsCoordNLayer);
    changeLayerVisibilityCoordE();
    changeLayerVisibilityCoordN();
    obsCoordELayer.setZIndex(99);
    obsCoordNLayer.setZIndex(99);
    console.log("Coordinates observations has been added to map");






};
