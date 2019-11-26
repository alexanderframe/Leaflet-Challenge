const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson'

// Grab geoJSON data
d3.json(url, function(data) {
    console.log(data.features.length);
    console.log(data);
    createFeatures(data.features);
});

// Create color function for circles based on magnitude
function circleColor(magnitude){
    let color = '';
    if (magnitude >= 5) {
        color = 'tomato'
    }
    else if (magnitude >=4) {
        color = 'lightSalmon'
    }
    else if (magnitude >=3) {
        color = 'goldenRod'
    }
    else if (magnitude >=2) {
        color = 'yellow'
    }
    else if (magnitude >=1) {
        color = 'greenYellow'
    }
    else {
        color = 'chartreuse'
    }
    return color
};


// Function to create popups and earthquake circle markers
function createFeatures(earthquakeData) {
    
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" + "<h3>" + feature.properties.mag + " Magnitude</h3>");
    }

    let earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng, {
                radius: Math.abs(feature.properties.mag * 5), // Absolute value handles any negative magnitudes
                fillColor: circleColor(feature.properties.mag),
                fillOpacity: 0.5,
                color: 'white',
                weight: 1 
            })
        }
    });

    // Send our created markers/popups to the map
    createMap(earthquakes);
};

// Function to create the map with multiple base layers
function createMap(earthquakes) {
    // Define map layers
    const outdoorsmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
            attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
            id: "mapbox.outdoors",
            accessToken: "pk.eyJ1IjoiYWZyYW1lOTUiLCJhIjoiY2sycnF3N3R1MGM2bTNtcTY1N3V6Yzh4biJ9.MWKwJaBuQBdp-GG-z0kqUQ"
    });

    const satmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
            attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
            id: "mapbox.satellite",
            accessToken: "pk.eyJ1IjoiYWZyYW1lOTUiLCJhIjoiY2sycnF3N3R1MGM2bTNtcTY1N3V6Yzh4biJ9.MWKwJaBuQBdp-GG-z0kqUQ"
    });

    const darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
            attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
            id: "mapbox.dark",
            accessToken: "pk.eyJ1IjoiYWZyYW1lOTUiLCJhIjoiY2sycnF3N3R1MGM2bTNtcTY1N3V6Yzh4biJ9.MWKwJaBuQBdp-GG-z0kqUQ"
    });

    const lightmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
            attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
            id: "mapbox.light",
            accessToken: "pk.eyJ1IjoiYWZyYW1lOTUiLCJhIjoiY2sycnF3N3R1MGM2bTNtcTY1N3V6Yzh4biJ9.MWKwJaBuQBdp-GG-z0kqUQ"
    });

    // Create baseMaps object
    const baseMaps = {
        'Outdoors': outdoorsmap,
        'Satellite': satmap,
        'Dark': darkmap,
        'Light': lightmap
    };

    const overlayMaps = {
        Earthquakes: earthquakes
    };

    // Create myMap variable
    const myMap = L.map('map', {
        center: [39, -105],
        zoom: 2,
        layers: [satmap, earthquakes] // Display sat map on load
    });

    // Create layer control and add to map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    // Create legend and add to map
    const legend = L.control({position: 'bottomright'});
    legend.onAdd = function(map) {
        let div = L.DomUtil.create('div', 'legend');
        div.innerHTML += '<i style="background: tomato"></i><span>5+</span><br>';
        div.innerHTML += '<i style="background: lightSalmon"></i><span>4-5</span><br>';
        div.innerHTML += '<i style="background: goldenRod"></i><span>3-4</span><br>';
        div.innerHTML += '<i style="background: yellow"></i><span>2-3</span><br>';
        div.innerHTML += '<i style="background: greenYellow"></i><span>1-2</span><br>';
        div.innerHTML += '<i style="background: chartreuse"></i><span>0-1</span><br>';

        return div;
    };
    legend.addTo(myMap);
};