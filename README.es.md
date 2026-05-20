<p align="center">
  <a href="README.ja.md">日本語</a> | <a href="README.zh.md">中文</a> | <a href="README.md">English</a> | <a href="README.fr.md">Français</a> | <a href="README.hi.md">हिन्दी</a> | <a href="README.it.md">Italiano</a> | <a href="README.pt-BR.md">Português (BR)</a>
</p>

<div align="center">

<img src="https://raw.githubusercontent.com/mcp-tool-shop-org/brand/main/logos/sovereign/readme.png" alt="Sovereign — The Hamilton System Board Game" width="400" />

**El juego de mesa "The Hamilton System" · Adaptación para un solo jugador / digital**

*Crédito fundacional · Financia la deuda. Construye el banco. Industrializa la república.*

[![CI](https://github.com/mcp-tool-shop-org/sovereign/actions/workflows/ci.yml/badge.svg)](https://github.com/mcp-tool-shop-org/sovereign/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@mcptoolshop/sovereign.svg)](https://www.npmjs.com/package/@mcptoolshop/sovereign)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Landing Page](https://img.shields.io/badge/landing-page-1F2D52?style=flat)](https://mcp-tool-shop-org.github.io/sovereign/)

</div

---

**Estado — v1.1.2 (beta).** La versión v1.1.0 fue retirada el mismo día de su lanzamiento (20 de mayo de 2026). La versión v1.1.1 reconstruyó el modo digital con correcciones de jugabilidad, un ritmo de 12 rondas y un umbral de victoria por mandato, pero aún se sentía demasiado corta. La versión v1.1.2 reemplaza la condición de finalización basada en el número de rondas por una condición de finalización **basada en circuitos**: el juego termina cuando un jugador ha hecho girar su facción alrededor de la República cuatro veces. La duración media del juego es de aproximadamente 23 rondas / 67 turnos (1.9 veces la v1.1.1). El jugador que desencadena el final no gana automáticamente; el jugador con la mayor influencia en el cálculo final es el que gana. El juego de mesa imprimible sigue siendo estable en la versión v0.2. Consulte el archivo `CHANGELOG.md` para obtener los detalles completos de los cambios y las advertencias de la versión beta.

---

## ¿Qué es?

Sovereign es un **juego de mesa al estilo "Monopoly" basado en el sistema de Hamilton**, sobre la creación del crédito público estadounidense, además de una **adaptación completa para un solo jugador / digital** que ejecuta las mismas reglas localmente en un navegador contra dos oponentes simulados y deterministas.

- **Juego de mesa** — edición imprimible de 34 hojas. Tablero de 40 casillas, 22 propiedades + 4 rutas + 2 instituciones, 8 sistemas de colores, 7 Actas del Congreso en orden histórico fijo, 4 roles de jugador, 3 pistas compartidas (Crédito Público · Resistencia Pública · Capacidad Industrial), 12+12 cartas de evento. Dos vías económicas viables además del Tesoro: Comerciante y Fabricante. Equilibrio de la versión v0.2, congelado.
- **Modo digital** — un único archivo HTML autocontenido. Condición de finalización basada en circuitos: el juego termina cuando un jugador completa su cuarta vez alrededor del Tesoro. La duración media del juego es de aproximadamente 23 rondas (67 turnos). Al final, el jugador con la mayor influencia es el que gana, *no necesariamente el que ha dado la vuelta al tablero primero*. El límite máximo de rondas se mantiene en 30 como medida de seguridad (nunca se alcanza en la configuración CANÓNICA × 100). Generador de números aleatorios mulberry32 determinista, oponentes controlados por IA (Tesoro / Finanzas, Comerciante / Infraestructura, Fabricante / Industria), guardar / cargar con integridad de hash, herramienta de simulación por lotes para el diseñador.
- **Punto de referencia de equilibrio** — modelo de circuitos (versión v1.1.2 beta): Tesoro 56 % · Comerciante 19 % · Fabricante 25 % (CANÓNICA × 100). Los tres perfiles tienen posibilidades significativas de ganar; el Fabricante aumenta en juegos más largos a medida que los conjuntos industriales tienen tiempo para madurar; la cuota del Comerciante disminuye a medida que las rutas son menos dominantes cuando se gasta dinero en mejoras a lo largo de un período más largo. Las mecánicas subyacentes de la versión v0.18 (Crisis de Crédito, puntuación de IP en efectivo, Carta Industrial, bonificaciones por completar conjuntos) se conservan idénticas en bytes desde el ciclo de diseño v0.3 → v0.10 → v0.18, impulsado por más de 1000 simulaciones deterministas.

---

## Cómo empezar

### Juega en tu navegador (sin instalación)

```bash
npx @mcptoolshop/sovereign
```

La interfaz de línea de comandos (CLI) abre el juego en tu navegador predeterminado. No requiere instalador, servidor ni conexión a Internet.

Otros modos:

```bash
npx @mcptoolshop/sovereign --print    # Open the printable 34-sheet board game
npx @mcptoolshop/sovereign --start    # Open the audience-routed landing page
npx @mcptoolshop/sovereign --path     # Print the playable HTML file path
npx @mcptoolshop/sovereign --help     # All flags
```

### Juega en línea

Abre la página de inicio alojada en **<https://mcp-tool-shop-org.github.io/sovereign/>** y haz clic en el juego digital.

### Imprime y juega

El juego de mesa imprimible es un documento HTML autocontenido de 34 hojas. Abre `release/board-game/sovereign-board-game.html` desde el paquete (o desde una descarga), luego `Cmd/Ctrl-P → Guardar como PDF → Formato US Letter → 100% de escala`. Recorta y juega.

### Paquete de lanzamiento sin conexión

Cada versión etiquetada adjunta un paquete `sovereign-vX.Y.Z-release.zip` a su página de lanzamiento de GitHub. Descárgalo, descomprímelo y abre `00-START-HERE.html` para el punto de entrada específico para el usuario. Todo funciona sin conexión.

---

## ¿Por qué existe?

La tesis de Sovereign es que **el crédito público + las finanzas federales** fueron el principal mecanismo económico de Alexander Hamilton, pero un juego basado en el sistema de Hamilton debe permitir que el **comercio** y la **industria** también sean vías viables para la victoria. El ciclo de equilibrio (v0.2 → v0.10) fue un esfuerzo de nueve versiones, basado en evidencia, para mantener al Tesoro como el perfil más fuerte (de acuerdo con la historia) sin que el diseño se convirtiera en un juego de una sola estrategia.

Consulta [`CHANGELOG.md`](./CHANGELOG.md) para ver la evolución completa de cada versión.

---

## Determinismo

La misma semilla + las mismas decisiones humanas = un registro idéntico en bytes en cada ejecución, navegador y sistema operativo.

- Único generador de números aleatorios: `mulberry32(state.rngSeed)`.
- Decisiones del oponente: funciones puras del estado visible, con cada decisión registrada en el registro junto con su regla de activación.
- Guardar / cargar preserva un hash de estado.
- La repetición reconstruye a partir de `initialState(seed) + decisionLog`.
- Verificado en más de 1000 juegos deterministas durante el ciclo de equilibrio de v0.2 a v0.10.

---

## Modelo de amenazas y manejo de datos

Sovereign es un juego de mesa basado en un navegador, que funciona de forma autónoma. La interfaz de línea de comandos (CLI) abre un archivo HTML local en su navegador predeterminado. No hay servidor, ni llamadas de red, ni cuenta, ni sincronización en la nube.

- **Datos accedidos:** los archivos HTML incluidos en el directorio `release/` (solo lectura) y el almacenamiento local (`localStorage`) bajo la clave `sovereign.autosave` (solo para guardar el estado del juego).
- **Datos NO accedidos:** no hay acceso al sistema de archivos fuera del directorio del paquete, ni solicitudes de red de ningún tipo, ni telemetría, ni análisis, ni credenciales.
- **Permisos requeridos:** capacidad para abrir el navegador predeterminado del sistema operativo, capacidad para leer los archivos propios del paquete, almacenamiento local (`localStorage`) del navegador (opcional).
- **No hay telemetría, nunca.** La función de "telemetría" del simulador se refiere a informes de análisis del juego generados localmente a partir del registro interno; estos nunca abandonan su máquina.

Consulte [`SECURITY.md`](./SECURITY.md) para informar de vulnerabilidades y consultar la política de seguridad completa.

---

## Características

- **Juego para un solo jugador de 7 rondas** contra dos oponentes controlados por la IA (por defecto, Tesorería/Finanzas y Comerciante/Infraestructura; el Fabricante/Industria está disponible para partidas por lotes).
- **IA determinista:** cada decisión del oponente es una función pura del estado visible, con una justificación registrada. No hay modelos de lenguaje grandes (LLM), ni magia opaca.
- **8 superficies de juego:** Tablero, Panel de Tesorería, Inspector de Activos, Panel de Eventos, Actos del Congreso, Pistas Compartidas, Registro de Turnos/Registro, Informe de Fin de Juego.
- **Subastas:** los activos rechazados se subastan a varios jugadores con ofertas programadas basadas en el perfil.
- **Guardar/cargar:** autoguardado en `localStorage` en cada turno, exportación/importación manual en formato JSON, verificación de la integridad mediante hash al cargar, versión controlada.
- **Revisión:** reproducción completa de cualquier juego completado. Solo lectura. Reconstruye a partir de la semilla y el registro de decisiones con una "píldora" de integridad verde.
- **Simulación por lotes:** ejecute 10/50/100 juegos deterministas contra cualquier combinación de perfiles, exporte informes en formato JSON y HTML para el análisis del equilibrio.
- **Narración histórica:** biblioteca de 25 entradas derivada del registro (descripciones predeterminadas de 40 a 60 palabras, expansiones de 150 a 200 palabras, resumen de la república al final del juego de aproximadamente 300 a 500 palabras). Nunca modifica el estado.
- **Accesibilidad:** navegación completa con el teclado, indicadores de enfoque, etiquetas significativas para lectores de pantalla, valores de las pistas legibles como texto y no solo como marcadores, tamaño mínimo de fuente de 14px, respeto de la reducción de la animación.

---

## Conjunto de perfiles (v0.10)

| Perfil | Prioridad de activos | Fortaleza | Debilidad |
|--------------------------------|---------------------------------------------------------------|----------------------|-------------------------------------|
| **Treasury / Finance**         | NF > Deuda Estatal > Deuda Fiscal > Banco > Casa de la Moneda | Aumento del crédito público | Sin ingresos por infraestructura |
| **Merchant / Infrastructure**  | Rutas (las 4) > Comercio > Mejoras > Ingresos | Escalera de rutas | Sin puntuación de capacidad industrial |
| **Manufacturer / Industry**    | Fabricación > Industria Estratégica > Mejoras > Banco | Multiplicadores de capacidad | Inicio lento; obtiene una Carta inicial |

El cuarto perfil conceptual (Oportunista/Efectivo) se pospone. El conjunto competitivo bloqueado de la versión 0.10 consta de tres.

---

## Limitaciones conocidas

- **La versión v1.1.2 es una beta.** Los datos provienen de la simulación por lotes integrada en el HTML (100 / 100 juegos terminan por circuito, duración media de 23 rondas, división de ganadores 56 / 19 / 25). **No** ha sido jugada completamente por un jugador humano. Trátela como una opción a elegir hasta que la hayas probado tú mismo.
- **Los perfiles de IA aún no compiten por circuitos.** Utilizan las funciones de decisión de la versión v0.18: juegan para acumular influencia en lugar de competir para llegar al cuarto circuito. Los jugadores humanos reales pueden comportarse de manera muy diferente una vez que comprendan la condición de finalización.
- **Desencadenar ≠ ganar.** El jugador que completa el cuarto circuito solo gana por influencia en aproximadamente un tercio de los juegos. Esto es intencional: el cálculo final recompensa la profundidad económica, no la velocidad alrededor del tablero. La copia del final del juego hace que esta distinción sea explícita.
- **La parte final de la República es larga y no tiene Actas.** Las Actas siguen activándose en las rondas 1-7. El juego medio dura aproximadamente 23 rondas, dejando aproximadamente 16 rondas de la República tardía sin nuevos eventos políticos. Si esto parece vacío en un juego sin intervención, la siguiente solución es una redistribución de las Actas, no un retorno al mandato.
- **El Tesoro / Finanzas sigue siendo intencionalmente el más fuerte**, dentro del rango objetivo. Esto coincide con la tesis histórica: el crédito público y las finanzas federales fueron el principal instrumento económico de Hamilton.
- **Los eventos de fallo (Impago / Rebelión) siguen siendo principalmente decorativos.** La Crisis de Crédito se activa ocasionalmente; el Impago y la Rebelión casi nunca. El sistema de escalada tiene más tiempo para desarrollarse, pero aún así rara vez alcanza los niveles superiores. Las versiones futuras podrían revisar la presión de los estados de fallo.

---

## Construcción y contribución

```bash
git clone https://github.com/mcp-tool-shop-org/sovereign
cd sovereign
npm install
npm test           # smoke tests
npm run verify     # full verify (smoke + pack-dry-run + CLI flag check)
npm run play       # open the game locally
```

Las versiones se publican en npm a través de GitHub Actions (`release.yml`) al realizar un "push" en la etiqueta `v*`, con la certificación de origen de Sigstore. La fuente de información es la rama `main`.

---

## Licencia

MIT © mcp-tool-shop. Consulte el archivo [`LICENSE`](./LICENSE).

---

<div align="center">

Desarrollado por <a href="https://mcp-tool-shop.github.io/">MCP Tool Shop</a>

</div
