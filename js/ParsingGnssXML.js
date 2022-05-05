function parsingGNSS(xmlToParse) {

    /* 

    This function parses the PRNx file (XML) to get
    all the GNSS sessions, add them to the map
    and style them with forms and/or color

    INPUT: XML toparse, coming from fr.result (FileReader method)
    OUPUT: None

    */

    
    let planimetricAbriss = xmlDoc.getElementsByTagName("planimetricAbriss")[0];
    let stationsList = planimetricAbriss.getElementsByTagName("station");
    
    // Initialisation du Vector Source
    let gnssSource = new ol.source.Vector({});
    let gnssStyle = new ol.style.Style({});
    let sessionNo = 0

    // Récupérer les numéros de points de chaque session GNSS et les stocker dans une liste (listPointsNameOfSession)
    for (let i = 0; i < stationsList.length; i++) {
        if (stationsList[i].getAttribute("obsType") === "gpsSession") {
            
            let sessionGNSS = stationsList[i];
            let listTargets = sessionGNSS.getElementsByTagName("target");
            let Listradius = [0.10,0.13,0.16,0.19,0.22,0.25,0.28,0.31,0.33];
            let listColorSession = ["#FF7C3F", "#00CEF7", "#3FFF67", "#6900F7", "#F700F6", "#F7F300", "#FFF33F", "#FF3FF0", "#FFC23F"];
            
            for (let j = 0; j < listTargets.length; j++) {
                let pointName_i = listTargets[j].getAttribute("name");
                let E = listAllPoints.get(pointName_i)[0];
                let N = listAllPoints.get(pointName_i)[1];
                
                // Création d'une Feature ol pour chaque point de la session GNSS et ajout à la source
                featurePointGnss = new ol.Feature({
                    geometry: new ol.geom.Point([parseFloat(E), parseFloat(N)]),
                    name: pointName_i,
                    properties: "Session n° " + String(sessionNo) + "/" ,
                });
                gnssStyle = new ol.style.Style({
                    // stroke: new ol.style.Stroke({ color: listColorSession[sessionNo], width: 4}),
                    image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                        src: './img/Pentagon_blanc.png',
                        scale: Listradius[sessionNo],
                        color: listColorSession[sessionNo],
                    })),
                });
                featurePointGnss.setStyle(gnssStyle);
                gnssSource.addFeature(featurePointGnss);
            };
            sessionNo = sessionNo + 1;
        };
    };


    gnssLayer = new ol.layer.Vector({
        source: gnssSource,
        style: gnssStyle,
        opacity: 1.0,
    });


    map.addLayer(gnssLayer);
    changeLayerVisibilityGnss();
    gnssLayer.setZIndex(80);
    console.log("GNSS sessions has been added to map");


    


    
    










};


