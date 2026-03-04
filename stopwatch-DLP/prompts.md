# Prompts usados

## Chatbot

- ChatGPT (modelo: GPT-5.2 Thinking)

## Prompt maestro (v1)

Actúa como un desarrollador senior Frontend y experto en UI.

Contexto:

- Proyecto vanilla (HTML/CSS/JS) sin librerías.
- Debo trabajar dentro de la carpeta `stopwatch-DLP/` (copiada desde `template/`).
- Hay que implementar dos modos: Stopwatch y Countdown.
- La UI debe ser lo más parecida posible a `res/stopwatch.png` (estilo online-stopwatch), con display grande con borde redondeado y dos botones grandes (verde a la izquierda, rojo a la derecha).
- Debe funcionar abriendo `stopwatch-DLP/index.html` en el navegador.
- Preferir `requestAnimationFrame` y `performance.now()` para precisión (evitar drift). No usar dependencias.

Requisitos funcionales:

1. Selector de modo:
   - Dos pestañas o toggle: "Stopwatch" y "Countdown".
   - Cambiar de modo resetea el estado del modo anterior de forma clara.

2. Stopwatch:
   - Display principal: `MM:SS:CC` (centésimas). Si excede 59:59, mostrar `HH:MM:SS`.
   - Botón verde: Start → Pause → Resume.
   - Botón rojo: Clear (para y vuelve a 00:00:00).
   - Accesos teclado: Space = Start/Pause/Resume, R = Clear.

3. Countdown:
   - Inputs para definir tiempo (mínimo MM y SS; HH opcional). Validación: solo números, SS 0–59, MM 0–59 si no hay HH.
   - Botón verde: Start → Pause → Resume.
   - Botón rojo: Clear (vuelve al último valor configurado).
   - No permitir Start si el tiempo es 0.
   - Al llegar a 0: parar, feedback visual (flash del display). Beep opcional si es fácil.

Requisitos UI/UX:

- Mantener estructura del template, pero puedes modificar `index.html`, `styles.css` y `script.js`.
- Botones con tamaños grandes, bordes redondeados y contraste alto (similar a la referencia).
- Layout centrado, responsive (usar `clamp()` para tamaño de fuente del display).
- Accesibilidad: usar `<button>`, focus visible, `aria-label` en botones si el texto cambia.

Requisitos de código:

- Estado centralizado (modo, running, elapsed/remaining, startTimestamp, etc.).
- Una función `formatTime(ms)` reutilizable.
- Una función `render()` que actualice UI.
- Separar lógica por modo (stopwatch / countdown) sin duplicar demasiado.

Tareas que debes hacer:
A) Propón estructura HTML exacta (selector modo, display, inputs countdown, botones).
B) Propón CSS para replicar el look de la referencia.
C) Implementa `script.js` completo con lógica precisa y sin drift.
D) Incluye comentarios mínimos y claros para alguien que no sabe programar.

Entrega:

- Dame el contenido final completo de `stopwatch-DLP/index.html`, `stopwatch-DLP/styles.css` y `stopwatch-DLP/script.js`.
- Evita explicaciones largas: primero los archivos completos, luego un resumen corto de cómo probarlo.

## Prompts de ajuste

- (PENDIENTE)

## Notas

- Objetivo: implementar stopwatch + countdown en vanilla JS, UI similar a online-stopwatch, sin librerías.
