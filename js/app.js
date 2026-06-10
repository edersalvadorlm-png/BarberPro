// ================================
// MR BARBER APP
// ================================

const state = {
    clientName: "",
    phone: "",
    service: "",
    price: 0,
    barber: "",
    date: "",
    time: ""
};

// Pantallas
const screens = document.querySelectorAll(".screen");

function showScreen(id) {
    screens.forEach(screen => {
        screen.classList.remove("active");
    });

    document.getElementById(id).classList.add("active");
}

// ================================
// HOME
// ================================

document.getElementById("btn-start").addEventListener("click", () => {
    showScreen("screen-client");
});

// ================================
// CLIENTE
// ================================

document.getElementById("btn-client").addEventListener("click", () => {

    const name = document.getElementById("client-name").value.trim();
    const phone = document.getElementById("client-phone").value.trim();

    if(name === ""){
        alert("Ingresa tu nombre");
        return;
    }

    if(phone === ""){
        alert("Ingresa tu WhatsApp");
        return;
    }

    state.clientName = name;
    state.phone = phone;

    showScreen("screen-service");
});

// ================================
// SERVICIOS
// ================================

const serviceCards = document.querySelectorAll(".service-card");

serviceCards.forEach(card => {

    card.addEventListener("click", () => {

        serviceCards.forEach(c => {
            c.classList.remove("selected");
        });

        card.classList.add("selected");

        state.service = card.dataset.service;
        state.price = card.dataset.price;

    });

});

document.getElementById("btn-service").addEventListener("click", () => {

    if(state.service === ""){
        alert("Selecciona un servicio");
        return;
    }

    showScreen("screen-barber");

});

// ================================
// BARBEROS
// ================================

const barberCards = document.querySelectorAll(".barber-card");

barberCards.forEach(card => {

    card.addEventListener("click", () => {

        barberCards.forEach(c => {
            c.classList.remove("selected");
        });

        card.classList.add("selected");

        state.barber = card.dataset.barber;

    });

});

document.getElementById("btn-barber").addEventListener("click", () => {

    if(state.barber === ""){
        alert("Selecciona un barbero");
        return;
    }

    showScreen("screen-calendar");

});

// ================================
// CONFIRMAR CITA
// ================================

document.getElementById("btn-confirm").addEventListener("click", () => {

    const date = document.getElementById("appointment-date").value;
    const time = document.getElementById("appointment-time").value;

    if(date === ""){
        alert("Selecciona una fecha");
        return;
    }

    state.date = date;
    state.time = time;

    const ticket = document.getElementById("ticket");

    ticket.innerHTML = `
        <h3>📋 Resumen de tu cita</h3>
        <br>
        <p><strong>Cliente:</strong> ${state.clientName}</p>
        <p><strong>WhatsApp:</strong> ${state.phone}</p>
        <p><strong>Servicio:</strong> ${state.service}</p>
        <p><strong>Costo:</strong> $${state.price}</p>
        <p><strong>Barbero:</strong> ${state.barber}</p>
        <p><strong>Fecha:</strong> ${state.date}</p>
        <p><strong>Hora:</strong> ${state.time}</p>
    `;

    const mensaje = encodeURIComponent(
`💈 MR. BARBER

Hola ${state.clientName}

Tu cita ha sido registrada correctamente.

📅 Fecha: ${state.date}
⏰ Hora: ${state.time}

💈 Servicio: ${state.service}
✂️ Barbero: ${state.barber}

💰 Total: $${state.price}

📍 Manuel Ordóñez 521
Villas de las Huertas
Santa Catarina, N.L.

Te esperamos.`
    );

    document.getElementById("btn-whatsapp").href =
    `https://wa.me/52${state.phone.replace(/\D/g,'')}?text=${mensaje}`;

    showScreen("screen-confirm");

});

// ================================
// FECHA MINIMA
// ================================

const today = new Date();
today.setDate(today.getDate());

const yyyy = today.getFullYear();
const mm = String(today.getMonth() + 1).padStart(2,'0');
const dd = String(today.getDate()).padStart(2,'0');

document.getElementById("appointment-date").min =
`${yyyy}-${mm}-${dd}`;
