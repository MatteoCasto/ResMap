// // Script permettant de télécharger un GeoJSON 
// // lors du click sur le bouton "exporter"




// $(".exportBtn").click(function(){


//     let allLayers = map.getLayers();


//     // Création des GeoJSON de chaque couche depuis OL
//     let GeoJSON = new ol.format.GeoJSON().writeFeatures(distanceLayer.getSource().getFeatures(), { 
//       dataProjection: 'EPSG:2056', featureProjection: 'EPSG:2056'
//     });




//     let fileName = "exportResMap.geojson"
//     // Fonction de download
//     function download(content, fileName, contentType) {

//       let a = document.createElement("a");
//       let file = new Blob([content], {type: contentType});
//       a.href = URL.createObjectURL(file);
//       a.download = fileName;
//       a.click();

//     };


// //   download("-", fileName, 'text/plain');

// });