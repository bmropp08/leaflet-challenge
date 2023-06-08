//https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson
let map = L.map("map", {
    center: [0, -40],
    zoom: 3
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson").then(({ features }) => {

    features.forEach(({
        geometry:{coordinates:[lng,lat,depth]}, 
        properties: {mag,place}
    }) => {
        let circle = L.circle([lat, lng], {
            fillColor: `${
                depth>89 ? 'red' :
                depth>69 ? 'orange' :
                depth>49 ? 'lightorange' :
                depth>29 ? 'yellow' :
                depth>9 ? 'lime' : 'green'}`,
            color: "black",
            weight: 1,
            fillOpacity: 0.75,
            radius: mag * 50000
        }).addTo(map);

        circle.bindPopup(`<h3>${place}<br>Magnetude: ${mag}</h3>`);
    });
});

let legend = L.control({ position: "bottomright" });
legend.onAdd = function() {
    let div = L.DomUtil.create("div", "info legend");
    let grades = [-10, 10, 30, 50, 70, 90];
    let colors = ['green', 'lime', 'yellow', 'lightorange', 'orange', 'red'];
    for (let i = 0; i < grades.length; i++) {
        div.innerHTML += `<h4 style="background: ${colors[i]};"> ${grades[i]}${grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+'}</h4>`;
    }
    return div;
};

legend.addTo(map);

