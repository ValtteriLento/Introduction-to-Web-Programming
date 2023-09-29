if (document.readyState !== "loading") {
    console.log("Document is ready!");
    initializeCode();
  } else {
    document.addEventListener("DOMContentLoaded", function () {
      console.log("Document is ready after waiting!");
      initializeCode();
    });
  }
  async function initializeCode() {

    const fetchData = async () => {
        const url = "https://geo.stat.fi/geoserver/wfs?service=WFS&version=2.0.0&request=GetFeature&typeName=tilastointialueet:kunta4500k&outputFormat=json&srsName=EPSG:4326";
        const res = await fetch(url);
        const data = await res.json();
        //console.log(data);

        initMap(data);
    }

    const fetchPositive = async () => {
        const url = "https://statfin.stat.fi/PxWeb/sq/4bb2c735-1dc3-4c5e-bde7-2165df85e65f";
        const res = await fetch(url);
        const data = await res.json();
        //console.log(data);
        const positiveArray = Object.values(data.dataset.value);

        return positiveArray;
    }

    const fetchNegative = async () => {
        const url = "https://statfin.stat.fi/PxWeb/sq/944493ca-ea4d-4fd9-a75c-4975192f7b6e";
        const res = await fetch(url);
        const data = await res.json();
        //console.log(data);
        const negativeArray = Object.values(data.dataset.value);

        return negativeArray;
    }

    const initMap = (data) => {
        let map = L.map('map', {
            minZoom: -3
        });

        let geoJSON = L.geoJSON(data, {
            onEachFeature: getFeature,
            style: getStyle,
            weight: 2
        }).addTo(map);

        let osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "© OpenStreetMap"
        }).addTo(map);

        map.fitBounds(geoJSON.getBounds());
    };

    const getFeature = (feature, layer) => {
        if (!feature) return;
        const id = feature.id.split("."); // https://www.w3schools.com/jsref/jsref_split.asp
        //console.log(id);
        layer.bindTooltip(feature.properties.name);

        layer.bindPopup(
            `<ul>
                <li>Name: ${feature.properties.name}</li>
                <li>Positive migration: ${positiveArray[id[1]]}</li>
                <li>Negative migration: ${negativeArray[id[1]]}</li>
            </ul>`
        );
    };

    const getStyle = (feature) => {
        const id = feature.id.split(".");
        const positive = positiveArray[id[1]];
        const negative = negativeArray[id[1]];
        let hue = (positive / negative)**3 * 60;

        if (hue > 120) {
            hue = 120;
        }

        return {
            color: "hsl(" + hue + ", 75%, 50%)"
        }
    }

    const positiveArray = await fetchPositive();
    const negativeArray = await fetchNegative();
    fetchData();

}