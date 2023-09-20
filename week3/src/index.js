const tableData = document.getElementById("table-data");

async function getTableData() {
    const url1 = "https://statfin.stat.fi/PxWeb/sq/4e244893-7761-4c4f-8e55-7a8d41d86eff";
    const url2 = "https://statfin.stat.fi/PxWeb/sq/5e288b40-f8c8-4f1e-b3b0-61b86ce5c065";


    const datasetPromise1 = await fetch(url1);
    const datasetJSON1 = await datasetPromise1.json();
    const datasetPromise2 = await fetch(url2);
    const datasetJSON2 = await datasetPromise2.json();

    const municipalityArray = Object.values(datasetJSON1.dataset.dimension.Alue.category.label);
    const populationArray = Object.values(datasetJSON1.dataset.value);
    const employmentArray = Object.values(datasetJSON2.dataset.value);

    const arrayLength = municipalityArray.length;

    for (var i = 0; i < arrayLength; i++) {
        let tr = document.createElement("tr");
        let td1 = document.createElement("td");
        let td2 = document.createElement("td");
        let td3 = document.createElement("td");
        let td4 = document.createElement("td");

        td1.innerText = municipalityArray[i];
        td2.innerText = populationArray[i];
        td3.innerText = employmentArray[i];
        td4.innerText = ((employmentArray[i] / populationArray[i]) * 100).toFixed(2) + "%";
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        tableData.appendChild(tr);

        if ((employmentArray[i] / populationArray[i]) * 100 > 45) {
            tr.classList.add("green");
        } else if ((employmentArray[i] / populationArray[i]) * 100 < 25) {
            tr.classList.add("red");
        } else {
            tr.classList.add("default");
        }
    }
}
getTableData();