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

**Estado — v1.4.0 (beta).** Primer lanzamiento con características sustanciales desde la versión v1.1.2 (circuit-victory). Añade tres capas sobre la base del circuito: **profundidad estratégica** (acciones especiales vinculadas al perfil, cartas HAND con ventanas de tiempo, recuperación de la Reforma, presión pública crediticia en múltiples etapas), **arco estratégico** (eventos de la Era Federal que se activan cada ronda a partir de la ronda 8, tres Visiones de Perfil con bonificaciones al final del juego) y **el Cronista** (una voz histórica en tercera persona que presenta 14 banners relacionados con eventos a lo largo del juego, extraídos de una base de datos de citas históricas verificadas: 27 citas reales de Hamilton / Madison / Jefferson / Adams / Gallatin / Maclay / Freneau con enlaces rastreables a founders.archives.gov, Wikisource y Library of Congress; sin atribuciones inventadas). La duración media del juego se mantiene en aproximadamente 23 rondas / 67 turnos; el cálculo final activado por el circuito permanece sin cambios. Tres caminos de perfil viables: Tesorería 59 % / Comerciante 20 % / Fabricante 21 % (CANÓNICO × 100). El juego de mesa imprimible permanece estable en la versión v0.2. Consulte el archivo `CHANGELOG.md` para obtener la lista completa de cambios y las advertencias de la versión beta.

---

## ¿Qué es?

Sovereign es un **juego de mesa al estilo "Monopoly" basado en el sistema de Hamilton**, sobre la creación del crédito público estadounidense, además de una **adaptación completa para un solo jugador / digital** que ejecuta las mismas reglas localmente en un navegador contra dos oponentes simulados y deterministas.

- **Juego de mesa** — edición imprimible de 34 hojas. Tablero de 40 casillas, 22 propiedades + 4 rutas + 2 instituciones, 8 sistemas de colores, 7 Actas del Congreso en orden histórico fijo, 4 roles de jugador, 3 pistas compartidas (Crédito Público · Resistencia Pública · Capacidad Industrial), 12+12 cartas de evento. Dos caminos económicos viables además de la Tesorería: Comerciante y Fabricante. Equilibrio de la versión v0.2, congelado.
- **Modo digital** — un único archivo HTML autocontenido. Condición de finalización basada en el circuito: el juego termina cuando un jugador completa su cuarta vez que "Treasury Opens" (la Tesorería se abre). La duración media del juego es de aproximadamente 23 rondas (67 turnos). En el cálculo final, el jugador con mayor influencia es el que gana, *no necesariamente el que ha recorrido el tablero primero*. Capa de profundidad estratégica: tres acciones especiales vinculadas al perfil, seis cartas HAND con ventanas de tiempo, acción de recuperación de la Reforma, presión crediticia en múltiples etapas (Duda Pública / Crisis / Pánico / Incumplimiento). Capa de arco estratégico: ocho eventos de la Era Federal que se activan cada ronda a partir de la ronda 8, tres Visiones de Perfil con bonificaciones al final del juego. Capa de narración del Cronista: 14 banners históricos relacionados con eventos, citas reales de los Federalist Papers y Founders Online, notificación persistente con opción de cerrar. Generador de números aleatorios mulberry32 determinista, oponentes con IA programada, guardar / cargar con integridad hash, herramienta de eliminación de repeticiones, herramienta de simulación por lotes con acceso restringido al diseñador.
- **Punto de referencia de equilibrio** — circuito + profundidad estratégica + arco estratégico + Cronista (v1.4.0 beta): Tesorería 59 % · Comerciante 20 % · Fabricante 21 % (CANÓNICO × 100). Los tres perfiles tienen posibilidades de victoria significativas. Tasas de logro de Visiones: Arquitecto del Crédito Federal 54 %, Soberano del Comercio 39 %, Fundador Industrial 29 %. Las mecánicas subyacentes de la versión v0.18 (Crisis Crediticia, puntuación de propiedad intelectual en efectivo, Carta Industrial, bonificaciones por completar conjuntos) se conservan idénticamente en bytes desde el ciclo de diseño v0.3 → v0.10 → v0.18, impulsado por más de 1000 simulaciones deterministas.

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

- **Juego de victoria por circuito único** contra dos oponentes controlados por la IA (Tesorería/Finanzas y Comercio/Infraestructura por defecto; Fabricante/Industria disponible para partidas por turnos). El juego termina cuando un jugador completa su cuarta vez que la "Tesorería se abre". La duración media es de ~23 rondas / 67 turnos. El jugador con la mayor influencia al final gana.
- **Profundidad estratégica (capa v1.2)**: tres Acciones Especiales con perfiles predefinidos (Emitir Bonos Federales / Contrato de Ruta de Correduría / Establecer Taller), 6 cartas de MANO con ventanas de tiempo (límite de 2 cartas en la mano), acción de recuperación de Reforma, presión crediticia en múltiples etapas (Duda Pública / Crisis / Pánico / Incumplimiento).
- **Arco estratégico (capa v1.3)**: 8 Eventos de la Era Federal que se activan cada ronda a partir de la ronda 8 (5 opciones + 3 automáticos), 3 Visiones de Perfil (Arquitecto del Crédito Federal / Soberano del Comercio / Fundador Industrial) con un bono de +3 Puntos de Influencia al final del juego.
- **El Cronista (capa v1.4)**: Narración histórica en tercera persona con nombres propios. 14 banners relacionados con eventos (Actas × 7 / Apertura de la Era Federal / Duda / Crisis / Pánico / Incumplimiento / Rebelión / Reforma / Visión / Cierre). Todas las citas atribuidas se verifican con fuentes de founders.archives.gov, Wikisource y la Biblioteca del Congreso. Las Actas fallidas se narran como escenarios hipotéticos de la historia real ("En nuestra historia, la Ley de Financiación de Hamilton obtuvo 32 votos frente a 29 en julio de 1790; en tu República, la discriminación contra los soldados encontró suficientes votos para cerrar la puerta."). Un marco con borde de aluminio persistente con opción de desactivación; respeta la configuración de narración (Activada/Mínima/Desactivada).
- **IA determinista**: Cada decisión del oponente es una función pura del estado visible, con una justificación registrada. No utiliza modelos de lenguaje grandes (LLM), ni magia opaca.
- **8 superficies de juego**: Tablero, Panel de Tesorería, Inspector de Activos, Cajón de Eventos, Actas del Congreso, Pistas Compartidas, Registro de Turnos / Libro Mayor, Informe Final.
- **Subastas**: Los activos rechazados se subastan a varios jugadores con ofertas programadas basadas en el perfil.
- **Guardar / Cargar**: Autoguardado en `localStorage` en cada turno, exportación / importación manual en formato JSON, verificación de la integridad mediante hash al cargar, con control de versiones.
- **Revisión**: Reproducción completa de cualquier partida finalizada. Solo lectura. Reconstruye a partir de la semilla y el registro de decisiones, con una indicación de integridad en verde.
- **Simulación por lotes**: Ejecuta 10 / 50 / 100 partidas deterministas contra cualquier combinación de perfiles, exporta informes en formato JSON + HTML para el análisis del equilibrio.
- **Narración histórica**: Biblioteca de 25 entradas derivada del libro mayor (descripciones predeterminadas de 40-60 palabras, ampliaciones de 150-200 palabras, resumen de la República al final del juego de ~300-500 palabras). Nunca modifica el estado del juego.
- **Accesibilidad**: Navegación completa con el teclado, indicadores de enfoque, etiquetas significativas para lectores de pantalla, valores de las pistas legibles como texto y no solo como marcadores, tamaño mínimo de fuente de 14px, respeto de la configuración de reducción de movimiento.

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

- **La versión v1.4.0 es una versión beta.** Cada componente principal (profundidad estratégica, arco estratégico, Crónista) ha sido revisado y validado estructuralmente mediante pruebas de simulación. La totalidad de la estructura de cuatro capas ha sido probada a nivel de componente, pero no de extremo a extremo, por un jugador humano. Los datos obtenidos son de pruebas con un valor de referencia de CANONICAL × 100: 100 de 100 activaciones del circuito, un promedio de 23 rondas, una distribución de victorias de 59 / 20 / 21, aproximadamente 6-8 cartas de Crónista por partida y aproximadamente 33 reacciones por partida. Considere esta versión como una opción hasta que la pruebe usted mismo.
- **Los perfiles de inteligencia artificial aún no se adaptan a las mecánicas de las versiones v1.2 a v1.4.** Utilizan las funciones de decisión de la versión v0.18; no "compiten por la Visión" ni "usan las cartas HAND estratégicamente" como lo haría un jugador humano. El juego real de los humanos se desviará de las mediciones de referencia de CANONICAL × 100.
- **El evento de activación no es igual al ganador.** El jugador que completa el cuarto circuito solo gana por influencia en aproximadamente un tercio de las partidas. Esto es intencional: Final Accounting recompensa la profundidad económica, no la velocidad en el tablero. La copia final del juego hace esta distinción explícita.
- **La fase de la República Tardía es larga y no incluye eventos.** Los eventos siguen activándose en las rondas 1-7. El juego promedio dura aproximadamente 23 rondas, dejando aproximadamente 16 rondas de la República Tardía sin nuevos eventos políticos. Si esto le parece vacío durante la prueba, la próxima mejora será una redistribución de eventos, no un retorno al sistema de mandatos.
- **El Tesoro / Finanzas sigue siendo intencionalmente el componente más fuerte**, dentro del rango objetivo. Esto refleja la tesis histórica: el crédito público y las finanzas federales fueron los principales instrumentos económicos de Hamilton.
- **Los eventos de fracaso (Default / Rebelión) siguen siendo principalmente decorativos.** La Crisis Crediticia se activa ocasionalmente; el Default y la Rebelión casi nunca ocurren. El sistema de escalada tiene más tiempo para desarrollarse, pero aún así rara vez alcanza los niveles superiores. Las versiones futuras podrían revisar la presión de los estados de fracaso.

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
