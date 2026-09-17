const API_URL = "http://127.0.0.1:8000";

let assets = [];
let editingIndex = -1;


// =========================
// Load Assets
// =========================

async function loadAssets() {

    try {

        const response = await fetch(`${API_URL}/assets`);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        assets = await response.json();

        console.log("Assets loaded:", assets);

        renderAssets();

    } catch (error) {

        console.error("Failed to load assets:", error);

        alert("Unable to connect to Smart IT server.");

    }
}


// =========================
// Add Asset
// =========================

async function addAsset() {

    const name =
        document.getElementById("assetName").value.trim();

    const type =
        document.getElementById("assetType").value.trim();

    const status =
        document.getElementById("assetStatus").value;


    if (!name || !type) {

        alert("Please fill all fields.");

        return;
    }


    const assetData = {

        asset_id:
            "AST-" +
            String(Date.now()).slice(-6),

        name: name,

        type: type,

        status: status,

        location: "IT Department"

    };


    try {

        const response = await fetch(
            `${API_URL}/assets`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(assetData)
            }
        );


        const data = await response.json();


        if (!response.ok) {

            throw new Error(
                data.detail || "Failed to add asset"
            );

        }


        alert("Asset saved successfully.");


        document.getElementById("assetName").value = "";

        document.getElementById("assetType").value = "";

        document.getElementById("assetStatus").value = "Active";


        await loadAssets();


    } catch (error) {

        console.error("Error adding asset:", error);

        alert(error.message);

    }
}


// =========================
// Render Assets
// =========================

function renderAssets() {

    const table =
        document.getElementById("assetsTable");


    table.innerHTML = "";


    assets.forEach((asset, index) => {

        table.innerHTML += `

            <tr>

                <td>${asset.asset_id}</td>

                <td>${asset.name}</td>

                <td>${asset.type}</td>

                <td>${asset.status}</td>

                <td>

                    <button
                        type="button"
                        onclick="editAsset(${index})">
                        Edit
                    </button>

                    <button
                        type="button"
                        onclick="deleteAsset(${index})">
                        Delete
                    </button>

                </td>

            </tr>

        `;

    });
}


// =========================
// Edit Asset
// =========================

async function editAsset(index) {

    const asset = assets[index];


    if (!asset) {

        alert("Asset not found.");

        return;
    }


    console.log("Editing asset:", asset);

    console.log("Database ID:", asset.id);


    const name = prompt(
        "Asset Name:",
        asset.name
    );


    if (name === null) {
        return;
    }


    const type = prompt(
        "Asset Type:",
        asset.type
    );


    if (type === null) {
        return;
    }


    const status = prompt(
        "Status:",
        asset.status
    );


    if (status === null) {
        return;
    }


    const updatedAsset = {

        asset_id: asset.asset_id,

        name: name.trim(),

        type: type.trim(),

        status: status.trim(),

        location:
            asset.location || "IT Department"

    };


    try {

        const response = await fetch(
            `${API_URL}/assets/${asset.id}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(updatedAsset)
            }
        );


        const data = await response.json();


        console.log(
            "Update response:",
            response.status,
            data
        );


        if (!response.ok) {

            throw new Error(
                data.detail || "Failed to update asset"
            );

        }


        alert("Asset updated successfully.");


        await loadAssets();


    } catch (error) {

        console.error(
            "Error updating asset:",
            error
        );

        alert(error.message);

    }
}


// =========================
// Delete Asset
// =========================

async function deleteAsset(index) {

    const asset = assets[index];


    if (!asset) {

        alert("Asset not found.");

        return;
    }


    console.log("Deleting asset:", asset);

    console.log("Database ID:", asset.id);


    const confirmed = confirm(
        `Are you sure you want to delete ${asset.name}?`
    );


    if (!confirmed) {

        return;
    }


    try {

        const response = await fetch(
            `${API_URL}/assets/${asset.id}`,
            {
                method: "DELETE"
            }
        );


        const data = await response.json();


        console.log(
            "Delete response:",
            response.status,
            data
        );


        if (!response.ok) {

            throw new Error(
                data.detail || "Failed to delete asset"
            );

        }


        alert("Asset deleted successfully.");


        await loadAssets();


    } catch (error) {

        console.error(
            "Error deleting asset:",
            error
        );

        alert(error.message);

    }
}


// =========================
// Search
// =========================

function searchAssets() {

    const keyword =
        document
            .getElementById("searchAsset")
            .value
            .toLowerCase();


    const rows =
        document.querySelectorAll(
            "#assetsTable tr"
        );


    rows.forEach(row => {

        row.style.display =
            row.innerText
                .toLowerCase()
                .includes(keyword)
                ? ""
                : "none";

    });

}


// =========================
// Start Application
// =========================

loadAssets();