const API_URL = "http://127.0.0.1:8000";

let assets = [];
let tickets = [];


// =========================
// Date & Time
// =========================

function updateDateTime() {

    const now = new Date();

    const dateElement =
        document.getElementById("dateTime");

    if (dateElement) {

        dateElement.textContent =
            now.toLocaleString();

    }
}


// =========================
// Load Dashboard
// =========================

async function loadDashboard() {

    try {

        const [
            assetsResponse,
            ticketsResponse,
            riskResponse
        ] = await Promise.all([

            fetch(`${API_URL}/assets`),

            fetch(`${API_URL}/tickets`),

            fetch(`${API_URL}/risk-analysis`)

        ]);


        if (!assetsResponse.ok) {

            throw new Error(
                `Assets API error: HTTP ${assetsResponse.status}`
            );

        }


        if (!ticketsResponse.ok) {

            throw new Error(
                `Tickets API error: HTTP ${ticketsResponse.status}`
            );

        }


        if (!riskResponse.ok) {

            throw new Error(
                `Risk API error: HTTP ${riskResponse.status}`
            );

        }


        assets =
            await assetsResponse.json();

        tickets =
            await ticketsResponse.json();

        const riskData =
            await riskResponse.json();


        console.log("Dashboard assets:", assets);

        console.log("Dashboard tickets:", tickets);

        console.log("Risk analysis:", riskData);


        // =========================
        // Main Statistics
        // =========================

        const totalAssets =
            document.getElementById("totalAssets");

        const openTickets =
            document.getElementById("openTickets");

        const closedTickets =
            document.getElementById("closedTickets");

        const maintenanceAssets =
            document.getElementById("maintenanceAssets");


        if (totalAssets) {

            totalAssets.textContent =
                assets.length;

        }


        if (openTickets) {

            openTickets.textContent =
                tickets.filter(
                    ticket =>
                        ticket.status?.trim().toLowerCase() === "open"
                ).length;

        }


        if (closedTickets) {

            closedTickets.textContent =
                tickets.filter(
                    ticket =>
                        ticket.status?.trim().toLowerCase() === "closed"
                ).length;

        }


        if (maintenanceAssets) {

            maintenanceAssets.textContent =
                assets.filter(
                    asset =>
                        asset.status?.trim().toLowerCase() === "maintenance"
                ).length;

        }


        // =========================
        // Smart Risk Analysis
        // =========================

        const riskScore =
            document.getElementById("riskScore");

     const riskLevelElement = document.getElementById("riskLevel");

riskLevelElement.textContent = riskData.risk_level;

riskLevelElement.className = "";

switch (riskData.risk_level.toLowerCase()) {

    case "low":
        riskLevelElement.classList.add("risk-low");
        break;

    case "medium":
        riskLevelElement.classList.add("risk-medium");
        break;

    case "high":
        riskLevelElement.classList.add("risk-high");
        break;

    case "critical":
        riskLevelElement.classList.add("risk-critical");
        break;
}

        const riskFactors =
            document.getElementById("riskFactors");

        const recommendations =
            document.getElementById("recommendations");


        if (riskScore) {

            riskScore.textContent =
                riskData.risk_score;

        }


        if (riskLevel) {

            riskLevel.textContent =
                riskData.risk_level;

        }


        if (riskFactors) {

            riskFactors.innerHTML = "";


            riskData.risk_factors.forEach(
                factor => {

                    const li =
                        document.createElement("li");

                    li.textContent = factor;

                    riskFactors.appendChild(li);

                }
            );

        }


        if (recommendations) {

            recommendations.innerHTML = "";


            riskData.recommendations.forEach(
                recommendation => {

                    const li =
                        document.createElement("li");

                    li.textContent =
                        recommendation;

                    recommendations.appendChild(li);

                }
            );

        }


    } catch (error) {

        console.error(
            "Failed to load dashboard:",
            error
        );

    }

}


// =========================
// Start Dashboard
// =========================

updateDateTime();

loadDashboard();

setInterval(
    updateDateTime,
    1000
);