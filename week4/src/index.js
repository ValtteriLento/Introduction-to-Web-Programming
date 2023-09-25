const showContainer = document.querySelector(".show-container");
const submitDataButton = document.getElementById("submit-data");

async function getShows() {
    const queryParameter = document.getElementById("input-show").value;

    const url = "https://api.tvmaze.com/search/shows?q=" + queryParameter;

    const showPromise = await fetch(url);
    const showJSON = await showPromise.json();

    console.log(showJSON);

    showJSON.forEach((show) => {
        let div1 = document.createElement("div");
        let img = document.createElement("img");
        let div2 = document.createElement("div");
        let h1 = document.createElement("h1");
        let p = document.createElement("p");

        div1.classList = "show-data";
        if (show.show.image != null) {
            img.src = show.show.image.medium;
        } else {
            img.alt = "image";
        }
        div2.classList = "show-info";
        h1.innerText = show.show.name;
        p.innerHTML = show.show.summary;

        div1.appendChild(img);
        div1.appendChild(div2);
        div2.appendChild(h1);
        div2.appendChild(p);
        showContainer.appendChild(div1);
    });
}

submitDataButton.addEventListener("click", function () {
    while (showContainer.hasChildNodes()) {
        showContainer.removeChild(showContainer.lastChild);
    }
    getShows();
});