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

</div>

---

## ¿Qué es?

Sovereign es un **juego de mesa al estilo "Monopoly" basado en el sistema de Hamilton**, que trata sobre la creación del crédito público estadounidense, además de una **adaptación completa para un solo jugador / digital** que ejecuta las mismas reglas localmente en un navegador contra dos oponentes simulados y deterministas.

- **Juego de mesa** — prototipo imprimible de 34 hojas. Tablero de 40 casillas, 22 propiedades + 4 rutas + 2 instituciones, 8 sistemas de colores, 7 leyes del Congreso en orden histórico fijo, 4 roles de jugador, 3 pistas compartidas (Crédito Público · Resistencia Pública · Capacidad Industrial), 12+12 cartas de evento. Dos vías económicas viables además del Tesoro: Comercio y Manufactura.
- **Modo digital** — un único archivo HTML autocontenido. Máquina de estados completa, generador de números aleatorios determinista mulberry32, oponentes de IA programados (Tesoro / Finanzas, Comercio / Infraestructura, Manufactura / Industria), guardar / cargar con integridad de hash, herramienta de depuración de repeticiones, herramienta de simulación por lotes, telemetría local de equilibrio.
- **Punto de equilibrio** — v0.10, congelado después de un ciclo de nueve versiones impulsado por más de 1000 simulaciones de juegos deterministas. Tesoro 59% · Comercio 25% · Manufactura 16% (CANÓNICO × 100, el rango objetivo se cumplió para los tres perfiles).

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

El prototipo del juego de mesa es un documento HTML autocontenido de 34 hojas. Abre `release/board-game/sovereign-prototype.html` desde el paquete (o desde una descarga), luego `Cmd/Ctrl-P → Guardar como PDF → Formato US Letter → 100% de escala`. Recorta y juega.

### Paquete de lanzamiento sin conexión

Cada versión etiquetada adjunta un paquete `sovereign-vX.Y.Z-release.zip` a su página de lanzamiento de GitHub. Descárgalo, descomprímelo y abre `00-START-HERE.html` para el punto de entrada específico para el usuario. Todo funciona sin conexión.

---

## ¿Por qué existe?

La tesis de Sovereign es que **el crédito público y las finanzas federales** fueron el principal instrumento económico de Alexander Hamilton, pero un juego basado en el sistema de Hamilton debe permitir que el **comercio** y la **industria** también sean vías viables para la victoria. El ciclo de equilibrio (v0.2 → v0.10) fue un esfuerzo de nueve versiones, basado en evidencia, para mantener al Tesoro como el perfil más fuerte (de acuerdo con la historia) sin convertir el diseño en un juego de una sola estrategia.

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

- **Juego de 7 rondas** contra dos oponentes controlados por scripts (por defecto, Tesorería/Finanzas y Comerciante/Infraestructura; el Fabricante/Industria está disponible para partidas por lotes).
- **Inteligencia artificial determinista:** cada decisión del oponente es una función pura del estado visible, con una justificación registrada. No hay modelos de lenguaje grandes (LLM), ni magia opaca.
- **8 superficies de juego:** Tablero, Panel de Tesorería, Inspector de Activos, Panel de Eventos, Actos del Congreso, Pistas Compartidas, Registro de Turnos/Registro, Informe de Fin de Juego.
- **Subastas:** los activos rechazados se subastan a varios jugadores con ofertas programadas basadas en el perfil.
- **Guardar/cargar:** autoguardado en `localStorage` en cada turno, exportación/importación manual de JSON, verificación de la integridad mediante hash al cargar, con control de versiones.
- **Revisión:** reproducción completa de cualquier juego completado. Solo lectura. Reconstruye a partir de la semilla y el registro de decisiones, con una "píldora" de integridad verde.
- **Simulación por lotes:** ejecute 10/50/100 juegos deterministas contra cualquier combinación de perfiles, exporte informes de JSON y HTML para el análisis del equilibrio.
- **Narración histórica:** biblioteca de 25 entradas derivada del registro (descripciones predeterminadas de 40 a 60 palabras, expansiones de 150 a 200 palabras, resumen de la república al final del juego de aproximadamente 300 a 500 palabras). Nunca modifica el estado.
- **Accesibilidad:** navegación completa con el teclado, indicadores de enfoque, etiquetas significativas para lectores de pantalla, valores de las pistas legibles como texto y no solo como marcadores, tamaño mínimo de fuente de 14px, respeto de la reducción de movimiento.

---

## Conjunto de perfiles (v0.10)

| Perfil | Prioridad de activos | Fortaleza | Debilidad |
|--------------------------------|---------------------------------------------------------------|----------------------|-------------------------------------|
| **Treasury / Finance**         | NF > Deuda estatal > Deuda de ingresos > Banco > Casa de la moneda | Aumento del crédito público | Sin ingresos por infraestructura |
| **Merchant / Infrastructure**  | Rutas (las 4) > Comercio > Mejoras > Ingresos | Escalera de rutas | Sin puntuación de capacidad industrial |
| **Manufacturer / Industry**    | Fabricación > Industria estratégica > Mejoras > Banco | Multiplicadores de capacidad | Inicio lento; obtiene una Carta inicial |

El cuarto perfil conceptual (Oportunista/Efectivo) se pospone. El conjunto competitivo bloqueado de la versión 0.10 consta de tres.

---

## Limitaciones conocidas

- **Los umbrales de capacidad siguen siendo raros en el juego canónico.** La capacidad final promedio es de 3,49; se alcanza ≥ 6 en solo 4 de cada 100 juegos. La puntuación industrial al final del juego existe como un límite, no como una ruta habitual.
- **La Tesorería/Finanzas sigue siendo intencionalmente la más fuerte**, dentro del rango objetivo. Esto coincide con la tesis histórica: el crédito público y las finanzas federales fueron el principal instrumento económico de Hamilton.
- **Los eventos de fallo se activaron 0/400 veces** en la versión de prueba 0.10. Las amenazas predeterminadas de Default/Rebelión/Bancarrota son actualmente decorativas; una versión futura podría revisar la presión de los estados de fallo.
- **Solo se ha probado en simulación.** El equilibrio se valida contra más de 1000 juegos deterministas en el ciclo de la versión 0.3 a la 0.10. Aún no se ha probado con jugadores humanos; la desviación estratégica puede cambiar estas tasas.

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

Las versiones se publican en npm a través de GitHub Actions (`release.yml`) al realizar un "push" en la etiqueta `v*`, con la certificación de origen de Sigstore. La fuente de verdad es la rama `main`.

---

## Licencia

MIT © mcp-tool-shop. Consulte el archivo [`LICENSE`](./LICENSE).

---

<div align="center">

Desarrollado por <a href="https://mcp-tool-shop.github.io/">MCP Tool Shop</a>

</div>
