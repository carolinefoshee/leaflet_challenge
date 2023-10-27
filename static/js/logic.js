// Import data
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// Use D3 to fetch earthquake data
d3.json(url).then(function(data) {
    mapFeatures(data.features);
});

// Define a function to set colors based on depth
function setColors(depth) {
    if (depth < 10) return "purple";
    else if (depth < 30) return "green";
    else if (depth < 50) return "blue"; 
    else if (depth < 70) return "yellow";
    else if (depth < 90) return "orange";
    else return "red";
}

// Create a function to add popups to each feature
function onEachFeature(feature, layer) {
    layer.bindPopup(`Location: ${feature.properties.place} <br> Magnitude: ${feature.properties.mag} <br> Depth: ${feature.geometry.coordinates[2]}`);
}

// Create a function to generate circles on the map
function pointToLayer(feature, latlng) {
    var circleMarker = L.circle(latlng, {
        radius: feature.properties.mag * 20000,
        fillColor: setColors(feature.geometry.coordinates[2]),
        fillOpacity: 0.7,
        color: "black",
        weight: 0.5
    });
    return circleMarker;
}

// Create a function to add the earthquake data to the map
function mapFeatures(data) {
    var earthquakes = L.geoJSON(data, {
        onEachFeature: onEachFeature,
        pointToLayer: pointToLayer
    });

    makeMap(earthquakes);
}

// Create the map
function makeMap(earthquakes) {
    var myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 5
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href=https://www.openstreetmap.org/copyright>OpenStreetMap</a> contributors'
    }).addTo(myMap);

    earthquakes.addTo(myMap);

    // Create a legend
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");
        var depths = [-10, 10, 30, 50, 70, 90];
        for (var i = 0; i < depths.length; i++) {
            div.innerHTML +=
                '<i style="background:' + setColors(depths[i] + 1) + '"></i> ' +
                depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
        }
        return div;
    };

    legend.addTo(myMap);
}
