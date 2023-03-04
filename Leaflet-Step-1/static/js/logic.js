// API Key
const API_KEY = "pk.eyJ1IjoiY2hleWVubmVwYXJyb3R0IiwiYSI6ImNraGJhZnp6czBkbG0ycnNhMWozcGpsYWMifQ.lL6x_cnw_ya4MtHSvTJ_gA"
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(url, function(response) {
  createFeatures(response.features);
});
function magColors(depth){
  if (depth>90){
    return "red"
  }
  else if (depth >70){
    return "orangeRed"
  }
  else if (depth >50){
    return "orange"
  }
  else if (depth >30){
    return "yellow"
  }
  else if (depth >10){
    return "yellowGreen"
  }
  else 
    return "lime"
};

function markerSize(magnitude){
  return magnitude * 40000
};

//Get place and depth of earthquake
function createFeatures(quakeData){

  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" +feature.properties.place + "</h3>,hr><p>" + feature.geometry.coordinates[2] + "<h3>" + feature.properties.mag + "</h3>");
  }

  var quakes = L.geoJSON(quakeData, {
    pointToLayer: function (feature, latlng){
      return new L.circle(latlng, 
        {
          radius: markerSize(feature.properties.mag),
          fillColor: magColors(feature.geometry.coordinates[2]),
          color: "white",
          fillOpacity: .5,
          opacity: .75,
          stroke: true,
          weight: .5
        })
    },
    onEachFeature: onEachFeature
  });

  createMap(quakes);
}

function createMap(quakes){
   
// Define tileLayer
  var tileLayer = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });

    // Create map
   var Map = L.map("map", {
    center: [
      37.09, -95.71],
    zoom: 2,
    layers: [tileLayer, quakes]
  });

 var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        depth = [-10, 10, 30, 50, 70, 90],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < depth.length; i++) {
        div.innerHTML +=
            '<i style="background:' + magColors(depth[i] + 1) + '"></i> ' +
            depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
    }

    return div;
};
legend.addTo(Map);}