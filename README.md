# BarberPro
Sistema de gestión para barberías con citas, clientes, servicios, pagos y reportes.
# ✂️ BarberStyle – App de Reservas para Barbería

Aplicación web móvil para gestionar citas en una barbería. Diseñada para funcionar perfectamente en smartphone.

## 🚀 Demo rápida

Abre `index.html` en tu navegador o despliégala en GitHub Pages / Netlify / Vercel.

## ✨ Funcionalidades

- **Login flexible:** con correo + contraseña + nombre, o con teléfono/WhatsApp + nombre
- **Catálogo de servicios** con precios:
  - Corte de cabello – $120 MXN
  - Arreglo de barba – $80 MXN
  - Arreglo de bigote – $50 MXN
  - Corte + Barba – $180 MXN
  - Ceja – $40 MXN
  - Look completo – $250 MXN
- **Calendario interactivo** por barbero (Barber 1 y Barber 2, calendarios independientes)
- **Horarios de 10:00 AM a 9:00 PM**, 1 hora por persona
- **Slots ocupados** marcados en rojo (no seleccionables)
- **Confirmación de cita** con resumen completo
- **Envío por WhatsApp** (abre conversación directa con el mensaje precargado)
- **Envío por correo** (abre cliente de email con mensaje precargado)

## 📁 Estructura

```
barbershop/
├── index.html          # App principal (SPA de 4 pantallas)
├── css/
│   └── style.css       # Estilos dark gold, mobile-first
├── js/
│   └── app.js          # Toda la lógica de la app
└── README.md
```

## 📱 Pantallas

1. **Login** – Tabs para correo/teléfono
2. **Servicios** – Grid de 6 tarjetas con precio
3. **Calendario** – Selección de barbero, fecha y hora
4. **Confirmación** – Recibo + botones WhatsApp/Correo

## 🌐 Despliegue en GitHub Pages

1. Sube el proyecto a un repositorio en GitHub
2. Ve a **Settings → Pages**
3. Selecciona `main` branch y carpeta `/root`
4. ¡Tu app estará en `https://tuusuario.github.io/nombre-repo`!

## 🎨 Diseño

- Tema oscuro dorado (#C9A84C sobre #111010)
- Fuentes: Playfair Display (display) + Inter (cuerpo)
- 100% mobile-first, funciona en cualquier smartphone

## 🔧 Personalización

Edita en `js/app.js`:
- `ALL_HOURS` → cambiar horarios disponibles
- Precios en `data-price` dentro del HTML
- Número de WhatsApp de la barbería → busca `wa.me` y agrega el número fijo

Para conectar con un **backend real** (Firebase, Supabase, etc.) puedes reemplazar `state.bookedSlots` con llamadas a una base de datos.

## 📜 Licencia

MIT – úsala libremente para tu negocio.
