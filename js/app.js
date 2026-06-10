/* ═══════════════════════════════════════════════════
   BarberStyle — App Logic
   ═══════════════════════════════════════════════════ */

// ─── STATE ───────────────────────────────────────────
const state = {
  user: { name: '', contact: '', contactType: '' },
  service: null,
  servicePrice: 0,
  barber: 1,
  selectedDate: null,
  selectedSlot: null,
  currentMonth: new Date(),
  // Simulación de citas ya reservadas: { "YYYY-MM-DD_barber": ["10:00", "14:00"] }
  bookedSlots: {}
};

// Horas disponibles 10am - 9pm (1h por persona)
const ALL_HOURS = [
  '10:00','11:00','12:00','13:00','14:00',
  '15:00','16:00','17:00','18:00','19:00',
  '20:00','21:00'
];

// ─── SCREEN NAVIGATION ───────────────────────────────
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => {
    s.classList.remove('active');
    s.style.display = 'none';
  });
  const target = document.getElementById(id);
  target.style.display = 'flex';
  target.classList.add('active');
  window.scrollTo(0, 0);
}

document.querySelectorAll('.back-btn').forEach(btn => {
  btn.addEventListener('click', () => showScreen(btn.dataset.target));
});

// ─── TOAST ───────────────────────────────────────────
function showToast(msg) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2800);
}

// ─── LOGIN ───────────────────────────────────────────
const tabs = document.querySelectorAll('.tab');
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.getElementById('tab-' + tab.dataset.tab).classList.add('active');
  });
});

document.getElementById('btn-login').addEventListener('click', () => {
  const activeTab = document.querySelector('.tab.active').dataset.tab;
  let name = '', contact = '', contactType = '';

  if (activeTab === 'email') {
    name = document.getElementById('login-name-email').value.trim();
    contact = document.getElementById('login-email').value.trim();
    const pass = document.getElementById('login-password').value.trim();
    contactType = 'email';
    if (!name) return showToast('⚠️ Ingresa tu nombre');
    if (!contact || !contact.includes('@')) return showToast('⚠️ Correo inválido');
    if (!pass || pass.length < 6) return showToast('⚠️ Contraseña mínimo 6 caracteres');
  } else {
    name = document.getElementById('login-name-phone').value.trim();
    contact = document.getElementById('login-phone').value.trim();
    contactType = 'phone';
    if (!name) return showToast('⚠️ Ingresa tu nombre');
    if (!contact || contact.length < 8) return showToast('⚠️ Teléfono inválido');
  }

  state.user = { name, contact, contactType };

  // Actualizar avatares
  const initial = name.charAt(0).toUpperCase();
  document.getElementById('user-avatar').textContent = initial;
  document.getElementById('user-avatar-2').textContent = initial;
  document.getElementById('user-avatar-3').textContent = initial;

  document.getElementById('welcome-name').textContent = name.split(' ')[0];
  showScreen('screen-service');
  showToast(`👋 Hola, ${name.split(' ')[0]}!`);
});

// ─── SERVICE SELECTION ────────────────────────────────
const serviceCards = document.querySelectorAll('.service-card');
serviceCards.forEach(card => {
  card.addEventListener('click', () => {
    serviceCards.forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    state.service = card.dataset.service;
    state.servicePrice = parseInt(card.dataset.price);
    document.getElementById('btn-to-calendar').disabled = false;
  });
});

document.getElementById('btn-to-calendar').addEventListener('click', () => {
  renderCalendar();
  showScreen('screen-calendar');
});

// ─── BARBER SELECTOR ─────────────────────────────────
document.querySelectorAll('.barber-tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.barber-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.barber = parseInt(btn.dataset.barber);
    state.selectedSlot = null;
    if (state.selectedDate) renderSlots(state.selectedDate);
    updateConfirmButton();
    updateSummaryBar();
  });
});

// ─── CALENDAR ────────────────────────────────────────
function renderCalendar() {
  const d = state.currentMonth;
  const year = d.getFullYear();
  const month = d.getMonth();

  const monthNames = ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
    'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  document.getElementById('cal-month-label').textContent = `${monthNames[month]} ${year}`;

  const grid = document.getElementById('cal-grid');
  grid.innerHTML = '';

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  const today = new Date();
  today.setHours(0,0,0,0);

  // Prev month overflow
  for (let i = firstDay - 1; i >= 0; i--) {
    const el = createDayEl(daysInPrevMonth - i, true, true);
    grid.appendChild(el);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const isPast = date < today;
    const dateStr = formatDate(date);
    const isSelected = state.selectedDate === dateStr;
    const el = createDayEl(day, false, isPast, date, isSelected);
    grid.appendChild(el);
  }

  // Fill remaining
  const total = firstDay + daysInMonth;
  const remaining = total % 7 === 0 ? 0 : 7 - (total % 7);
  for (let i = 1; i <= remaining; i++) {
    const el = createDayEl(i, true, true);
    grid.appendChild(el);
  }
}

function createDayEl(num, otherMonth, isPast, dateObj, isSelected) {
  const el = document.createElement('div');
  el.className = 'cal-day';
  el.textContent = num;

  if (otherMonth) el.classList.add('other-month');
  if (isPast) { el.classList.add('past'); return el; }
  if (!dateObj) return el;

  const today = new Date();
  today.setHours(0,0,0,0);
  if (dateObj.getTime() === today.getTime()) el.classList.add('today');
  if (isSelected) el.classList.add('selected');

  const dateStr = formatDate(dateObj);
  const key = `${dateStr}_${state.barber}`;
  const booked = state.bookedSlots[key] || [];
  if (booked.length < ALL_HOURS.length) el.classList.add('has-slots');

  el.addEventListener('click', () => {
    state.selectedDate = dateStr;
    state.selectedSlot = null;
    renderCalendar();
    renderSlots(dateStr);
    updateConfirmButton();
    updateSummaryBar();
  });

  return el;
}

document.getElementById('cal-prev').addEventListener('click', () => {
  state.currentMonth.setMonth(state.currentMonth.getMonth() - 1);
  renderCalendar();
});
document.getElementById('cal-next').addEventListener('click', () => {
  state.currentMonth.setMonth(state.currentMonth.getMonth() + 1);
  renderCalendar();
});

// ─── SLOTS ────────────────────────────────────────────
function renderSlots(dateStr) {
  const grid = document.getElementById('slots-grid');
  const title = document.getElementById('slots-title');
  grid.innerHTML = '';

  const d = new Date(dateStr + 'T12:00:00');
  const dayNames = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
  const monthNames = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
  title.textContent = `${dayNames[d.getDay()]} ${d.getDate()} ${monthNames[d.getMonth()]}`;

  const key = `${dateStr}_${state.barber}`;
  const booked = state.bookedSlots[key] || [];

  ALL_HOURS.forEach(hour => {
    const btn = document.createElement('button');
    btn.className = 'slot-btn';
    btn.textContent = hour;

    if (booked.includes(hour)) {
      btn.classList.add('busy');
      btn.disabled = true;
    } else if (state.selectedSlot === hour) {
      btn.classList.add('selected');
    }

    btn.addEventListener('click', () => {
      if (btn.classList.contains('busy')) return;
      state.selectedSlot = hour;
      renderSlots(dateStr);
      updateConfirmButton();
      updateSummaryBar();
    });

    grid.appendChild(btn);
  });
}

// ─── SUMMARY BAR ──────────────────────────────────────
function updateSummaryBar() {
  const bar = document.getElementById('summary-bar');
  if (state.selectedDate && state.selectedSlot) {
    bar.style.display = 'flex';
    document.getElementById('summary-service').textContent = state.service;
    const d = new Date(state.selectedDate + 'T12:00:00');
    const dayNames = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
    const monthNames = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
    document.getElementById('summary-datetime').textContent =
      `Barber ${state.barber} · ${dayNames[d.getDay()]} ${d.getDate()} ${monthNames[d.getMonth()]} · ${state.selectedSlot}`;
    document.getElementById('summary-price').textContent = `$${state.servicePrice}`;
  } else {
    bar.style.display = 'none';
  }
}

function updateConfirmButton() {
  document.getElementById('btn-confirm').disabled = !(state.selectedDate && state.selectedSlot);
}

// ─── CONFIRM ──────────────────────────────────────────
document.getElementById('btn-confirm').addEventListener('click', () => {
  // Guardar la cita como ocupada
  const key = `${state.selectedDate}_${state.barber}`;
  if (!state.bookedSlots[key]) state.bookedSlots[key] = [];
  state.bookedSlots[key].push(state.selectedSlot);

  // Rellenar recibo
  const d = new Date(state.selectedDate + 'T12:00:00');
  const dayNames = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
  const monthNames = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  const dateLabel = `${dayNames[d.getDay()]} ${d.getDate()} de ${monthNames[d.getMonth()]}, ${d.getFullYear()}`;

  document.getElementById('receipt-name').textContent = state.user.name;
  document.getElementById('receipt-contact').textContent = state.user.contact;
  document.getElementById('receipt-service').textContent = state.service;
  document.getElementById('receipt-barber').textContent = `Barber ${state.barber}`;
  document.getElementById('receipt-datetime').textContent = `${dateLabel} a las ${state.selectedSlot}`;
  document.getElementById('receipt-price').textContent = `$${state.servicePrice} MXN`;

  // WhatsApp link
  const waMsg = encodeURIComponent(
    `✂️ *BarberStyle – Confirmación de cita*\n\n` +
    `👤 *Cliente:* ${state.user.name}\n` +
    `💈 *Servicio:* ${state.service}\n` +
    `✂️ *Barbero:* Barber ${state.barber}\n` +
    `📅 *Fecha:* ${dateLabel}\n` +
    `⏰ *Hora:* ${state.selectedSlot} hrs\n` +
    `💰 *Costo:* $${state.servicePrice} MXN\n\n` +
    `_Recuerda llegar 5 minutos antes. ¡Te esperamos!_`
  );

  let phone = state.user.contactType === 'phone'
    ? state.user.contact.replace(/\D/g, '')
    : '';
  if (phone && !phone.startsWith('52') && phone.length === 10) phone = '52' + phone;

  document.getElementById('btn-whatsapp').onclick = () => {
    const url = phone
      ? `https://wa.me/${phone}?text=${waMsg}`
      : `https://wa.me/?text=${waMsg}`;
    window.open(url, '_blank');
  };

  // Email link
  const subject = encodeURIComponent('✂️ Confirmación de cita – BarberStyle');
  const body = encodeURIComponent(
    `Hola ${state.user.name},\n\n` +
    `Tu cita ha sido confirmada:\n\n` +
    `Servicio: ${state.service}\n` +
    `Barbero: Barber ${state.barber}\n` +
    `Fecha: ${dateLabel} a las ${state.selectedSlot} hrs\n` +
    `Costo: $${state.servicePrice} MXN\n\n` +
    `Recuerda llegar 5 minutos antes.\n\n` +
    `¡Hasta pronto!\nEquipo BarberStyle`
  );

  const emailAddr = state.user.contactType === 'email' ? state.user.contact : '';
  document.getElementById('btn-email').onclick = () => {
    window.location.href = `mailto:${emailAddr}?subject=${subject}&body=${body}`;
  };

  showScreen('screen-confirm');
});

// ─── NUEVA CITA ───────────────────────────────────────
document.getElementById('btn-new-appt').addEventListener('click', () => {
  // Reset service selection
  serviceCards.forEach(c => c.classList.remove('selected'));
  state.service = null;
  state.servicePrice = 0;
  state.selectedDate = null;
  state.selectedSlot = null;
  state.barber = 1;
  document.querySelectorAll('.barber-tab').forEach(b => b.classList.remove('active'));
  document.querySelector('.barber-tab[data-barber="1"]').classList.add('active');
  document.getElementById('btn-to-calendar').disabled = true;
  document.getElementById('slots-grid').innerHTML = '';
  document.getElementById('slots-title').textContent = 'Selecciona un día';
  document.getElementById('summary-bar').style.display = 'none';
  state.currentMonth = new Date();
  showScreen('screen-service');
});

// ─── HELPERS ──────────────────────────────────────────
function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// Pre-populate some fake bookings for demo realism
function seedDemoData() {
  const today = new Date();
  for (let barber of [1, 2]) {
    for (let offset of [0, 1, 2, 3]) {
      const d = new Date(today);
      d.setDate(d.getDate() + offset);
      const key = `${formatDate(d)}_${barber}`;
      // Random 2-4 slots busy
      const shuffled = [...ALL_HOURS].sort(() => 0.5 - Math.random());
      state.bookedSlots[key] = shuffled.slice(0, Math.floor(Math.random() * 3) + 1);
    }
  }
}

seedDemoData();
