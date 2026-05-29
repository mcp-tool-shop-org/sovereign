<p align="center">
  <a href="README.ja.md">日本語</a> | <a href="README.zh.md">中文</a> | <a href="README.md">English</a> | <a href="README.fr.md">Français</a> | <a href="README.hi.md">हिन्दी</a> | <a href="README.it.md">Italiano</a> | <a href="README.pt-BR.md">Português (BR)</a>
</p>

<div align="center">

<img src="https://raw.githubusercontent.com/mcp-tool-shop-org/brand/main/logos/sovereign/readme.png" alt="Sovereign — The Hamilton System Board Game" width="400" />

**El juego de mesa Hamilton System · adaptación para un jugador / digital**

*Founding Credit · Financia la deuda. Construye el banco. Industrializa la República.*

[![CI](https://github.com/mcp-tool-shop-org/sovereign/actions/workflows/ci.yml/badge.svg)](https://github.com/mcp-tool-shop-org/sovereign/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@mcptoolshop/sovereign.svg)](https://www.npmjs.com/package/@mcptoolshop/sovereign)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Landing Page](https://img.shields.io/badge/landing-page-1F2D52?style=flat)](https://mcp-tool-shop-org.github.io/sovereign/)

</div>

---

> **Estado — v1.5.0 (beta).** La versión "que se sienta real", basada en la versión estratégica v1.4. Aquí convergen cinco capas: **presencia del rival** (clasificaciones de influencia visibles + líneas de postura por oponente que eliminan el estancamiento del juego en solitario), **la espiral del crédito** (la presión por el fracaso ahora se siente, se acumula y es *recuperable* — un impuesto para el pago de la deuda, una aceleración telegrafiada hacia el incumplimiento, una previsión y un salvavidas de reforma — y transmite la tesis cívica: sientes *por qué* el crédito público es importante), **efectos visuales y sonido** (animación de números con asimetría de ganancia/pérdida, audio procedural ZzFX en 13 pistas, coreografía de acciones, una configuración de VELOCIDAD cinematográfica/normal/instantánea, accesibilidad completa), **Chronicler Tier B** (15 ventanas emergentes de *Más información*, la enciclopedia Chronicler's Ledger — 27 citas verificadas más Actos/eventos/niveles/Visiones — y 10 consejos), y **introducción** (una introducción guiada de "Debate sobre la financiación de 1790" + una presentación que no oculta nada). Se han corregido dos problemas importantes del juego que surgieron en la v1.4.0 (subastas activadas por cartas; compra con fondos insuficientes), y se ha restaurado la fidelidad de guardar/cargar/reproducir (`SAVE_VERSION = v0.26-replay-fidelity-candidate`). La duración media del juego es de **~22 rondas (~66 turnos)**; la condición final activada por el circuito no ha cambiado. Equilibrio medido (CANÓNICO × 100): Tesorería **48 %** / Comerciante **34 %** / Fabricante **18 %** — los tres perfiles ganan de manera significativa. **La v1.5.0 es una beta a la espera de una prueba completa con un jugador real** (la puerta de jugabilidad). El juego de mesa imprimible sigue siendo estable en la v0.2. Consulta `CHANGELOG.md` para ver los cambios completos y las advertencias de la beta.

---

## De qué se trata

Sovereign es un **juego de mesa del sistema Hamilton con la gramática de Monopoly** sobre la fundación del crédito público estadounidense, además de una **adaptación para un jugador / digital** que ejecuta las mismas reglas localmente en un navegador contra dos oponentes deterministas programados.

- **Juego de mesa** — edición imprimible de 34 hojas. Tablero de 40 casillas, 22 propiedades + 4 rutas + 2 instituciones, 8 sistemas de colores, 7 Actos del Congreso en orden histórico fijo, 4 roles de jugador, 3 pistas compartidas (Crédito público · Resistencia pública · Capacidad industrial), 12 + 12 cartas de eventos. Dos caminos económicos viables más allá de la Tesorería: Comerciante y Fabricante. Equilibrio de la v0.2, congelado.
- **Modo digital** — un único archivo HTML autónomo. Condición final basada en circuitos: el juego termina cuando un jugador completa su cuarto recorrido por la Tesorería. Duración media del juego **~22 rondas (~66 turnos)**. En la Contabilidad Final, el jugador con mayor influencia gana, *no necesariamente el que recorrió el tablero primero*. Capa de presencia del rival: clasificaciones de influencia visibles + líneas de postura por oponente. Capa de profundidad estratégica: tres acciones especiales bloqueadas por perfil, seis cartas HAND con ventanas de tiempo, acción de recuperación de Reforma, la espiral de crédito en varias etapas (Duda pública → Crisis → Pánico → Incumplimiento) con un impuesto para el pago de la deuda, una aceleración telegrafiada, una previsión y un salvavidas de reforma. Capa de arco estratégico: ocho eventos de la Era Federal que se activan cada ronda a partir de la ronda 8, tres Visiones de perfil con bonificaciones de final de juego. Capa de narración de Chronicler: 14 pancartas históricas vinculadas a eventos más el informativo Tier B (ventanas emergentes de Más información, la enciclopedia Chronicler's Ledger, consejos), citas reales de los Federalist Papers y Founders Online, un mensaje persistente con × para descartar. Efectos visuales y sonido: animación de números, audio procedural ZzFX (13 pistas), una configuración de VELOCIDAD cinematográfica/normal/instantánea. RNG determinista mulberry32, oponentes de IA programados, guardar/cargar con integridad hash, reproductor, herramienta de simulación por lotes controlada por el diseñador.
- **Línea de base del equilibrio** — circuito + profundidad estratégica + arco estratégico + Chronicler + Espiral de crédito (beta v1.5.0): Tesorería **48 %** · Comerciante **34 %** · Fabricante **18 %** (CANÓNICO × 100, medido con el motor en vivo a través de `test/measure-stats.mjs`). Los tres perfiles ganan de manera significativa, siendo la Tesorería el más fuerte, en línea con la tesis histórica. Las tres Visiones de perfil (Arquitecto del crédito federal / Soberano del comercio / Fundador industrial) son alcanzables y están aproximadamente equilibradas; cada una se activa en aproximadamente el 41-43 % de los juegos. La mecánica subyacente de la v0.18 (Crisis de crédito, puntuación de IP en efectivo, Carta industrial, bonificaciones por completar conjuntos) se conserva idéntica a la del arco de diseño de la v0.3 → v0.10 → v0.18, impulsado por más de 1000 juegos de simulación deterministas.

---

## Cómo empezar

### Juega en tu navegador (cero instalación)

```bash
npx @mcptoolshop/sovereign
```

La CLI abre el juego en tu navegador predeterminado. No requiere instalador, servidor ni conexión a Internet.

Otros modos:

```bash
npx @mcptoolshop/sovereign --print    # Open the printable 34-sheet board game
npx @mcptoolshop/sovereign --start    # Open the audience-routed landing page
npx @mcptoolshop/sovereign --path     # Print the playable HTML file path
npx @mcptoolshop/sovereign --help     # All flags
```

### Juega en línea

Abre la página de destino alojada en **<https://mcp-tool-shop-org.github.io/sovereign/>** y haz clic para entrar en el juego digital.

### Imprime y juega

El juego de mesa imprimible es un documento HTML autónomo de 34 hojas. Abre `release/board-game/sovereign-board-game.html` desde el paquete (o desde una descarga), luego `Cmd/Ctrl-P → Guardar como PDF → US Letter → 100 % de escala`. Recorta y juega.

### Paquete de lanzamiento sin conexión

Cada versión etiquetada adjunta un paquete `sovereign-vX.Y.Z-release.zip` a su página de lanzamiento en GitHub. Descárguelo, descomprímalo y abra `00-START-HERE.html` para acceder al punto de entrada específico para cada tipo de usuario. Todo se ejecuta sin conexión.

---

## ¿Por qué existe?

La tesis de Sovereign es que el **crédito público + las finanzas federales** fueron el principal instrumento económico de Alexander Hamilton, pero un juego basado en el sistema de Hamilton debe permitir que el **comercio** y la **industria** también sean vías viables para la victoria. La fase de equilibrio (v0.2 → v0.10) fue un proceso de nueve versiones, basado en pruebas, para mantener el Tesoro como el perfil más fuerte (en línea con la historia) sin reducir el diseño a un juego de una sola estrategia.

Consulte [`CHANGELOG.md`](./CHANGELOG.md) para ver la evolución completa de cada versión.

---

## Determinismo

La misma semilla + las mismas decisiones humanas = un registro de datos idéntico en todas las ejecuciones, navegadores y sistemas operativos.

- Un único generador de números aleatorios: `mulberry32(state.rngSeed)`.
- Decisiones del oponente: funciones puras del estado visible, con cada decisión registrada en el registro de datos junto con la regla que la desencadenó.
- Guardar/cargar: preserva un hash del estado.
- Reproducción: reconstruye a partir de `initialState(seed) + decisionLog`.
- Verificado en más de 1000 juegos deterministas durante la fase de equilibrio v0.2 → v0.10.

---

## Modelo de amenazas y gestión de datos

Sovereign es un juego de mesa independiente basado en el navegador. La CLI abre un archivo HTML local en su navegador predeterminado. No hay servidor, ni llamada de red, ni cuenta, ni sincronización en la nube.

- **Datos accedidos:** los archivos HTML incluidos en `release/` (solo lectura) y `localStorage` bajo la clave `sovereign.autosave` (solo el estado de guardado del juego).
- **Datos NO accedidos:** no hay acceso al sistema de archivos fuera del directorio del paquete, no hay solicitudes de red de ningún tipo, no hay telemetría, no hay análisis, no hay credenciales.
- **Permisos requeridos:** capacidad para iniciar el navegador predeterminado del sistema operativo, capacidad para leer los propios archivos del paquete, `localStorage` del navegador (opcional).
- **Nunca se recopila telemetría.** La función de "telemetría" del simulador se refiere a informes de análisis del juego locales derivados del registro de datos del navegador; estos nunca abandonan su máquina.

Consulte [`SECURITY.md`](./SECURITY.md) para obtener información sobre cómo informar sobre vulnerabilidades y conocer la política de seguridad completa.

---

## Características

- **Partida de victoria en circuito individual** contra dos oponentes con guion predefinido (Tesorería/Finanzas y Comercio/Infraestructura por defecto; Fabricante/Industria disponible para partidas en lote). El juego termina cuando un jugador completa su cuarto recorrido de Treasury Opens. Duración media: ~22 rondas / ~66 turnos. El jugador con mayor influencia en la contabilidad final gana.
- **Presencia del rival (capa v1.5)**: se muestran las posiciones de influencia y las líneas de postura por oponente, que enmarcan la jugada de cada rival en relación con *su* posición en la carrera ("Hamilton — tiene 3 puntos de influencia más — toma el Banco; el bloque de la Tesorería se fortalece"). Elimina la sensación de juego en solitario paralelo; los oponentes se perciben como tales. Solo con fines de presentación; nunca se guarda en el registro cifrado.
- **La espiral del crédito (capa v1.5)**: el fracaso del crédito público ahora se siente, se agrava y se puede recuperar. Se aplica un impuesto en efectivo para el pago de la deuda cuando el crédito es bajo, se anticipa una aceleración hacia el incumplimiento, se pronostica hacia dónde lleva la pendiente y la acción de Reforma se presenta como una verdadera solución. Transmite directamente la tesis cívica: se comprende *por qué* el crédito público federal era importante. Incorpora la jerarquía de la v0.18 (Duda pública → Crisis → Pánico → Incumplimiento) sin cambiar sus umbrales; se aplica dentro de `reduce()` para que siga siendo segura para repetirse.
- **Efectos visuales y sonido (capa v1.5)**: interpolación numérica con asimetría de ganancia/pérdida, audio procedural ZzFX en 13 momentos clave, coreografía de acciones y una configuración de VELOCIDAD (Cinemática / Normal / Rápida-instantánea; Rápida-instantánea omite todas las animaciones para una reproducción rápida y una mayor accesibilidad). Soporte completo para teclado / movimiento reducido / lector de pantalla en todo el juego.
- **Profundidad estratégica (capa v1.2)**: tres acciones especiales con perfiles bloqueados (Emitir bonos federales / Negociar un contrato de ruta / Establecer un taller), 6 cartas de MANO con ventanas de tiempo (límite de mano: 2) y acción de recuperación de la Reforma.
- **Arco estratégico (capa v1.3)**: 8 eventos de la Era Federal que se activan en cada ronda a partir de la ronda 8 (5 opciones + 3 automáticas), 3 Visiones de perfil (Arquitecto del crédito federal / Soberano del comercio / Fundador industrial) con un bono de +3 de influencia al final del juego. Las tres Visiones son alcanzables (~41-43 % de las partidas cada una, CANÓNICO × 100).
- **El Cronista (capa v1.4)**: voz histórica en tercera persona. 14 pancartas vinculadas a eventos (Actos × 7 / Apertura de la Era Federal / Duda / Crisis / Pánico / Incumplimiento / Rebelión / Reforma / Visión / Contabilidad final). Todas las citas atribuidas se verificaron con las fuentes de founders.archives.gov, Wikisource y la Biblioteca del Congreso. Los Actos fallidos se narran como contrafactuales de la historia real ("En nuestra historia, el Acta de Financiamiento de Hamilton se aprobó con 32 votos a favor y 29 en contra en julio de 1790; en su República, la discriminación contra los soldados obtuvo suficientes votos para cerrar la puerta"). Mensaje persistente con borde decorativo y × para descartar; respeta la configuración de narración Activada/Mínima/Desactivada.
- **Cronista Nivel B: la capa informativa (v1.5)**: 15 ventanas emergentes de *Más información* sobre las mecánicas clave, **el Registro del Cronista**, una enciclopedia (27 citas históricas verificadas más Actos, eventos de la Era Federal, niveles de crédito y Visiones en una sola superposición de referencia) y 10 sugerencias de glosario. Transforma el sabor de la época en una capa histórica real y navegable.
- **Incorporación (capa v1.5)**: un tutorial guiado de "Debate sobre el financiamiento de 1790" que presenta a un jugador nuevo el ciclo principal, además de una función de información al pasar el ratón o al enfocar que muestra el costo y la consecuencia de cada opción antes de que se comprometa.
- **IA determinista**: cada decisión del oponente es una función pura del estado visible con una razón registrada. No hay LLM, ni magia opaca.
- **8 superficies de juego**: Tablero, Panel de la Tesorería, Inspector de activos, Cajón de eventos, Actos del Congreso, Pistas compartidas, Registro de turnos / Registro, Informe final.
- **Subastas**: los activos rechazados se ofrecen en una subasta para varios jugadores con ofertas predefinidas basadas en el perfil.
- **Guardar / cargar**: guardado automático en `localStorage` en cada turno, exportación / importación manual en formato JSON, verificación de la integridad del hash al cargar, con control de versiones.
- **Repetición**: reproductor completo de cualquier partida completada. Solo lectura. Reconstruye a partir de la semilla + el registro de decisiones con una marca de integridad verde.
- **Simulación por lotes**: ejecutar 10 / 50 / 100 partidas deterministas contra cualquier triplete de perfiles, exportar informes en formato JSON + HTML para el análisis del equilibrio.
- **Narración histórica**: biblioteca de 25 entradas derivada del registro (40-60 palabras por defecto, 150-200 palabras en las versiones ampliadas, ~300-500 palabras en el resumen final de la república). Nunca modifica el estado.
- **Accesibilidad**: navegación completa con el teclado, indicadores de enfoque, etiquetas significativas para el lector de pantalla, los valores de las pistas se pueden leer como texto y no solo como marcadores, tamaño mínimo de fuente de 14 píxeles, respeta la configuración de movimiento reducido.

---

## Configuración de perfiles (línea de base de equilibrio v0.10)

| Perfil | Prioridad de activos | Fortaleza | Debilidad |
|--------------------------------|---------------------------------------------------------------|----------------------|-------------------------------------|
| **Treasury / Finance**         | NF > Deuda estatal > Deuda de ingresos > Banco > Casa de la moneda | Aumento del crédito público | Sin ingresos por infraestructura |
| **Merchant / Infrastructure**  | Rutas (las 4) > Comercio > Mejoras > Ingresos | Escalera de rutas | Sin puntuación por capacidad industrial |
| **Manufacturer / Industry**    | Mfg > Industria estratégica > Mejoras > Banco | Multiplicadores de capacidad | Comienzo lento; obtiene una Carta inicial |

El cuarto perfil del documento conceptual (Oportunista / Efectivo) se pospone. El conjunto competitivo bloqueado de la v0.10 es de tres.

---

## Limitaciones conocidas

- **La versión 1.5.0 es una versión beta que está a la espera de una prueba exhaustiva realizada por un jugador humano.** Cada capa se ha auditado estructuralmente y se ha vuelto a validar con respecto al motor en funcionamiento mediante `test/measure-stats.mjs` y los mecanismos de determinismo y jugabilidad; se ha realizado una prueba completa de la pila a nivel de segmento, pero aún no se ha jugado de principio a fin por un jugador humano. Esa prueba es la condición para la publicación de la versión pública. Los datos que se muestran a continuación son los datos CANÓNICOS × 100 en comparación con el motor en funcionamiento; el juego real con jugadores humanos será diferente. Considérelo como una opción hasta que usted (o una persona de confianza) lo haya probado.
- **La presión del fracaso se siente y se puede superar; ya no es solo un elemento decorativo.** La "Crisis de crédito" ahora se activa en aproximadamente el **29/100** de los juegos y se puede superar de forma genuina: de los juegos que entran en crisis (Crédito ≤ 4), aproximadamente el **41 %** logran volver a un nivel de Crédito estable ≥ 7, y ninguno llega al punto de "Default". El pánico es poco frecuente (~1/100). El "Default" y la "Rebelión" siguen siendo poco frecuentes bajo la IA programada de la versión 0.18, que se recupera antes de caer, pero ambos son totalmente alcanzables por un jugador humano que descuida el "Crédito público". La "Espiral de crédito" hace que la pendiente hacia el "Default" sea visible y perceptible, en lugar de un cambio repentino.
- **Los oponentes utilizan los sistemas de las versiones 1.2 a 1.4; solo las matemáticas básicas de las acciones son de la versión 0.18.** Los oponentes programados *sí* utilizan las "Acciones especiales", la línea de vida de la "Reforma", las opciones de la "Era federal" / "Eventos tardíos", las votaciones de las "Acciones" y la sincronización de las cartas de la mano; la nota anterior sobre que "la IA no se adapta" era demasiado general. Lo que sigue siendo de la versión 0.18 es la valoración básica de la "compra / subasta / mejora / votación": eligen de forma óptima según su perfil, pero aún no "compiten explícitamente por la Visión" como lo haría un optimizador humano. Las mediciones CANÓNICAS × 100 reflejan ese comportamiento programado; el juego humano divergerá.
- **El "disparador" no es sinónimo de "ganador".** El jugador que completa el cuarto circuito solo gana por "Influencia" en aproximadamente un tercio de los juegos. Esto es intencional: la "Contabilidad final" recompensa la profundidad económica, no la velocidad en el tablero. La copia del juego final hace explícita esta distinción.
- **La "Era federal" tiene una presión ligera en las "Acciones".** Las "Acciones fundacionales" se activan en las rondas 1 a 7; el juego promedio es de aproximadamente 22 rondas, por lo que la "Era federal" se desarrolla con sus propios "Eventos" (que se activan en cada ronda a partir de la ronda 8), además de la "Espiral de crédito" y la carrera por la "Visión". La reducción de la "Era federal" en cada ronda de la versión 1.3 redujo los periodos de 4 rondas sin eventos a aproximadamente 2/100. Si un periodo sigue pareciendo corto en la prueba, el siguiente paso es una redistribución de las "Acciones", no un regreso al mandato.
- **El "Tesoro" / "Finanzas" siguen siendo intencionalmente los más fuertes** (48 % de las victorias), dentro del rango objetivo. Esto coincide con la tesis histórica: el "crédito público" y las "finanzas federales" fueron el principal instrumento económico de Hamilton, sin reducir el diseño a una sola estrategia (Comerciante 34 %, Fabricante 18 %).

---

## Desarrollo y contribuciones

```bash
git clone https://github.com/mcp-tool-shop-org/sovereign
cd sovereign
npm install
npm test           # smoke tests
npm run verify     # full verify (smoke + pack-dry-run + CLI flag check)
npm run play       # open the game locally
```

Las versiones se publican en npm a través de GitHub Actions (`release.yml`) cuando se realiza un "push" de la etiqueta `v*`, con la certificación de procedencia de Sigstore. La fuente de verdad es la rama `main`.

---

## Licencia

MIT © mcp-tool-shop. Consulte [`LICENSE`](./LICENSE).

---

<div align="center">

Creado por <a href="https://mcp-tool-shop.github.io/">MCP Tool Shop</a>

</div>
