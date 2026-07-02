/**
 * Genera el prompt estructurado para la API de Gemini adaptado a cualquier competición
 * @param {string} partido - Nombre del encuentro
 * @param {string} estadisticasRaw - Datos estadísticos del partido
 * @param {string} competicion - Torneo seleccionado
 * @returns {string} Prompt final formateado
 */
function obtenerPromptInforme(partido, estadisticasRaw, competicion) {
    return `
Actúa como un analista de datos de fútbol de élite. Utiliza la siguiente información real, contrastada y reciente para confeccionar un informe estadístico avanzado del partido: "${partido}", correspondiente a la competición: "${competicion}".

Datos de rendimiento y métricas de entrada recopilados:
${estadisticasRaw}

Estructura el informe devolviendo ÚNICAMENTE un archivo .html completo, responsivo y autocontenido (con CSS interno <style>). El diseño debe ser limpio, corporativo, con fondo claro para el documento del informe, utilizando tablas compactas y legibles para facilitar el análisis entre amigos.

Reglas obligatorias de contenido a incluir en el HTML por cada equipo (adaptadas al contexto de ${competicion}):
1. Probabilidad estimada de victoria / empate / derrota (%) [Aclara de forma explícita que es una estimación propia basada en la forma actual en este torneo].
2. Goles a favor y en contra por partido + tendencia Over/Under 2.5 en sus últimas presentaciones.
3. % de partidos con AMBOS MARCAN (BTTS) y una breve explicación conceptual del término.
4. Promedio de córners (a favor/contra) + línea sugerida de partido comparada con las cuotas estimadas de las casas de apuestas.
5. Promedio de tarjetas + línea sugerida de partido.
6. Posesión promedio (%), remates totales (realizados/concedidos) y remates a puerta (totales del partido y por equipo individual).
7. Racha de forma de los últimos 5 partidos usando el formato tradicional (G-E-P).
8. Un "DATO CALIENTE" de rendimiento individual o colectivo que sea llamativo y diferencial para cada equipo.
9. Glosario técnico explicativo al inicio o al pie (BTTS, Over/Under, Córners, Remates on-target).

Código de colores visual obligatorio en tablas y textos de tendencias:
- VERDE = favorable / alta probabilidad / estadística positiva
- AMARILLO = neutro / probabilidad media / empate
- ROJO = en contra / baja probabilidad / estadística negativa o derrota

Cierre obligatorio: Un ranking "TOP picks" ordenado con las 3 o 4 mejores opciones de mercados (goles, córners, tarjetas o resultado) según la lógica de los datos cruzados. Añade una sección clara de advertencia indicando que esto es una herramienta de entretenimiento de simulación estadística entre amigos y NO constituye asesoramiento financiero ni de apuestas. Al pie del documento, añade de forma fija la fecha de consulta: 2 de Julio de 2026.

REGLA CRÍTICA DE RENDERIZADO: Devuelve EXCLUSIVAMENTE el código HTML crudo. No incluyas textos de saludo, ni bloques de formato Markdown (\`\`\`html). Empieza directamente en la etiqueta <!DOCTYPE html> y concluye en </html>.
`;
}