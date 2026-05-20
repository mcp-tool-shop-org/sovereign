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

## ¿Qué es?

Sovereign es un **juego de mesa al estilo "Monopoly" basado en el sistema de Hamilton**, sobre la creación del crédito público estadounidense, además de una **adaptación completa para un solo jugador / digital** que ejecuta las mismas reglas localmente en un navegador contra dos oponentes simulados y deterministas.

- **Juego de mesa** — edición imprimible de 34 hojas. Tablero con 40 casillas, 22 propiedades + 4 rutas + 2 instituciones, 8 sistemas de colores, 7 Actas del Congreso en orden histórico fijo, 4 roles de jugador, 3 pistas compartidas (Crédito Público · Resistencia Pública · Capacidad Industrial), 12+12 cartas de evento. Dos vías económicas viables además del Tesoro: Comerciante y Fabricante.
- **Modo digital** — un único archivo HTML autocontenido. Máquina de estados completa, generador de números aleatorios mulberry32 determinista, oponentes con IA programada (Tesoro / Finanzas, Comerciante / Infraestructura, Fabricante / Industria), guardar / cargar con integridad mediante hash, herramienta de análisis de repeticiones, herramienta de simulación por lotes, telemetría de equilibrio local.
- **Punto de equilibrio base** — el equilibrio central de la versión 0.10 se mantiene hasta la versión 1.1.0. Tesoro 60.0% · Comerciante 23.5% · Fabricante 16.5% (valor CANÓNICO × 400 en la base refinada de la versión 0.18; la banda objetivo se cumple para los tres perfiles).
- **Sistema de fallos** — tres niveles: **Crisis de Crédito** (Crédito Público ≤ 4, advertencia), **Rebelión** (Resistencia Pública 12, catástrofe), **Impago** (Crédito Público 0, catástrofe). Nuevo a partir de la versión 1.1.0; los puntos finales catastróficos no han cambiado desde la versión 0.10.

---

## Novedades en la versión 1.1.0

### Fundamento del sistema de fallos

La versión 1.1.0 introduce una jerarquía de fallos de tres niveles. El impago en el Crédito Público 0 se mantiene como la condición de colapso financiero catastrófico (se pierden el 50% del efectivo + 1 mejora por jugador). La rebelión en la Resistencia Pública 12 se mantiene como el colapso político catastrófico (las mejoras de ingresos se destruyen). Entre estos, un nuevo evento intermedio —**Crisis de Crédito**— se activa la primera vez que el Crédito Público baja a 4 o menos, aumenta la Resistencia en +1 y registra una fila en el registro. No restablece el Crédito, no destruye activos y no termina el juego.

Para que la capa de fallos sea realmente visible durante el juego, cuatro cartas de presión ahora reducen el Crédito:

| Carta | Efecto |
|---|---|
| Huida bancaria | Crédito Público −1, Capacidad Industrial −1 |
| Fiebre especulativa (Crédito ≥ 7) | Crédito Público −1, Resistencia +1, subasta de deudas/impuestos estatales no reclamados |
| Fiebre especulativa (Crédito ≤ 6) | Crédito Público −2, Resistencia +1, subasta de deudas/impuestos estatales no reclamados |
| Panfleto antifederalista | Crédito Público −1, Resistencia +1, 30 TN por propiedad del sistema de ingresos |

La Ley de Financiamiento en la ronda 1 sigue añadiendo +2 Crédito. El punto final catastrófico de Impago se mantiene como un límite dramático, no como un objetivo de equilibrio; la Crisis de Crédito proporciona la señal activa.

Evidencia CANÓNICA-400 (semillas 2026 – 2425): Tesoro 60.0% · Comerciante 23.5% · Fabricante 16.5%. La Crisis de Crédito se activa 2 / 400 veces. El Impago se activa 0 / 400 veces. La Rebelión se activa 0 / 400 veces. La Resistencia ≥ 8 se mantiene en 0 / 400. Determinismo: PASADO. Evidencia completa en `experiments/v0.18-failure-pressure-candidate/sovereign-v0.18-evidence-sweep.html`.

### Pulido visual general del juego

Cada elemento visible para el jugador está diseñado visualmente como un producto coherente del Tesoro Federalista:

- Logotipo superior + etiqueta de modo + una versión discreta (ya no es un encabezado del panel de telemetría)
- Superposición de orientación al cargar por primera vez que introduce las tres pistas y los tres niveles de fallo
- Losetas del tablero con cresta en las esquinas, bandas de color del sistema, tratamientos distintos para instituciones, rutas, impuestos y espacios de eventos
- Las filas del registro para `CREDIT_CRISIS` / `DEFAULT` / `REBELLION` tienen tratamientos de gravedad distintos (color + borde + etiqueta; con atención a la accesibilidad)
- El panel de pistas marca la banda de advertencia de la Crisis de Crédito (1–4) y los puntos finales de Impago y Rebelión
- El informe de final de juego muestra fichas de postura (postura del crédito / estado de Crisis / estado de Rebelión) sobre las columnas de puntuación, con una narración que menciona explícitamente los resultados de Crisis / Impago / Rebelión
- El modal de simulación por lotes se ha reformulado como "Ejecución de evidencia de equilibrio"
- Punto de interrupción responsivo ≤ 768 px y una hoja de estilo para impresión.

La documentación de referencia del sistema de diseño y una auditoría visual de quince fotogramas se encuentran en el directorio `release/design-system/`. Estos son los registros definitivos de cómo se ve la interfaz de usuario de la versión 1.1.0.

### Mecánicas conservadas

La auditoría de la promoción v0.18 superó las 44 pruebas en las áreas de origen, implementación, regresión, evidencia de equilibrio/fallos y preparación de la documentación. El hash del estado del juego canónico, generado a partir de 100 semillas, es idéntico en bytes entre la simulación de Node de la versión v0.18 y el código HTML optimizado (`3189375454`). La variable `SAVE_VERSION` sigue siendo `'v0.18-candidate'` porque ninguna mecánica cambió durante el proceso de optimización.

### Advertencia

Las mecánicas de la versión 1.1.0 se han verificado mediante simulación en el conjunto canónico de T/M/Mfg (400 semillas) y en la variante MFG-MIRROR (100 semillas). Aún no se han probado con usuarios humanos.

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

- **Los umbrales de capacidad siguen siendo raros en el juego canónico.** La capacidad final promedio es de 3,49; ≥ 6 se alcanza en solo 4 de cada 100 juegos. La puntuación industrial al final del juego existe como un límite, no como una ruta habitual.
- **La Tesorería/Finanzas sigue siendo intencionalmente la más fuerte**, dentro del rango objetivo. Esto coincide con la tesis histórica: el crédito público y las finanzas federales fueron el principal instrumento económico de Hamilton.
- **Los eventos de fallo se activaron 0/400 veces** en la prueba de la versión 0.10. Las amenazas predeterminadas de Default/Rebelión/Bancarrota son actualmente decorativas; una versión futura podría revisar la presión de los estados de fallo.
- **Solo se ha probado mediante simulación.** El equilibrio se valida contra más de 1000 juegos deterministas en el ciclo de la versión 0.3 a la 0.10. Aún no se ha probado con jugadores humanos; la desviación estratégica puede cambiar estas tasas.

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
