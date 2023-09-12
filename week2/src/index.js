const submitDataButton = document.getElementById("submit-data");
const emptyTableButton = document.getElementById("empty-table");

submitDataButton.addEventListener("click", function (event) {
    const table = document.getElementById("table");

    let newTableRow = document.createElement("tr");
    let newUsername = document.createElement("td");
    let newEmail = document.createElement("td");
    let newAdmin = document.createElement("td");

    table.appendChild(newTableRow);

    newUsername.innerText = document.getElementById("input-username").value;
    table.lastChild.appendChild(newUsername);

    newEmail.innerText = document.getElementById("input-email").value;
    table.lastChild.appendChild(newEmail);

    if (document.getElementById("input-admin").checked) {
        newAdmin.innerText = "X";
    } else {
        newAdmin.innerText = "-";
    }
    table.lastChild.appendChild(newAdmin);

    event.preventDefault();
});

emptyTableButton.addEventListener("click", function () {
    const table = document.getElementById("table");

    while (table.hasChildNodes()) {
        table.removeChild(table.lastChild);
    }
});