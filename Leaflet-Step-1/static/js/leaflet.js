//API KEY
const API_KEY = "pk.eyJ1IjoiY2hleWVubmVwYXJyb3R0IiwiYSI6ImNraGJhZnp6czBkbG0ycnNhMWozcGpsYWMifQ.lL6x_cnw_ya4MtHSvTJ_gA"
// Store our API endpoint as url.
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the URL
d3.json(url,function (data) {
    console.log(data)
 
 
    // Once we get a response, createFeatures function.
  createFeatures(data.features);
 
});

function createFeatures(quakeData) {

  
  //Popup that describes the place and time of the earthquake.
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}<hr>${geometry.coordinates.depth}<hr>${feature.properties.mag}</p>`);
  }

  // Run the onEachFeature function
  var quakes = L.geoJSON(quakeData, {
    pointToLayer: function (feature,latlng)
    {return new L.circle(latlng,
        {
            radius: markerSize (feature.properties.mag),
                fillColor: magColor(feature.geometry.coordinates[2]),
                color: "red"
                
        })},


    onEachFeature: onEachFeature
  });


  // Different marker based on earthquake magnitude
function markerSize(magnitude) {
    return magnitude * 40000;
}

// Define a color function that sets the color of a marker based on earthquake magnitude
function magColor(depth) {
    if (depth >90){
        color = "red"
      }
      else if (depth > 70) {
        color = "orange-red"
      }
      else if (depth > 50) {
        color = "light orange"
      }
      else if (depth > 30) {
        color = "yellow"
      }
      else if (depth  > 10) {
        color = "yellow-green"
      }
      else { 
        color = "lime"
      }
  
};

  // Send our earthquakes layer to the createMap function/
  createMap(quakes);
}

function createMap(quakes) {

  // Create the base layers.
  var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

//   // Create a baseMaps object.
//   var baseMaps = {
//     "Street Map": street,
//     "Topographic Map": topo
//   };

//   // Create an overlay object to hold our overlay.
//   var overlayMaps = {
//     Earthquakes: quakes
//   };

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  var Map = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [street, quakes]
  });

  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  legend = L.control.layers({position:'bottomright'
    // collapsed: false
  });
  legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend'),
        depth = [-10, 10, 30, 50, 70, 90],
        labels = [];
    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < depth.length; i++) {
        div.innerHTML +=
            '<i style="background:' + magColor(depth[i] + 1) + '"></i> ' +
            depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
    }
    return div;
};
legend.addTo(Map);
}