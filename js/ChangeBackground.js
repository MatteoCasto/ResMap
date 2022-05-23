function changeBackground() {

    /**  
     
    Cette fonction permet de gérer l'affichage des fonds WMTS
    selon le choix de l'utilisateur

    **/
    
    if (document.getElementById("cb_CN").checked == false) {
        map.removeLayer(carteNationale);
    };
    if (document.getElementById("cb_CN").checked == true) {
        map.addLayer(carteNationale);
    };

    if (document.getElementById("cb_MO").checked == false) {
        map.removeLayer(MO_nb);
    };
    if (document.getElementById("cb_MO").checked == true) {
        map.addLayer(MO_nb);
    };

    if (document.getElementById("cb_img").checked == false) {
        map.removeLayer(swissImage);
    };
    if (document.getElementById("cb_img").checked == true) {
        map.addLayer(swissImage);
    };


    if (document.getElementById("cb_relief").checked == false) {
        map.removeLayer(SwissSURFACE3D);
    };
    if (document.getElementById("cb_relief").checked == true) {
        map.addLayer(SwissSURFACE3D);
    };


    if (document.getElementById("cb_none").checked == true) {
        map.removeLayer(swissImage);
        map.removeLayer(carteNationale);
        map.removeLayer(SwissSURFACE3D);
        map.removeLayer(MO_nb);
    };


};