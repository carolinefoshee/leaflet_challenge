// import data
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"

// Create function to pull all functions together
function mapFeatures(data) {
    // include popups
    function popups(feature, layer) {
        layer.bindPopup(`Location: ${feature.properties.place} <br> Magnitude: ${feature.properties.mag} <br> Depth: ${feature.geometry.coordinates[2]}`);
    };

    var earthquakes = L.geoJSON(data, {
        onEachFeature: popups,
        pointToLayer: circles
    });

    makeMap(earthquakes);
};

// generating circles on map
function circles(feature, latlng) {
    var mag = feature.properties.mag;
    var depth = feature.geometry.coordinates[2];
    return L.circle(latlng, {
        fillOpacity: 0.5,
        color: setColors(depth),
        fillColor: setColors(depth),
        radius: mag * 20000
    });
};

// setting colors based on depth
function setColors(depth) {
    if (depth < 10) return "purple";
    else if (depth < 30) return "green";
    else if (depth < 50) return "green";
    else if (depth < 70) return "yellow";
    else if (depth < 90) return "orange";
    else return "red";
};

// create map
function makeMap(earthquakes) {
    let myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 5
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href=https://www.openstreetmap.org/copyright>OpenStreetMap</a> contributors'
    }).addTo(myMap);

    // create legend
    var legend = L.control({position: "bottomright"});
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend"),
        depths = [-10, 10, 30, 50, 70, 90];

        // add colors to legend 
        for (var i = 0; i < depths.length; i++) {
            div.innerHTML +=
                '<i style="background:' + setColors(depths[i] + 1) + '"></i> ' +
                depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
        }
        return div;
    }       
    legend.addTo(myMap);
};

// use my earthquake data
d3.json(url, function(data) {
    console.log(data.features);
});

mapFeatures(data.features);
