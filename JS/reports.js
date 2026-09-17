const API_URL = "http://127.0.0.1:8000";


// =========================
// Load Reports
// =========================

async function loadReports() {

    try {

        const [assetsResponse, ticketsResponse] =
            await Promise.all([

                fetch(`${API_URL}/assets`),

                fetch(`${API_URL}/tickets`)

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


        const assets =
            await assetsResponse.json();

        const tickets =
            await ticketsResponse.json();


        console.log("Assets:", assets);

        console.log("Tickets:", tickets);


        // =========================
        // Dashboard Cards
        // =========================

        document.getElementById(
            "reportAssets"
        ).textContent = assets.length;


        document.getElementById(
            "reportOpen"
        ).textContent =
            tickets.filter(
                ticket =>
                    ticket.status?.trim().toLowerCase() === "open"
            ).length;


        document.getElementById(
            "reportClosed"
        ).textContent =
            tickets.filter(
                ticket =>
                    ticket.status?.trim().toLowerCase() === "closed"
            ).length;


        document.getElementById(
            "reportProgress"
        ).textContent =
            tickets.filter(
                ticket =>
                    ticket.status?.trim().toLowerCase() === "in progress"
            ).length;


        // =========================
        // Ticket Priorities
        // =========================

        const low =
            tickets.filter(
                ticket =>
                    ticket.priority?.trim().toLowerCase() === "low"
            ).length;


        const medium =
            tickets.filter(
                ticket =>
                    ticket.priority?.trim().toLowerCase() === "medium"
            ).length;


        const high =
            tickets.filter(
                ticket =>
                    ticket.priority?.trim().toLowerCase() === "high"
            ).length;


        const critical =
            tickets.filter(
                ticket =>
                    ticket.priority?.trim().toLowerCase() === "critical"
            ).length;


        // =========================
        // Asset Statistics
        // =========================

        const active =
            assets.filter(
                asset =>
                    asset.status?.trim().toLowerCase() === "active"
            ).length;


        const maintenance =
            assets.filter(
                asset =>
                    asset.status?.trim().toLowerCase() === "maintenance"
            ).length;


        const outService =
            assets.filter(
                asset =>
                    asset.status?.trim().toLowerCase() === "out of service"
            ).length;


        // =========================
        // Assets Chart
        // =========================

        new Chart(
            document.getElementById("assetsChart"),
            {
                type: "pie",

                data: {

                    labels: [
                        "Active",
                        "Maintenance",
                        "Out of Service"
                    ],

                    datasets: [{

                        data: [
                            active,
                            maintenance,
                            outService
                        ],

                        backgroundColor: [
                            "#2ecc71",
                            "#f39c12",
                            "#e74c3c"
                        ]

                    }]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false

                }

            }
        );


        // =========================
        // Tickets Chart
        // =========================

        new Chart(
            document.getElementById("ticketsChart"),
            {
                type: "bar",

                data: {

                    labels: [
                        "Low",
                        "Medium",
                        "High",
                        "Critical"
                    ],

                    datasets: [{

                        label: "Tickets",

                        data: [
                            low,
                            medium,
                            high,
                            critical
                        ],

                        backgroundColor: [
                            "#3498db",
                            "#f1c40f",
                            "#e67e22",
                            "#e74c3c"
                        ]

                    }]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    scales: {

                        y: {

                            beginAtZero: true,

                            ticks: {

                                stepSize: 1

                            }

                        }

                    }

                }

            }
        );


    } catch (error) {

        console.error(
            "Failed to load reports:",
            error
        );

        alert(
            "Unable to load reports from Smart IT server."
        );

    }

}


// =========================
// Start Reports
// =========================

loadReports();