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


    // // Create a new marker cluster group.
    // var markers = L.marker();

    // // Loop through the data.
    // for (var i = 0; i < response.length; i++) {
  
    //   // Set the data location property to a variable.
    //   var location = response[i].location;
  
    //   // Check for the location property.
    //   if (location) {
  
    //     // Add a new marker to the cluster group, and bind a popup.
    //     markers.addLayer(L.marker([location.coordinates[1], location.coordinates[0]])
    //       .bindPopup(response[i].descriptor));
    //   }
  
    // }
  
    // var magnitude = quakeData[i].properties.mag
    // var lat = quakeData[i].geometry.coordinates[1]
    // var lng = quakeData[i].geometry.coordinates[0]
    // var latlng = [lat,lng]
    // var depth = quakeData[i].geometry.coordinates[2]
    // var color = "";

  // Different marker based on earthquake magnitude
function markerSize(magnitude) {
    return magnitude * 5;
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
         // Add our marker cluster layer to the map.
    // myMap.addLayer(markers);
  
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






// // API url
// var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


// // Read url with d3 library
// d3.json(url).then(function(data){

//   // Get response, send the data.features object to the createEarthquakes function
//   createEarthquakes(data.features);
// });

// function createEarthquakes(quakeData) {

//   var quakeMarkers = [];

//   for (var i = 0; i < quakeData.length; i++) {

//     var magnitude = quakeData[i].properties.mag
//     var lat = quakeData[i].geometry.coordinates[1]
//     var lng = quakeData[i].geometry.coordinates[0]
//     var latlng = [lat,lng]
//     var depth = quakeData[i].geometry.coordinates[2]
//     var color = "";
//     if (depth < 10){
//       color = "yellow"
//     }
//     else if (depth < 30) {
//       color = "lime"
//     }
//     else if (depth < 50) {
//       color = "orange"
//     }
//     else if (depth < 70) {
//       color = "red"
//     }
//     else if (depth < 90) {
//       color = "purple"
//     }
//     else {
//       color = "maroon"
//     }
//     quakeMarkers.push(
//       L.circle(latlng, {
//         stroke: false,
//         fillOpacity: 0.5,
//         color: "white",
//         fillColor: color,
//         radius: magnitude*50000
//       }).bindPopup("<h3>" + quakeData[i].properties.title +
//           "</h3><hr><p>" + new Date(quakeData[i].properties.time) + "</p>")
//     )
//   }
//     //mapping
//     var map = L.map('map').setView([-66.9438333333333, 17.816], 8.27);


//     // Create a legend to display information about our map
//     var legend = L.control({
//         position: "bottomright",
//         fillColor: "white"
//       });
      
//       // When the layer control is added, insert a div with the class of "legend"
//       legend.onAdd = function() {
   
//       };
//       // Add the legend to the map
//       legend.addTo(map);
//     }