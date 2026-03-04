# Prompts usados para el ejercicio Stopwatch

## Chatbot utilizado

ChatGPT

Modelo utilizado:
GPT-5.2 Thinking

---

# Prompt maestro (v1)

Actúa como un desarrollador senior Frontend y experto en UI.

Contexto:

- Proyecto vanilla (HTML/CSS/JS) sin librerías.
- Debo trabajar dentro de la carpeta `stopwatch-DLP/`.
- Hay que implementar dos modos: Stopwatch y Countdown.
- La UI debe ser lo más parecida posible a `res/stopwatch.png` (estilo online-stopwatch).
- Debe funcionar abriendo `index.html` directamente.
- Preferir `requestAnimationFrame` y `performance.now()` para precisión.

Requisitos funcionales:

Stopwatch:

- Display `MM:SS:CC` (centésimas).
- Botón verde: Start → Pause → Resume.
- Botón rojo: Clear.
- Atajos teclado:
  - Space → Start/Pause
  - R → Reset

Countdown:

- Inputs para minutos y segundos.
- Validación numérica.
- Start/Pause/Resume.
- Clear vuelve al valor configurado.
- Si llega a 0:
  - parar
  - flash visual en el display.

Requisitos de código:

- Estado centralizado.
- Función `formatTime(ms)`.
- Animación con `requestAnimationFrame`.
- Código claro y comentado.

Entrega:

- index.html
- styles.css
- script.js

---

# Prompts de ajuste utilizados

## Prompt ajuste UI

La interfaz debe parecerse lo máximo posible a la referencia `res/stopwatch.png`.
El layout debe tener:

- display grande centrado
- botones grandes verde y rojo
- tabs para cambiar entre stopwatch y countdown.

## Prompt ajuste Countdown

Implementa countdown preciso usando `performance.now()` y `requestAnimationFrame`.

Requisitos:

- start desde valor configurado
- pause guarda remaining time
- resume continúa correctamente
- clear vuelve al valor configurado
- cuando llega a 0 detener y aplicar flash visual.

---

# Estrategia de desarrollo

Se ha seguido un enfoque iterativo:

1. Inicializar proyecto y estructura Git.
2. Crear UI skeleton.
3. Implementar lógica Stopwatch.
4. Implementar lógica Countdown.
5. Añadir efectos visuales (flash).
6. Mejorar validación de inputs.
7. Documentar prompts utilizados.
