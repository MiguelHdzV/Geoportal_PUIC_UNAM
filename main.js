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

    localidades_source=new ol.source.Vector({
        url: 'http://52.36.216.101:8080/geoserver/ne/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=ne%3Alocalidades&maxFeatures=10000&outputFormat=application%2Fjson',
        format: new ol.format.GeoJSON() ,
        crossOrigin: 'anonymous'
      });

    //Capas Geoserver

    var Localidades = new ol.layer.Vector({
        name: 'Localidades',
        source: localidades_source,

      
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




    // Escuchador de eventos para los checkbox de Geoserver

    var locCheckbox = document.getElementById('01loc-checkbox');
        locCheckbox.addEventListener('change', function() {
    Localidades.setVisible(this.checked);
    })
    var vialCheckbox = document.getElementById('01vial-checkbox');
        vialCheckbox.addEventListener('change', function() {
    Vialidades.setVisible(this.checked);
    })


//Activar Leyenda en contenedor mediante checkbox
var select = new ol.interaction.Select({
    hitTolerance: 5,
    multi: true,
    condition: ol.events.condition.singleClick,
    
  });
  map1.addInteraction(select);

  // Select control
  var popup = new ol.Overlay.PopupFeature({
    popupClass: 'default anim',
    select: select,
    canFix: true,
    keepSelection: false,
    
  })

  map1.addOverlay (popup)

};






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




