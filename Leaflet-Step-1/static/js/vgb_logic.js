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
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
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










// loadJSON method to open the JSON file.
function loadJSON(path, success, error) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          success(JSON.parse(xhr.responseText));
        }
        else {
          error(xhr);
        }
      }
    };
    xhr.open('GET', path, true);
    xhr.send();
  }

  loadJSON("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson", myData,'jsonp');
  
  function myData(Data)
  {
  
    // Output only the details on the first post
    console.log(Data[0]);
  
    // output the details of first three posts
    console.log("First three posts");
    for(var i=0; i<3; i=i+1)
  {
    console.log(Data[i]);
  } 
  // output the id field of first five elements. 
  console.log("First five ID");
  for(var i=0; i<5; i=i+1)
  {
    console.log(Data[i].id);
  }}

  
  var geojsonFeature = {
    "type": "Feature",
    "properties": {
        "name": "Coors Field",
        "amenity": "Baseball Stadium",
        "popupContent": "This is where the Rockies play!"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-104.99404, 39.75621]
    }
};

L.geoJSON(geojsonFeature).addTo(map);

var myLayer = L.geoJSON().addTo(map);
myLayer.addData(geojsonFeature);

var states = [{
    "type": "Feature",
    "properties": {"party": "Republican"},
    "geometry": {
        "type": "Polygon",
        "coordinates": [[
            [-104.05, 48.99],
            [-97.22,  48.98],
            [-96.58,  45.94],
            [-104.03, 45.94],
            [-104.05, 48.99]
        ]]
    }
}, {
    "type": "Feature",
    "properties": {"party": "Democrat"},
    "geometry": {
        "type": "Polygon",
        "coordinates": [[
            [-109.05, 41.00],
            [-102.06, 40.99],
            [-102.03, 36.99],
            [-109.04, 36.99],
            [-109.05, 41.00]
        ]]
    }
}];

L.geoJSON(states, {
    style: function(feature) {
        switch (feature.properties.party) {
            case 'Republican': return {color: "#ff0000"};
            case 'Democrat':   return {color: "#0000ff"};
        }
    }
}).addTo(map);

var geojsonMarkerOptions = {
    radius: 8,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};

L.geoJSON(someGeojsonFeature, {
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, geojsonMarkerOptions);
    }
}).addTo(map);

// Once we get a response, send the data.features object to the createFeatures function
createFeatures(data.features);

});

function createFeatures(quakeData) {

  // Check on coordinates and magnitude data 
  console.log(quakeData[0].geometry.coordinates[1]);
  console.log(quakeData[0].geometry.coordinates[0]);
  console.log(quakeData[0].properties.mag);

  // Determine sizes for each markers on the map
  function size(magnitude) {
    return magnitude * 40000;
    }

// Loop thru the features and create one marker for each place object
function colors(magnitude) {
  var color = "";
  if (magnitude <= 1) {
    return color = "#83FF00";
  }
  else if (magnitude <= 2) {
    return color = "#FFEC00";
  }
  else if (magnitude <= 3) {
    return color = "#ffbf00";
  }
  else if (magnitude <= 4) {
    return color = "#ff8000";
  }
  else if (magnitude <= 5) {
    return color = "#FF4600";
  }
  else if (magnitude > 5) {
    return color = "#FF0000";
  }
  else {
    return color = "#ff00bf";
  }
}

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" +
      "<hr> <p> Earthquake Magnitude: " + feature.properties.mag + "</p>")
  }

  var quakes = L.geoJSON(quakeData, {

    onEachFeature: onEachFeature,

    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    pointToLayer: function (feature, coordinates) {
      // Determine Marker Colors, Size, and Opacity for each earthquake.
      var geoMarkers = {
        radius: size(feature.properties.mag),
        fillColor: colors(feature.properties.mag),
        fillOpacity: 0.30,
        stroke: true,
        weight: 1
      }
      return L.circle(coordinates, geoMarkers);
    }
  })

  // Sending our earthquakes layer to the createMap function
  createMap(quakes);
}

// Create function for earthquake map
function createMap(quakes) {

//   // Define streetmap and darkmap layers
//   var outdoormap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//     attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
//     tileSize: 512,
//     maxZoom: 18,
//     zoomOffset: -1,
//     id: "mapbox/streets-v11",
//     accessToken: API_KEY
//   });

//   var grayscalemap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//   attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
//   maxZoom: 18,
//   id: "light-v10",
//   accessToken: API_KEY
//   });

//   var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//     attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
//     maxZoom: 18,
//     id: "dark-v10",
//     accessToken: API_KEY
//   });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Outdoor Map": outdoormap,
    "Grayscale Map": grayscalemap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };


  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [outdoormap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);


  // Set up the legend.
  // Create a legend to display info about our map.
  var legend = L.control({ 
    position: 'bottomright' 
  });

  // When the layer control is added, insert a div with the class of "info legend".
  legend.onAdd = function () {

    var div = L.DomUtil.create('div', 'info legend'),
        magnitude = [0, 1, 2, 3, 4, 5];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < magnitude.length; i++) {
      div.innerHTML +=
        '<i style="background:' + colors(magnitude[i] + 1) + '"></i> ' +
        magnitude[i] + (magnitude[i + 1] ? '&ndash;' + magnitude[i + 1] + '<br>' : '+');
    }

    return div;
  };

  // Add the info legend to the map.
  legend.addTo(myMap);

}

var div = L.DomUtil.create("div", "legend");
var depth = [9, 29, 49, 69, 89, 500];
var labels = ["<10", "10-30", "30-50", "50-70", "70-90", "90+"];
div.innerHTML = '<div>Depth (km)</div>';
for (var i = 0; i < depth.length; i++){
  div.innerHTML += '<i style="background:' + legendColor(depth[i]) + '">&nbsp;&nbsp;&nbsp;&nbsp;</i>&nbsp;'+
                  labels[i] + '<br>';
}
return div;







// geojson url
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// define the createMap function
function createMap(response) {

    // Initial parameters to create map
    var centerCoordinates = [37.0902, -110.7129];
    var mapZoom = 5;

    // Create the map object with options
    var myMap = L.map("map", {
        center: centerCoordinates,
        zoom: mapZoom
    });

    // Create the tile layer that will be the background of our map
    L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/light-v10",
        accessToken: API_KEY
    }).addTo(myMap);

    // Create a GeoJSON layer containing the features array on the response object
    L.geoJSON(response, {

        // use pointToLayer to create circle markers for each data's coordinates
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng, {
                radius: markerSize(feature.properties.mag),
                fillColor: magColor(feature.properties.mag),
                color: "#000",
                weight: 0.3,
                opacity: 0.5,
                fillOpacity: 1
            });
        },

        // Run the onEachFeature function once for each piece of data in the array
        onEachFeature: onEachFeature
    }).addTo(myMap)

    // Binding a pop-up to each layer
    function onEachFeature(feature, layer) {

        // date formatter for popup
        var format = d3.timeFormat("%d-%b-%Y at %H:%M");

        layer.bindPopup(`<strong>Place: </strong> ${feature.properties.place}<br><strong>Time: </strong>${format(new Date(feature.properties.time))}<br><strong>Magnitude: </strong>${feature.properties.mag}`);
    };

    // Set up the legend
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");
        var magnitudes = [0, 1, 2, 3, 4, 5];
        var labels = [];
        var legendInfo = "<h5>Magnitude</h5>";

        div.innerHTML = legendInfo;

        // go through each magnitude item to label and color the legend
        // push to labels array as list item
        for (var i = 0; i < magnitudes.length; i++) {
            labels.push('<li style="background-color:' + magColor(magnitudes[i] + 1) + '"> <span>' + magnitudes[i] + (magnitudes[i + 1] ? '&ndash;' + magnitudes[i + 1] + '' : '+') + '</span></li>');
        }

        // add each label list item to the div under the <ul> tag
        div.innerHTML += "<ul>" + labels.join("") + "</ul>";

        return div;
    };

    // Adding legend to the map
    legend.addTo(myMap);

}; // end createMap function

// Define a markerSize function that will give each city a different marker radius based on earthquake magnitude
function markerSize(magnitude) {
    return magnitude * 5;
}

// Define a color function that sets the colour of a marker based on earthquake magnitude
function magColor(magnitude) {
    if (magnitude <= 1) {
        return "#a7fb09"
    } else if (magnitude <= 2) {
        return "#dcf900"
    } else if (magnitude <= 3) {
        return "#f6de1a"
    } else if (magnitude <= 4) {
        return "#fbb92e"
    } else if (magnitude <= 5) {
        return "#faa35f"
    } else {
        return "#ff5967"
    }
};

// Perform an API call to the USGS earthquakes API to get earthquake information. 
d3.json(url, function(response) {

    // Call createMap with response.features
    createMap(response.features);

});

//   var map = L.map('map').setView([122.4938,9.0899,], 10);
// L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     maxZoom: 19,
//     attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
// }).addTo(map);
// var marker = L.marker([51.5, -0.09]).addTo(map);
// var circle = L.circle([51.508, -0.11], {
//     color: 'red',
//     fillColor: '#f03',
//     fillOpacity: 0.5,
//     radius: 500
// }).addTo(map);
// var polygon = L.polygon([
//     [51.509, -0.08],
//     [51.503, -0.06],
//     [51.51, -0.047]
// ]).addTo(map);

// marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
// circle.bindPopup("I am a circle.");
// polygon.bindPopup("I am a polygon.");