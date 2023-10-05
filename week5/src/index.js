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

        return data;
    }

    const fetchNegative = async () => {
        const url = "https://statfin.stat.fi/PxWeb/sq/944493ca-ea4d-4fd9-a75c-4975192f7b6e";
        const res = await fetch(url);
        const data = await res.json();
        //console.log(data);

        return data;
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
        const areaCode = "KU" + feature.properties.kunta;
        const index = positiveData.dataset.dimension.Tuloalue.category.index[areaCode];
        layer.bindTooltip(feature.properties.name);

        layer.bindPopup(
            `<ul>
                <li>Name: ${feature.properties.name}</li>
                <li>Positive migration: ${positiveData.dataset.value[index]}</li>
                <li>Negative migration: ${negativeData.dataset.value[index]}</li>
            </ul>`
        );
    };

    const getStyle = (feature) => {
        const areaCode = "KU" + feature.properties.kunta;
        const index = positiveData.dataset.dimension.Tuloalue.category.index[areaCode];
        const positive = positiveData.dataset.value[index];
        const negative = negativeData.dataset.value[index];
        let color;

        if (((positive / negative)**3) * 60 > 120) {
            color = "hsl(" + 120 + ", 75%, 50%)";
        } else {
            color = "hsl(" + ((positive / negative)**3) * 60 + ", 75%, 50%)";
        }

        return {
            color: color
        }
    }

    const positiveData = await fetchPositive();
    const negativeData = await fetchNegative();
    fetchData();

}