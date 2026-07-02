// js/partidos.js

const DB_NAME = 'FutbolDB';
const STORE_NAME = 'matches';

export function abrirDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);
        request.onupgradeneeded = (e) => {
            if (!e.target.result.objectStoreNames.contains(STORE_NAME)) {
                e.target.result.createObjectStore(STORE_NAME);
            }
        };
        request.onsuccess = (e) => resolve(e.target.result);
        request.onerror = (e) => reject(e.target.error);
    });
}

export async function guardarPartidos(fecha, datos) {
    const db = await abrirDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(datos, fecha);
}

export async function obtenerPartidosLocal(fecha) {
    const db = await abrirDB();
    return new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const request = tx.objectStore(STORE_NAME).get(fecha);
        request.onsuccess = () => resolve(request.result);
    });
}