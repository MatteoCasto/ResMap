
function parsingVectXML(xmlToParse) {

    /* 
  
    This function parses the PRNx file (XML) to get and 
    generate the vectors from the differences DY/DX between
    initial coordinates and compensated coordinates
  
    INPUT: XML toparse, coming from fr.result (FileReader method)
    OUPUT: None
    
    */

    // Récupération des éléments des balises <coordinates>

    let coordinates = xmlDoc.getElementsByTagName("coordinates")[0];
    let pointsList = coordinates.getElementsByTagName("point");

    let vectLineSource = new ol.source.Vector({});

    for (i=0; i<pointsList.length; i++){

        
        // Tri pour garder uniquement les valeurs existantes de dy/dx
        if ( pointsList[i].getAttribute("dy") != null ) {
            // Tri pour garder uniquement les dy et dx non-nuls (si dy!=0.0 et dx!=0.0)
            if ( pointsList[i].getAttribute("dy") != 0.0 || pointsList[i].getAttribute("dx") != 0.0) {

                // Attribution des éléments des vecteurs
                let pointName = pointsList[i].getAttribute("name");
                let dy = parseFloat(pointsList[i].getAttribute("dy"))/1000.0; // en [m]
                let dx = parseFloat(pointsList[i].getAttribute("dx"))/1000.0; // en [m]
                let norm = Math.sqrt(dy**2+dx**2); // en [m]
                let center = [parseFloat(listAllPoints.get(pointName)[0]),parseFloat(listAllPoints.get(pointName)[1])];
                let gisVect = (Math.atan2(dx,dy))*200.0/Math.PI; // Gisement du vecteur en [g] (pour dessin flèche)
                if (gisVect<0) {
                    gisVect = - gisVect + 100.0;
                } else {
                    gisVect = 400-(gisVect-100.0);
                };
                let Earrow = center[0]+echelleEllipses*norm*Math.sin(gisVect*Math.PI/200.0);
                let Narrow = center[1]+echelleEllipses*norm*Math.cos(gisVect*Math.PI/200.0);

                // Calcul des éléments pour la flèches  du vecteur [g] et [m]
                let gisArrow1 = gisVect + 200.0 + 50.0
                let gisArrow2 = gisVect + 200.0 - 50.0

                let Ea1 = (norm/5)*echelleEllipses*Math.sin(gisArrow1*Math.PI/200.0) + Earrow;
                let Na1 = (norm/5)*echelleEllipses*Math.cos(gisArrow1*Math.PI/200.0) + Narrow;
                let Ea2 = (norm/5)*echelleEllipses*Math.sin(gisArrow2*Math.PI/200.0) + Earrow;
                let Na2 = (norm/5)*echelleEllipses*Math.cos(gisArrow2*Math.PI/200.0) + Narrow;

                // Calcul des coordonnées du vecteur avec la flèche
                let listENvect = [ [center[0],center[1]] , [Earrow, Narrow] , [Ea1, Na1] , [Earrow, Narrow] , [Ea2, Na2] ];                                       
                
                // Création de la Feature
                let featureEllipse = new ol.Feature({
                    geometry: new ol.geom.LineString(listENvect),
                    properties: String((norm*1000.0).toFixed(1)) + 'mm',  // norme du vecteur de diff. pour affichage
                });
                vectLineSource.addFeature(featureEllipse);

            };
        };
    };

    // Création du style labelText pour demi-grand axe a
    let textStyleVect = new ol.style.Text({
        textAlign: "center",
        textBaseline: "middle",
        font: "13px Calibri",
        fill: new ol.style.Fill({
        color: "#FF0000"
        }),
        stroke: new ol.style.Stroke({
        color: "#ffffff", width: 3
        }),
        offsetX: 10,
        offsetY: -10,
        rotation: 0,
        placement: "point"
    });


    // Création du style vecteurs
    let styleVect = new ol.style.Style({
        stroke: new ol.style.Stroke({ color: '#FF0000', width: 1 }),
        text: textStyleVect
    });

    // Création du Layer ellipses
    vectLayer = new ol.layer.Vector({
        source: vectLineSource,
        style: function (feature) { // la propriété style prend un callback qui doit retourner un style
            styleVect.getText().setText(feature.get("properties")); 
            return styleVect;
        }
    });


    // Ajout à la carte
    map.addLayer(vectLayer);
    vectLayer.setZIndex(99);
    changeLayerVisibilityVect();
    document.getElementById("AffichageEchelleVect").textContent = "⤷ Echelle: " + echelleEllipses + ":1";
    console.log("Diff. vectors have been added to map");
    

    
};