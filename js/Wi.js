function normedResidualsWi() {

    /*
    This function crates a layer to show the normed
    residuals (wi) with  a 3-colors map (intervals)

    Wi limite - infinite
    Wi inf limite - Wi limite
    0 - Wi inf limite

    */


    // Wi pas disponibles si une pré-analyse
    if (xmlDoc.getElementsByTagName("biggestWi").length != 0) { 

        // Créer la source comprenant les features d'observations (sources de base)
        wiSourceBase =  new ol.source.Vector({});
        wiSourceBase.addFeatures(distanceLineSource.getFeatures());
        wiSourceBase.addFeatures(directionLineSource.getFeatures());

        // Création de la source pour traitement graphique et nouveau layer
        wiSource = new ol.source.Vector({});
        wiLayer = new ol.layer.Vector({});


        // Récupération des balises avec la limite du wi select. par l'utilisateur lors du calcul LTOP
        let biggestWi = xmlDoc.getElementsByTagName("biggestWi");
        let limitWi = parseFloat(biggestWi[0].getAttribute("biggerThan")); // PLANI uniquement = [0] , ALTI = [1]
        let limitInf = limitWi - 0.2; // pour paliers

        // parcourir la source et géréer les styles pour chaques features
        for (let i=0; i<wiSourceBase.getFeatures().length; i++) {

            let feature = wiSourceBase.getFeatures()[i].clone();
            let propetiesWi = feature.getProperties().properties
            let wi = Math.abs(parseFloat(propetiesWi.split("/")[3]).toFixed(2)); // get le wi et le stocker en int (valeur absolue)
            let noObs = propetiesWi.split("/")[0] // get le numéro d'obs. et le stocker en str
            
            // Attribution des couleurs des paliers de wi
            if (wi >= limitWi) {
                colorWi = "#FF1700";
                widthWi = 3;
                zIndex = 99;
            } else if (wi > limitInf) {
                colorWi = "#FFD000";
                widthWi = 2;
                zIndex = 98;
            } else if (wi < limitInf) {
                colorWi = "#2AE100";
                widthWi = 0;
                zIndex = 1;
            };

            // Si l'obs. est supprimée
            if (noObs === "") { 
                colorWi ="rgba(0, 0, 0, 0.0)" // transparent
            };

            // Attribution du style en fonction du wi et du typeObs (variables)
            feature.getStyle().setZIndex(zIndex);
            feature.getStyle().getStroke().setColor(colorWi);
            let widthF = feature.getStyle().getStroke().getWidth();
            feature.getStyle().getStroke().setWidth(widthF + widthWi); // épaissir en fonction du wi

            // Ajout des features au vector source
            wiSource.addFeature(feature);

        };



    // Ajout de la source (contenant les features) au Layer + divers
    wiLayer.setSource(wiSource);
    map.addLayer(wiLayer);
    wiLayer.setVisible(false);
    wiLayer.setZIndex(80);
    console.log("Carte des résidus normés wi ajoutée")

    // Gestion des intervalles de la légende en fonction du Wi limite (issu des param. du calcul LTOP)
    document.getElementById("palierWi1").textContent = "――  "+String(limitWi)+" - ∞";
    document.getElementById("palierWi2").textContent = "――  "+String(limitInf)+" - "+String(limitWi);
    document.getElementById("palierWi3").textContent = "――  0.0 - "+String(limitInf);


    } else { // Si c'est une pré-analyse
        console.log("Pas de wi dans une pré-analyse")
        document.getElementById("legendeWi").className = "checkboxLabel legendeBarree";
    };



};
