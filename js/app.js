// js/app.js
import { obtenerPartidosLocal, guardarPartidos } from './partidos.js';

const API_KEY = '6d2f34f29b07812e6f68700d33b850b3'; 
let fechaActual = new Date();

const PRIORIDAD_TORNEOS = { 
    "World Cup": 1, 
    "Premier League": 2, 
    "La Liga": 3 
};

// --- Funciones expuestas al DOM ---

window.cambiarFecha = async (offset) => {
    const nuevaFecha = new Date(fechaActual);
    nuevaFecha.setDate(nuevaFecha.getDate() + offset);

    // Normalizamos a las 00:00:00 para comparar solo fechas
    const hoy = new Date();
    const hoyInicio = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    const destinoInicio = new Date(nuevaFecha.getFullYear(), nuevaFecha.getMonth(), nuevaFecha.getDate());

    const diff = (destinoInicio - hoyInicio) / (1000 * 60 * 60 * 24);

    // Solo permitimos ayer (-1), hoy (0) y mañana (1)
    if (diff >= -1 && diff <= 1) {
        fechaActual = nuevaFecha;
        await cargarPartidos();
    }
};

window.toggleSeccion = (element, nombreTorneo) => {
    const contenido = element.nextElementSibling;
    contenido.classList.toggle('colapsado');
    const esColapsado = contenido.classList.contains('colapsado');
    element.querySelector('span').textContent = esColapsado ? '▲' : '▼';
};

// --- Lógica Principal ---

async function cargarPartidos() {
    actualizarDisplay();
    const fechaISO = fechaActual.toISOString().split('T')[0];
    
    let partidos = await obtenerPartidosLocal(fechaISO);
    
    if (!partidos) {
        try {
            const response = await fetch(`https://v3.football.api-sports.io/fixtures?date=${fechaISO}`, {
                headers: { 'x-rapidapi-key': API_KEY }
            });
            const json = await response.json();
            partidos = json.response;
            if (partidos) await guardarPartidos(fechaISO, partidos);
        } catch (e) {
            console.error("Error API", e);
            return;
        }
    }
    renderizarPartidos(partidos);
    actualizarEstadoBotones();
}

function renderizarPartidos(partidos) {
    const contenedor = document.getElementById('lista-partidos');
    contenedor.innerHTML = '';
    
    if (!partidos || partidos.length === 0) {
        contenedor.innerHTML = '<p>No hay partidos para esta fecha.</p>';
        return;
    }

    const grupos = partidos.reduce((acc, p) => {
        const nombre = p.league.name;
        if (!acc[nombre]) acc[nombre] = [];
        acc[nombre].push(p);
        return acc;
    }, {});

    const nombresOrdenados = Object.keys(grupos).sort((a, b) => {
        return (PRIORIDAD_TORNEOS[a] || 99) - (PRIORIDAD_TORNEOS[b] || 99);
    });

    nombresOrdenados.forEach(nombreTorneo => {
        const seccion = document.createElement('section');
        seccion.innerHTML = `
            <div class="torneo-header" onclick="window.toggleSeccion(this, '${nombreTorneo}')">
                <h2>${nombreTorneo}</h2>
                <span>▼</span>
            </div>
            <div class="contenido-torneo"><div class="inner-content"></div></div>
        `;
        const inner = seccion.querySelector('.inner-content');
        grupos[nombreTorneo].forEach(p => {
            const div = document.createElement('div');
            div.className = 'partido';
            div.innerHTML = `<span>${p.teams.home.name} vs ${p.teams.away.name}</span>
                             <span>${new Date(p.fixture.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>`;
            inner.appendChild(div);
        });
        contenedor.appendChild(seccion);
    });
}

function actualizarDisplay() {
    const display = document.getElementById('fecha-display');
    const opciones = { day: 'numeric', month: 'short' };
    display.textContent = fechaActual.toLocaleDateString('es-ES', opciones);
}

function actualizarEstadoBotones() {
    const hoy = new Date();
    const hoyInicio = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    const refInicio = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), fechaActual.getDate());
    
    const diff = (refInicio - hoyInicio) / (1000 * 60 * 60 * 24);

    document.getElementById('btn-atras').disabled = (diff <= -1);
    document.getElementById('btn-adelante').disabled = (diff >= 1);
}

// Inicialización
cargarPartidos();