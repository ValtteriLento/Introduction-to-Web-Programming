if (document.readyState !== "loading") {
    console.log("Document is ready!");
    initializeCode();
} else {
    document.addEventListener("DOMContentLoaded", function () {
        console.log("Document is ready after waiting!");
        initializeCode();
    });
}

function initializeCode() {
    const myButton = document.getElementById("my-button");
    const addDataButton = document.getElementById("add-data");

    myButton.addEventListener("click", function () {
        console.log("hello world");

        let newH1 = document.getElementById("h1");

        newH1.innerHTML = "Moi maailma";
    });

    addDataButton.addEventListener("click", function () {
        const myList = document.getElementById("my-list");

        let newListItem = document.createElement("li");

        newListItem.innerHTML = document.getElementById("textarea").value;

        myList.appendChild(newListItem);
    });
}