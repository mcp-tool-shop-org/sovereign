<p align="center">
  <a href="README.ja.md">日本語</a> | <a href="README.zh.md">中文</a> | <a href="README.md">English</a> | <a href="README.fr.md">Français</a> | <a href="README.hi.md">हिन्दी</a> | <a href="README.it.md">Italiano</a> | <a href="README.pt-BR.md">Português (BR)</a>
</p>

<div align="center">

<img src="https://raw.githubusercontent.com/mcp-tool-shop-org/brand/main/logos/sovereign/readme.png" alt="Sovereign — The Hamilton System Board Game" width="400" />

**El juego de mesa Hamilton System · adaptación para un jugador / digital**

*Crédito Fundacional · Financia la deuda. Construye el banco. Industrializa la República.*

[![CI](https://github.com/mcp-tool-shop-org/sovereign/actions/workflows/ci.yml/badge.svg)](https://github.com/mcp-tool-shop-org/sovereign/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@mcptoolshop/sovereign.svg)](https://www.npmjs.com/package/@mcptoolshop/sovereign)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Landing Page](https://img.shields.io/badge/landing-page-1F2D52?style=flat)](https://mcp-tool-shop-org.github.io/sovereign/)

</div>

---

> **Beta pública** — juego gratuito en tu navegador, sin necesidad de instalación. Está pulido, pero aún en desarrollo; consulta [`CHANGELOG.md`](./CHANGELOG.md) para ver las novedades y los problemas conocidos.

---

## De qué se trata

Sovereign es un **juego de mesa tipo Monopoly con el sistema Hamilton** sobre la fundación del crédito público estadounidense, además de una **adaptación para un jugador / digital** que ejecuta las mismas reglas localmente en un navegador contra dos oponentes con guiones deterministas.

- **Juego de mesa** — edición imprimible de 34 hojas. Tablero de 40 casillas, 22 propiedades + 4 rutas + 2 instituciones, 8 sistemas de colores, 7 Leyes del Congreso en orden histórico fijo, 4 roles de jugador, 3 pistas compartidas (Crédito Público · Resistencia Pública · Capacidad Industrial), 12 + 12 cartas de eventos. Dos caminos económicos viables más allá del Tesoro: Comerciante y Fabricante. Equilibrio de la versión 0.2, fijado.
- **Modo digital** — un único archivo HTML autocontenido. Condición de finalización basada en circuitos: el juego termina cuando un jugador completa su cuarta vuelta al Tesoro. Duración media del juego: **~22 rondas (~66 turnos)**. En la Contabilidad Final, el jugador con mayor influencia gana, *no necesariamente el que completó primero el recorrido por el tablero*. Capa de presencia de rivales: clasificación de influencia visible + líneas de postura por oponente. Capa de profundidad estratégica: tres Acciones Especiales con perfiles bloqueados, seis cartas HAND con ventanas de tiempo, acción de recuperación de Reforma, la Espiral de Crédito en varias etapas (Duda Pública → Crisis → Pánico → Incumplimiento) con un impuesto de servicio de la deuda, aceleración telegrafiada, previsión y un salvavidas de Reforma. Capa de arco estratégico: ocho Eventos de la Era Federal que se activan cada ronda a partir de la ronda 8, tres Visiones de Perfil con bonificaciones de final de juego. Capa de narración del cronista: 14 pancartas históricas vinculadas a eventos más la informativa Capa B (ventanas emergentes de "Más información", la enciclopedia del Cronista, sugerencias de herramientas del glosario), citas reales de los Federalist Papers y Founders Online, mensaje persistente con × para descartar. Elementos visuales y de sonido: interpolación de números, audio ZzFX procedural (13 efectos), configuración de VELOCIDAD Cinematográfica / Normal / Rápida. RNG determinista mulberry32, oponentes de IA con guiones, guardar / cargar con integridad hash, reproductor de repeticiones, herramienta de simulación por lotes controlada por el diseñador.
- **Tres caminos reales hacia la victoria** — Tesoro, Comerciante y Fabricante, cada uno con una victoria significativa, siendo el Tesoro el más fuerte, en línea con la historia: el crédito público y las finanzas federales fueron el principal instrumento económico de Hamilton. Cada perfil juega de manera diferente, con su propia Acción Especial y una Visión de Perfil para perseguir.

---

## Inicio rápido

### Juega en tu navegador (sin instalación)

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

El juego de mesa imprimible es un documento HTML autocontenido de 34 hojas. Abre `release/board-game/sovereign-board-game.html` desde el paquete (o desde una descarga), luego `Cmd/Ctrl-P → Guardar como PDF → US Letter → 100% de escala`. Recorta y juega.

### Paquete de lanzamiento sin conexión

Cada lanzamiento etiquetado adjunta un paquete `sovereign-vX.Y.Z-release.zip` a su página de lanzamiento de GitHub. Descárgalo, descomprímelo y abre `00-START-HERE.html` para acceder al punto de entrada dirigido a la audiencia. Todo se ejecuta sin conexión.

---

## Por qué existe

La tesis de Sovereign es que el **crédito público + las finanzas federales** fueron el principal instrumento económico de Alexander Hamilton, pero un juego con el sistema Hamilton debe permitir que el **comercio** y la **industria** también sean caminos viables hacia la victoria. El arco de equilibrio (v0.2 → v0.10) fue un esfuerzo de nueve versiones basado en la evidencia para mantener el Tesoro como el perfil más fuerte (en línea con la historia) sin reducir el diseño a un juego de una sola estrategia.

Consulta [`CHANGELOG.md`](./CHANGELOG.md) para ver la evolución completa versión por versión.

---

## Determinismo

La misma semilla + las mismas decisiones humanas = registro idéntico en bytes en todas las ejecuciones, navegadores y sistemas operativos.

- Un único RNG: `mulberry32(state.rngSeed)`.
- Decisiones del oponente: funciones puras del estado visible, con cada decisión registrada en el registro junto con la regla que la desencadenó.
- La operación de guardar / cargar conserva un hash de estado.
- La reproducción se reconstruye a partir de `initialState(seed) + decisionLog`.
- Verificado en más de 1000 juegos deterministas durante el arco de equilibrio de la versión 0.2 a la 0.10.

---

## Modelo de amenazas y manejo de datos

Sovereign es un juego de mesa autocontenido basado en el navegador. La CLI abre un archivo HTML local en tu navegador predeterminado. No hay servidor, ni llamada de red, ni cuenta, ni sincronización en la nube.

- **Datos afectados:** los archivos HTML incluidos en `release/` (solo lectura) y `localStorage` bajo la clave `sovereign.autosave` (solo el estado de la partida guardada).
- **Datos NO afectados:** no se accede al sistema de archivos fuera del directorio del paquete, no se realizan solicitudes de red de ningún tipo, no hay telemetría, no hay análisis, no hay credenciales.
- **Permisos requeridos:** capacidad para iniciar el navegador predeterminado del sistema operativo, capacidad para leer los archivos del propio paquete, `localStorage` del navegador (opcional).
- **Nunca se utilizará telemetría.** La función de "telemetría" del simulador se refiere a informes locales de análisis del juego derivados del registro en el navegador; estos nunca abandonan su máquina.

Consulte [`SECURITY.md`](./SECURITY.md) para obtener información sobre cómo informar sobre vulnerabilidades y conocer la política de seguridad completa.

---

## Características

- **Juego de victoria en circuito en solitario** contra dos oponentes programados (Tesorería/Finanzas y Comercio/Infraestructura por defecto; Fabricación/Industria disponible para partidas en lote). El juego termina cuando un jugador completa su cuarta vuelta en Treasury Opens. La mayor influencia en la contabilidad final gana.
- **Presencia del rival (capa v1.5)**: se muestra la clasificación de influencia y las líneas de postura por oponente que enmarcan cada movimiento del rival en relación con *su* posición en la carrera ("Hamilton: 3 puntos de influencia por delante; toma el Banco; el bloque de la Tesorería se refuerza"). Pone fin a la sensación de juego en solitario paralelo; los oponentes se perciben como tales. Solo es una presentación; nunca se escribe en el registro cifrado.
- **La espiral del crédito (capa v1.5)**: el fracaso del crédito público ahora se siente, se agrava y se puede recuperar. Un impuesto en efectivo para el pago de la deuda cuando el crédito es bajo, una aceleración telegrafiada hacia el incumplimiento, una previsión de hacia dónde conduce la pendiente y la acción de reforma como un verdadero salvavidas. Transmite directamente la tesis cívica: se siente *por qué* el crédito público federal era importante. Amplía la jerarquía de fracasos existente (Duda pública → Crisis → Pánico → Incumplimiento), y la función de guardar/reproducir sigue siendo totalmente determinista.
- **Efectos visuales + sonido (capa v1.5)**: interpolación numérica con asimetría de ganancia/pérdida, audio ZzFX procedural en 13 pistas, coreografía de acciones y una configuración de VELOCIDAD (Cinemática/Normal/Rápida-instantánea; Rápida-instantánea omite todas las animaciones para una reproducción rápida y la accesibilidad). Soporte completo para teclado/movimiento reducido/lector de pantalla en todo el juego.
- **Profundidad estratégica (capa v1.2)**: tres acciones especiales con perfiles bloqueados (Emitir bonos federales/Negociar un contrato de ruta/Establecer un taller), 6 cartas de la mano con ventanas de tiempo (límite de la mano: 2), acción de recuperación de la reforma.
- **Arco estratégico (capa v1.3)**: 8 eventos de la era federal que se activan cada ronda a partir de la ronda 8+ (5 opciones + 3 automáticas), 3 visiones de perfil (Arquitecto del crédito federal/Soberano del comercio/Fundador industrial) con una bonificación al final del juego. Las tres visiones son alcanzables.
- **El cronista (capa v1.4)**: voz histórica en tercera persona. 14 pancartas vinculadas a eventos (Actos × 7/Apertura de la era federal/Duda/Crisis/Pánico/Incumplimiento/Rebelión/Reforma/Visión/Contabilidad final). Todas las citas atribuidas se verificaron en founders.archives.gov, Wikisource y fuentes de la Biblioteca del Congreso. Los actos fallidos se narran como hechos contrafácticos de la historia real ("En nuestra historia, el Acta de financiación de Hamilton se aprobó con 32 votos a favor y 29 en contra en julio de 1790; en su República, la discriminación contra los soldados obtuvo suficientes votos para cerrar la puerta"). Un mensaje persistente con borde de color con × para descartar; respeta la configuración de narración Activado/Mínimo/Desactivado.
- **Cronista Nivel B: la capa informativa (v1.5)**: 15 ventanas emergentes de *Más información* sobre las mecánicas clave, la enciclopedia del **Registro del cronista** (27 citas históricas verificadas más Actos, eventos de la era federal, niveles de crédito y visiones en una sola superposición de referencia) y 10 sugerencias de glosario. Convierte el sabor de la época en una capa de historia real y navegable.
- **Incorporación (capa v1.5)**: una introducción guiada de "Debate sobre la financiación de 1790" que guía a un jugador que juega por primera vez a través del ciclo principal, además de una función de información flotante que muestra el costo y la consecuencia de cada opción antes de que se comprometa.
- **IA determinista**: cada decisión del oponente es una función pura del estado visible con una razón registrada. No hay LLM, no hay magia opaca.
- **8 superficies de juego**: Tablero, Panel de la Tesorería, Inspector de activos, Cajón de eventos, Actos del Congreso, Pistas compartidas, Registro de turnos/Registro, Informe final.
- **Subastas**: los activos rechazados se ofrecen en una subasta para varios jugadores con ofertas programadas basadas en el perfil.
- **Guardar/cargar**: guardado automático en `localStorage` en cada turno, exportación/importación manual en formato JSON, verificación de la integridad del hash al cargar, con control de versiones.
- **Reproducción**: control deslizante completo sobre cualquier juego completado. Solo lectura. Se reconstruye a partir de la semilla + el registro de decisiones con una marca de integridad verde.
- **Simulación por lotes**: ejecute 10/50/100 juegos deterministas contra cualquier triplete de perfiles, exporte informes en formato JSON + HTML para el análisis del equilibrio.
- **Narración histórica**: biblioteca de 25 entradas derivada del registro (valores predeterminados de 40 a 60 palabras, expansiones de 150 a 200 palabras, resumen del final del juego de la república de aproximadamente 300 a 500 palabras). Nunca modifica el estado.
- **Accesibilidad**: navegación completa con el teclado, indicadores de enfoque, etiquetas significativas para el lector de pantalla, los valores de la pista se pueden leer como texto y no solo como marcadores, tamaño de fuente mínimo de 14 píxeles, respeta la configuración de movimiento reducido.

---

## Lista de perfiles (línea de base de equilibrio v0.10)

| Perfil | Prioridad de activos | Fortaleza | Debilidad |
|--------------------------------|---------------------------------------------------------------|----------------------|-------------------------------------|
| **Treasury / Finance**         | NF > Deuda estatal > Deuda de ingresos > Banco > Casa de la moneda | Aumento del crédito público | Sin ingresos por infraestructura |
| **Merchant / Infrastructure**  | Rutas (las 4) > Comercio > Mejoras > Ingresos | Escalera de rutas | Sin puntuación de la capacidad industrial |
| **Manufacturer / Industry**    | Fabricación > Industria estratégica > Mejoras > Banco | Multiplicadores de capacidad | Comienzo lento; obtiene una Carta inicial |

El cuarto perfil del documento conceptual (Oportunista/Efectivo) se pospone. El conjunto competitivo bloqueado de v0.10 es de tres.

---

## Notas de la versión beta

- **Es una versión beta pública:** está bien pulida y es entretenida, pero aún está en desarrollo; es posible que encuentres algún fallo ocasional. Se agradecen los informes de errores y los comentarios en el [seguimiento de problemas](https://github.com/mcp-tool-shop-org/sovereign/issues).
- **Completar el tablero primero no significa que ganes.** El juego termina cuando un jugador completa su cuarta vuelta al tablero, pero el ganador es quien tenga la mayor influencia en el momento del recuento final; la profundidad económica supera a la velocidad. La pantalla final del juego lo deja claro.
- **El Tesoro es la estrategia más potente, por diseño.** El crédito público y las finanzas federales fueron el principal instrumento de Hamilton, por lo que el Tesoro suele ser la estrategia ganadora, pero el Comerciante y el Fabricante son estrategias igualmente viables y se juegan de forma muy diferente.

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

Las versiones se publican en npm a través de GitHub Actions (`release.yml`) al realizar un "push" de la etiqueta `v*`, con la certificación de procedencia de Sigstore. La fuente de verdad es la rama `main`.

---

## Licencia

MIT © mcp-tool-shop. Consulta [`LICENSE`](./LICENSE).

---

<div align="center">

Creado por <a href="https://mcp-tool-shop.github.io/">MCP Tool Shop</a>

</div>
