function fiabLocale() {

    /*
    This function crates a layer to show the local
    reliability with  a 4-colors map (intervals)
    0.00-0.25
    0.25-0.50
    0.50-0.75
    0.75-1.00

    */


    // Créer la source comprenant les features d'observations (sources de base)
    fiabLocaleSourceBase =  new ol.source.Vector({});
    fiabLocaleSourceBase.addFeatures(distanceLineSource.getFeatures());
    fiabLocaleSourceBase.addFeatures(directionLineSource.getFeatures());

    // Création de la source pour traitement graphique et nouveau layer
    fiabLocaleSource = new ol.source.Vector({});
    fiabLocalLayer = new ol.layer.Vector({});

    // parcourir la source et géréer les styles pour chaques features
    for (let i=0; i<fiabLocaleSourceBase.getFeatures().length; i++) {

        let feature = fiabLocaleSourceBase.getFeatures()[i].clone();
        let propetiesFiab = feature.getProperties().properties
        let zi = parseFloat(propetiesFiab.split("/")[2]);  // get le zi et le stocker en int
        let noObs = propetiesFiab.split("/")[0] // get le numéro d'obs. et le stocker en str
        
        // Attribution des couleurs des paliers de zi
        if (zi < 25.0) {
            colorFiab = "#FF1700";
            widthFiab = 3;
            zIndex = 99;
        } else if (zi <= 50.0) {
            colorFiab = "#FFD000";
            widthFiab = 1.5;
            zIndex = 98;
        } else if (zi <= 75.0) {
            colorFiab = "#ABFF00";
            widthFiab = 0;
            zIndex = 1;
        } else if (zi <= 100.0) {
            colorFiab = "#2AE100";
            widthFiab = 0;
            zIndex = 1;
        };

        // Si l'obs. est supprimée
        if (noObs === "") { 
            colorFiab ="rgba(0, 0, 0, 0.0)" // transparent
        };

        // Attribution du style en fonction du zi et du typeObs (variables)
        feature.getStyle().setZIndex(zIndex);
        feature.getStyle().getStroke().setColor(colorFiab);
        let widthF = feature.getStyle().getStroke().getWidth();
        feature.getStyle().getStroke().setWidth(widthF+widthFiab); // épaissir en fonction du zi

        // Ajout des features au vector source
        fiabLocaleSource.addFeature(feature);
        

    };


    
    // Ajout de la source (contenant les features) au Layer + divers
    fiabLocalLayer.setSource(fiabLocaleSource);
    map.addLayer(fiabLocalLayer);
    fiabLocalLayer.setVisible(false);
    fiabLocalLayer.setZIndex(80);
    console.log("Carte des fiabilité locales zi ajoutée")

    

};
