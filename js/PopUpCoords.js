
// Initialisation du popUp et ajout en Overlay sur la map
const element = document.getElementById('popup');
const popup = new ol.Overlay({
  element: element,
  positioning: 'bottom-center',
  stopEvent: false,
});
map.addOverlay(popup);


// display popup on click (event)
map.on('click', function (evt) {
  const feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
    return feature;
  });
  $(element).popover('dispose'); 

  // Si on a bien cliquer à proximité d'une feature
  if (feature) {

    
    //Récupérer les propriétés des obs. de distances et directions
    let noObsStr =   feature.getProperties().properties.split('/')[0];
    let typeObsStr = feature.getProperties().properties.split('/')[1];
    let ziStr =      feature.getProperties().properties.split('/')[2]+" %";
    let wiStr =      String(parseFloat(feature.getProperties().properties.split('/')[3]).toFixed(2));
    let nablaStr =   feature.getProperties().properties.split('/')[4]+" mm";
    let viStr =      feature.getProperties().properties.split('/')[5];

    if (viStr.length <= 4) { // Si préanalyse, pas de v
        viStr="-";
    };
    if (wiStr == "NaN") { // si préanalyse ou zi=0%
        wiStr="-";
    };

    if (typeObsStr == "dir" | typeObsStr == "dist") { // Uniq. pour dir. et distances

        // Position du popup au coords du clic
        popup.setPosition(evt.coordinate);

        // Création du popUp
        $(element).popover({
            placement: 'top',
            html: true,
            content: `
            <div class="popUpTitre">Obs n° &nbsp;&nbsp;${noObsStr}</div>
            <div class="popUpTitre">Type &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${typeObsStr}</div>
            <hr>
            <div>zi &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${ziStr}</div>
            <div>wi &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${wiStr}</div>
            <div>∇li &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${nablaStr}</div>
            <div>v &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${viStr}</div>
            `
            });
        
        $(element).popover('show');
    };


  } else { // Si on ne clique pas sur une feature -> coordonnée du clic 
        
        // Position du popup au coords du clic
        popup.setPosition(evt.coordinate);
        evtStr = String(evt.coordinate);
        let E = String(parseFloat(evtStr.split(",")[0]).toFixed(1));
        let N = String(parseFloat(evtStr.split(",")[1]).toFixed(1));
        let coordsStr = E+"&nbsp;&nbsp;"+N;

        // Création du popUp
        $(element).popover({
            placement: 'top',
            html: true,
            content: `
            <div>${coordsStr}</div>
            `
        });

    $(element).popover('show');
  }
});


// Close the popup when the map is moved
map.on('movestart', function () {
  $(element).popover('dispose');
});


