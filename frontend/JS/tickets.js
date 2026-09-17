const API_URL = "http://127.0.0.1:8000";

let tickets = [];


// =========================
// Load Tickets
// =========================

async function loadTickets() {

    try {

        const response = await fetch(`${API_URL}/tickets`);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        tickets = await response.json();

        console.log("Tickets loaded:", tickets);

        renderTickets();

    } catch (error) {

        console.error("Failed to load tickets:", error);

        alert("Unable to connect to Smart IT server.");

    }
}


// =========================
// Add Ticket
// =========================

async function saveTicket() {

    const title =
        document.getElementById("ticketTitle").value.trim();

    const priority =
        document.getElementById("ticketPriority").value;

    const description =
        document.getElementById("ticketDescription").value.trim();


    if (!title) {

        alert("Please enter a ticket title.");

        return;
    }


    const ticketData = {

        ticket_id:
            "TCK-" +
            String(Date.now()).slice(-6),

        title: title,

        description: description,

        priority: priority,

        status: "Open"

    };


    try {

        const response = await fetch(
            `${API_URL}/tickets`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(ticketData)
            }
        );


        const data = await response.json();


        console.log(
            "Create ticket response:",
            response.status,
            data
        );


        if (!response.ok) {

            throw new Error(
                data.detail || "Failed to create ticket"
            );

        }


        alert("Ticket saved successfully.");


        document.getElementById("ticketTitle").value = "";

        document.getElementById("ticketDescription").value = "";


        await loadTickets();


    } catch (error) {

        console.error(
            "Error adding ticket:",
            error
        );

        alert(error.message);

    }
}


// =========================
// Render Tickets
// =========================

function renderTickets() {

    const table =
        document.getElementById("ticketsTable");


    table.innerHTML = "";


    tickets.forEach((ticket, index) => {

        const date = ticket.created_at
            ? new Date(ticket.created_at).toLocaleDateString()
            : "-";


        table.innerHTML += `

        <tr>

            <td>${ticket.ticket_id}</td>

            <td>${ticket.title}</td>

            <td>

                <span class="badge ${ticket.priority.toLowerCase()}">
                    ${ticket.priority}
                </span>

            </td>

            <td>

                <span class="badge ${ticket.status
                    .toLowerCase()
                    .replace(" ", "-")}">
                    ${ticket.status}
                </span>

            </td>

            <td>${date}</td>

            <td>

                <button
                    class="delete-btn"
                    type="button"
                    onclick="deleteTicket(${index})">

                    Delete

                </button>

            </td>

        </tr>

        `;

    });


    updateStats();

}


// =========================
// Delete Ticket
// =========================

async function deleteTicket(index) {

    const ticket = tickets[index];


    if (!ticket) {

        alert("Ticket not found.");

        return;
    }


    console.log("Deleting ticket:", ticket);

    console.log("Database ID:", ticket.id);


    const confirmed = confirm(
        `Are you sure you want to delete ${ticket.title}?`
    );


    if (!confirmed) {

        return;
    }


    try {

        const response = await fetch(
            `${API_URL}/tickets/${ticket.id}`,
            {
                method: "DELETE"
            }
        );


        const data = await response.json();


        console.log(
            "Delete ticket response:",
            response.status,
            data
        );


        if (!response.ok) {

            throw new Error(
                data.detail || "Failed to delete ticket"
            );

        }


        alert("Ticket deleted successfully.");


        await loadTickets();


    } catch (error) {

        console.error(
            "Error deleting ticket:",
            error
        );

        alert(error.message);

    }

}


// =========================
// Update Statistics
// =========================

function updateStats() {

    const totalElement =
        document.getElementById("totalTickets");

    const openElement =
        document.getElementById("openTickets");

    const progressElement =
        document.getElementById("progressTickets");

    const closedElement =
        document.getElementById("closedTickets");


    if (totalElement) {

        totalElement.innerText =
            tickets.length;

    }


    if (openElement) {

        openElement.innerText =
            tickets.filter(
                ticket => ticket.status === "Open"
            ).length;

    }


    if (progressElement) {

        progressElement.innerText =
            tickets.filter(
                ticket => ticket.status === "In Progress"
            ).length;

    }


    if (closedElement) {

        closedElement.innerText =
            tickets.filter(
                ticket => ticket.status === "Closed"
            ).length;

    }

}


// =========================
// Start Application
// =========================

loadTickets();