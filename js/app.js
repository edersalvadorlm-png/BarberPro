// ================================
// MR BARBER — APP.JS
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

// ── Screen Navigation ──
const screens = document.querySelectorAll(".screen");

function showScreen(id) {
  screens.forEach(s => s.classList.remove("active"));
  const target = document.getElementById(id);
  if (target) target.classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ── HOME ──
document.getElementById("btn-start").addEventListener("click", () => {
  showScreen("screen-client");
});

// ── CLIENTE ──
document.getElementById("btn-client").addEventListener("click", () => {
  const name  = document.getElementById("client-name").value.trim();
  const phone = document.getElementById("client-phone").value.trim();

  if (!name)  { shake("client-name");  alert("Por favor ingresa tu nombre"); return; }
  if (!phone) { shake("client-phone"); alert("Por favor ingresa tu WhatsApp"); return; }

  state.clientName = name;
  state.phone = phone;
  showScreen("screen-service");
});

// ── SERVICIOS ──
document.querySelectorAll(".service-card").forEach(card => {
  card.addEventListener("click", () => {
    document.querySelectorAll(".service-card").forEach(c => c.classList.remove("selected"));
    card.classList.add("selected");
    state.service = card.dataset.service;
    state.price   = card.dataset.price;
  });
});

document.getElementById("btn-service").addEventListener("click", () => {
  if (!state.service) { alert("Por favor selecciona un servicio"); return; }
  showScreen("screen-barber");
});

// ── BARBEROS ──
document.querySelectorAll(".barber-card").forEach(card => {
  card.addEventListener("click", () => {
    document.querySelectorAll(".barber-card").forEach(c => c.classList.remove("selected"));
    card.classList.add("selected");
    state.barber = card.dataset.barber;
  });
});

document.getElementById("btn-barber").addEventListener("click", () => {
  if (!state.barber) { alert("Por favor selecciona un barbero"); return; }
  showScreen("screen-calendar");
});

// ── HORA (time buttons) ──
document.querySelectorAll(".time-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".time-btn").forEach(b => b.classList.remove("selected"));
    btn.classList.add("selected");
    document.getElementById("appointment-time").value = btn.dataset.time;
    state.time = btn.dataset.time;
  });
});

// ── FECHA MÍNIMA ──
const today = new Date();
const yyyy = today.getFullYear();
const mm   = String(today.getMonth() + 1).padStart(2, "0");
const dd   = String(today.getDate()).padStart(2, "0");
document.getElementById("appointment-date").min = `${yyyy}-${mm}-${dd}`;

// ── CONFIRMAR CITA ──
document.getElementById("btn-confirm").addEventListener("click", () => {
  const dateEl = document.getElementById("appointment-date");
  const date   = dateEl.value;
  const time   = state.time;

  if (!date) { shake("appointment-date"); alert("Por favor selecciona una fecha"); return; }
  if (!time) { alert("Por favor selecciona una hora"); return; }

  state.date = formatDate(date);

  // Render ticket
  const ticket = document.getElementById("ticket");
  ticket.innerHTML = `
    <h3>💈 Resumen de tu Cita</h3>
    <div class="ticket-row">
      <span class="ticket-label">Cliente</span>
      <span class="ticket-value">${state.clientName}</span>
    </div>
    <div class="ticket-row">
      <span class="ticket-label">WhatsApp</span>
      <span class="ticket-value">${state.phone}</span>
    </div>
    <div class="ticket-row">
      <span class="ticket-label">Servicio</span>
      <span class="ticket-value">${state.service}</span>
    </div>
    <div class="ticket-row">
      <span class="ticket-label">Barbero</span>
      <span class="ticket-value">${state.barber}</span>
    </div>
    <div class="ticket-row">
      <span class="ticket-label">Fecha</span>
      <span class="ticket-value">${state.date}</span>
    </div>
    <div class="ticket-row">
      <span class="ticket-label">Hora</span>
      <span class="ticket-value">${state.time} hrs</span>
    </div>
    <div class="ticket-row">
      <span class="ticket-label">Total</span>
      <span class="ticket-value ticket-total">$${state.price} MXN</span>
    </div>
  `;

  // WhatsApp message
  const mensaje = encodeURIComponent(
`💈 *MR. BARBER*

Hola ${state.clientName}, tu cita ha sido registrada ✅

📅 Fecha: ${state.date}
⏰ Hora: ${state.time} hrs

💈 Servicio: ${state.service}
✂️ Barbero: ${state.barber}

💰 Total: $${state.price} MXN

📍 Manuel Ordóñez 521
Villas de las Huertas, Santa Catarina N.L.

¡Te esperamos!`
  );

  const cleanPhone = state.phone.replace(/\D/g, "");
  document.getElementById("btn-whatsapp").href =
    `https://wa.me/52${cleanPhone}?text=${mensaje}`;

  showScreen("screen-confirm");
});

// ── NUEVA RESERVA ──
document.getElementById("btn-restart").addEventListener("click", () => {
  // Reset state
  Object.keys(state).forEach(k => {
    state[k] = typeof state[k] === "number" ? 0 : "";
  });
  // Clear inputs
  document.getElementById("client-name").value  = "";
  document.getElementById("client-phone").value = "";
  document.getElementById("appointment-date").value = "";
  document.getElementById("appointment-time").value = "";
  document.querySelectorAll(".service-card, .barber-card").forEach(c => c.classList.remove("selected"));
  document.querySelectorAll(".time-btn").forEach(b => b.classList.remove("selected"));

  showScreen("screen-home");
});

// ── Helpers ──
function formatDate(iso) {
  const [y, m, d] = iso.split("-");
  const months = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
  return `${d} de ${months[parseInt(m, 10) - 1]} ${y}`;
}

function shake(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.animation = "shake .35s ease";
  el.addEventListener("animationend", () => { el.style.animation = ""; }, { once: true });
}

// Inject shake keyframes
const style = document.createElement("style");
style.textContent = `
  @keyframes shake {
    0%,100% { transform: translateX(0); }
    20%,60%  { transform: translateX(-5px); }
    40%,80%  { transform: translateX(5px); }
  }
`;
document.head.appendChild(style);
