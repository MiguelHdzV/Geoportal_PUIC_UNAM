window.onload = init;

function init (){
    
    //Vista General del Mapa
    const map1 = new ol.Map ({
        view: new ol.View ({
            center: [-11317884.540989216, 2702125.263342199],
            zoom: 5.2,
            maxZoom: 14,
            minZoom: 5,
        }),
    //Elemento objetivo en el HTML    
        target: 'js-Mapa'
    })


    


    //Mapa de origen OpenStreetMaps
    const OSMS = new ol.layer.Tile({
        source: new ol.source.OSM(),
        visible: true,
        title: 'OSM'
    })

    //Mapa de origen ESRI
    const ESRI = new ol.layer.Tile({
        source: new ol.source.XYZ({
            url: 'http://server.arcgisonline.com/ArcGIS/rest/services/' +
                 'NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}',
                 maxZoom: 19
        }),
        visible: false,
        title: 'ESRI',
        })

    //Mapa de origen Google Maps
    const GMaps = new ol.layer.Tile({
        source: new ol.source.XYZ({
            url:  'http://www.google.cn/maps/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z}',
            maxzoom: 21,
        }),
        visible: false,
        title: 'GMaps'
        })

    //Mapa de origen Google Satelital
    const Satelital = new ol.layer.Tile({
        source: new ol.source.XYZ({
            url:  'http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}',
            maxzoom: 21,
        }),
        visible: false,
        title: 'GSatelital',
    })

    //Mapa de origen Google Terreno
    const Terreno = new ol.layer.Tile({
        source: new ol.source.XYZ({
            url:  'http://www.google.cn/maps/vt?lyrs=p@189&gl=cn&x={x}&y={y}&z={z}',
            maxzoom: 21,
        }),
        visible: false,
        title: 'Terrain',
    })



    //Grupo de Capas Base
    const GrupoCapasBase = new ol.layer.Group({
        layers:[
             OSMS, ESRI, GMaps, Satelital, Terreno
        ]
    })

    map1.addLayer(GrupoCapasBase);


    var localidades_source = new ol.source.TileWMS({
        url: 'http://52.36.216.101:8080/geoserver/ne/wms',
        params: {'LAYERS': 'ne:localidades', 'TILED': true},
        serverType: 'geoserver'
        })
    var Localidades = new ol.layer.Tile({
        source: localidades_source,
        title: 'Localidades' ,
        visible: false,       
    })


    var Vialidades = new ol.layer.Tile({
        source: new ol.source.TileWMS({
            url: 'http://localhost:8080/geoserver/edomex/wms',
            params: {'LAYERS': 'edomex:vialidades', 'TILED': true},
            transparent: false,
            serverType: 'geoserver'
            }),
        visible: false,
        title: 'Vialidades'        
    })

    //Grupo de Capas Geoserver
    const GrupoCapasGeoserver = new ol.layer.Group({
        layers:[
             Localidades, Vialidades
        ]
    })

    //Agregar al mapa capas de Geoserver
    map1.addLayer(GrupoCapasGeoserver);

    var popup = new ol.Overlay.Popup();
    map1.addOverlay(popup);


    // Escuchador de eventos para los checkbox de Geoserver

    
    // Escuchador de eventos para los checkbox de Geoserver
    var anpCheckbox = document.getElementById('01anp-checkbox');
        anpCheckbox.addEventListener('change', function() {
    ANP.setVisible(this.checked);
    })
    var locCheckbox = document.getElementById('01loc-checkbox');
        locCheckbox.addEventListener('change', function() {
    Localidades.setVisible(this.checked);
    })
    var vialCheckbox = document.getElementById('01vial-checkbox');
        vialCheckbox.addEventListener('change', function() {
    Vialidades.setVisible(this.checked);
    })




//Agregar popup
// map1.on('singleclick', function(evt) {


//     popup.show(evt.coordinate,"lol");    
 
//  });

 map1.on('singleclick', function (evt) {
    popup.hide()
    var feature = Localidades.getSource().getFeatureInfoUrl(
      evt['coordinate'],
      map1.getView().getResolution(),
      'EPSG:3857',
      {'INFO_FORMAT': 'application/json'}
    );
    if (feature) {
        fetch(feature)
    .then(response => response.json()) // Parse the response as JSON
    .then(data => {
        //console.log(data.features[0].properties); // Handle the data
        info=geojsonToTable(data.features[0].properties);
        popup.show(evt.coordinate,info);
    })
    
        
      //info= geojsonToTable(feature);
      //popup.show(evt.coordinate,info);   
    }})


    
};



function FunANP() {
    var x = document.getElementById("01ANP");
    if (x.style.display === "none") {
    x.style.display = "block";
    } else {
    x.style.display = "none";
    }
}



function FunLocalidades() {
    var x = document.getElementById("01Localidades");
    if (x.style.display === "none") {
    x.style.display = "block";
    } else {
    x.style.display = "none";
    }
}

function FunVialidades() {
    var x = document.getElementById("01Vialidades");
    if (x.style.display === "none") {
    x.style.display = "block";
    } else {
    x.style.display = "none";
    }
}




function geojsonToTable(geojsonData) {
    var html = '<table border="1">';
    html += '<tr><th>Propiedad</th><th>Valor</th></tr>';
    
    for (var key in geojsonData) {
        var feature = key;
        var name = geojsonData[key];
        
        html += '<tr><td>' + feature + '</td><td>' + name  + '</td></tr>';
    }
    
    html += '</table>';
    return html;
}