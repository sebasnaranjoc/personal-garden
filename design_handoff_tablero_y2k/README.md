# Handoff: Tablero "Árbol de ideas" — rediseño Y2K (Personal Garden)

## Overview
Rediseño visual de la pantalla **Tablero** de Personal Garden (app de jardín/ideas personales) con estética web Y2K / early-2000s: marcos biselados, botones tipo píldora con sombra dura, marquee, contador de visitas, tipografías chunky. Paleta **azul + verde**. El panel izquierdo es el formulario de "Entradas"; el área derecha es el **tablero libre** (canvas vacío) donde el usuario arrastra tarjetas de idea.

## About the Design Files
Los archivos de este paquete son **referencias de diseño hechas en HTML** — prototipos que muestran la apariencia y el comportamiento deseados, **no código de producción para copiar tal cual**. La tarea es **recrear estos diseños dentro del entorno existente del proyecto** (React/Next, Vue, Django templates, etc.) usando sus patrones y librerías. Si aún no hay entorno, elegir el framework adecuado e implementarlo ahí.

`Arbol de Ideas Y2K.dc.html` usa un runtime interno de prototipado (`<x-dc>`, `{{ }}`, `sc-for`) — **ignorar ese runtime**; lo relevante son los estilos inline, la estructura y las medidas.

## Fidelity
**High-fidelity.** Colores, tipografías, radios, sombras y copy son finales. Reproducir 1:1 salvo que el codebase tenga tokens equivalentes.

## Screens / Views

### Tablero (única vista)
**Propósito:** crear entradas de idea y colocarlas libremente en un lienzo.

**Layout general** (`min-height:100vh`, `background:#04222f`, `padding:10px`, columna):
1. **Header** (barra superior)
2. **Marquee** (30px de alto)
3. **Fila principal** (`flex:1`): sidebar 330px fijo + tablero `flex:1`
4. **Footer** de estado

Fuentes: `Bungee` (títulos/botón principal), `VT323` (labels, marquee, cifras), `Comic Neue` 400/700 (texto de UI), `Verdana` como base del body. Google Fonts.

#### 1. Header
- `background: linear-gradient(180deg,#6fd8ff 0%,#0aa3e0 45%,#0a5f95 100%)`
- `border:3px solid #fff`, `border-radius:16px 16px 0 0`, `box-shadow:0 0 0 3px #08507e, 0 6px 0 rgba(0,0,0,.35)`, `padding:10px 18px`, contenido `space-between`.
- **Logo**: círculo 38px, `radial-gradient(circle at 32% 28%,#fff,#c9ffd8 40%,#2fd672 100%)`, borde 3px blanco, glifo `✿` 19px.
- **Wordmark**: "personal garden", Bungee 23px, `#fff`, `letter-spacing:1px`, `text-shadow:2px 2px 0 #0a5f95, 4px 4px 0 rgba(0,0,0,.25)`.
- **Badge**: "v2.0 ~ beta!", VT323 19px, texto `#e6faff`, fondo `#0a5f95`, borde 2px `#fff`, `border-radius:20px`, `padding:0 10px`.
- **Nav** (gap 8px), pills Comic Neue 700 14px, `border-radius:20px`, `padding:7px 16px`, borde 2px blanco:
  - Inactivos: texto `#0a5f95`, `linear-gradient(180deg,#fff,#cceeff)`, `box-shadow:0 3px 0 #08507e`. **Hover**: `linear-gradient(180deg,#d6ffe4,#3ce87a)` + texto `#0d5c30`.
  - Activo ("★ tablero"): texto `#0d5c30`, `linear-gradient(180deg,#d6ffe4,#3ce87a)`, `box-shadow:0 3px 0 #14814a`.
  - Items: inicio · proyectos · ★ tablero · contacto.

#### 2. Marquee
- Altura 30px, `background:linear-gradient(180deg,#062b3a,#03151d)`, bordes laterales 3px `#fff`, `box-shadow:0 0 0 3px #08507e`, `overflow:hidden`.
- Texto VT323 21px, `#3ce87a`, `text-shadow:0 0 8px #3ce87a`, desplazamiento continuo **26s linear infinite** (`translateX(0) → translateX(-50%)`, el contenido se duplica para loop sin costura).
- Copy: `★ bienvenida a tu jardín de ideas ★ arrastra una entrada al tablero ★ guarda tus semillas antes de salir ★ 8 ideas plantadas hoy ★`

#### 3. Sidebar "entradas" (330px)
- `background:linear-gradient(180deg,#ffffff,#e6f7ff)`, borde 3px `#fff`, `box-shadow:0 0 0 3px #08507e, 0 8px 0 rgba(0,0,0,.3)`, `border-radius:0 0 0 16px`, `padding:14px`, columna con `gap:12px`, `overflow:auto`.
- **Título** "entradas": Bungee 19px `#0aa3e0`, `text-shadow:1.5px 1.5px 0 #cceeff`. A la derecha botón "cancelar": Comic Neue 700 12px `#5a5a5a`, `linear-gradient(180deg,#fff,#dcdcdc)`, `box-shadow:0 3px 0 #9a9a9a`, `radius:16px`, `padding:5px 14px`.
- **Labels** ("★ título", "★ descripción", "★ imagen"): VT323 18px `#0a5f95`, `letter-spacing:.5px`.
- **Inputs**: `border:2px inset #7fd4f5`, `radius:10px`, `padding:9px 11px`, `background:#fff`, texto `#04303f`, `box-shadow:inset 0 2px 4px rgba(10,95,149,.2)`. Input Comic Neue 15px; textarea 14px, alto 70px, `resize:none`.
  - Placeholders: "ponle nombre a tu idea" / "escribe lo que se te ocurra..."
- **Imagen**: botón "examinar..." (Comic Neue 700 12px `#0d5c30`, `linear-gradient(180deg,#d6ffe4,#3ce87a)`, `box-shadow:0 3px 0 #14814a`, `radius:14px`, `padding:6px 12px`) + nombre de archivo VT323 17px `#5b7f8f`.
  - **Preview 120px**: borde 3px `#0aa3e0`, `radius:12px`, patrón `repeating-linear-gradient(45deg,#e2f6ff 0 8px,#cceeff 8px 16px)`, `box-shadow:inset 0 0 0 2px #fff`; dentro chip VT323 17px `#3d87a8` con borde `#7fd4f5` y texto `[ foto de la idea ]` (placeholder — sustituir por la imagen real subida).
- **Botón "crear entrada ★"**: Bungee 17px `#fff`, `linear-gradient(180deg,#6fd8ff,#0aa3e0 55%,#0a5f95)`, borde 3px `#fff`, `radius:14px`, `padding:12px`, `box-shadow:0 5px 0 #073f63, 0 0 14px rgba(10,163,224,.7)`, `text-shadow:2px 2px 0 #08507e`. **:active** → `transform:translateY(4px)` y `box-shadow:0 1px 0 #073f63`.
- **Nota de ayuda**: caja `border:2px dashed #3ce87a`, `radius:12px`, `background:#effff5`, Comic Neue 12.5px `#0d5c30`, `line-height:1.5`. Copy: "Crea una entrada y **arrástrala al tablero**. Puedes devolverla soltándola aquí ✿".
- **Pie del sidebar** (`margin-top:auto`):
  - Contador: caja `border:3px double #0aa3e0`, `radius:10px`, fondo `#fff`; label VT323 18px `#0a5f95` "visitantes del jardín"; cifra VT323 26px `#3ce87a` sobre `#062b3a`, borde 2px `#14577a`, `radius:6px`, `letter-spacing:6px`, valor `0042917`.
  - "★ mejor visto en 1024x768 ★": VT323 17px `#0aa3e0`, **parpadeo** `steps(1) 1.1s infinite` (opacidad 1 → .25).

#### 4. Tablero (área derecha) — **lienzo libre**
- `flex:1`, `position:relative`, `overflow:hidden`, borde 3px `#fff` (sin borde izquierdo), `box-shadow:0 0 0 3px #08507e, 0 8px 0 rgba(0,0,0,.3)`, `border-radius:0 0 16px 0`.
- Fondo: `radial-gradient(circle at 20% 15%,#ffffff 0%,#d9f7ff 22%,#8fe3d2 55%,#2fb6c9 100%)`.
- Capa decorativa (`inset:0`, `pointer-events:none`): tres burbujas blancas (`radial-gradient` en 12%/70%, 78%/22%, 55%/88%) + rejilla de 34px con líneas `rgba(255,255,255,.12)` en ambos ejes.
- Capa de tema (`themeWash`, ver Tokens/estado): overlay `pointer-events:none` con gradiente según tema.
- **Estrellas**: 9 glifos `★` blancos, posiciones absolutas `[70,160] [350,120] [690,150] [1060,300] [240,620] [610,660] [930,600] [420,410] [1090,90]`, tamaño `14 + (i%3)*7` px, `text-shadow:0 0 10px #0aa3e0`, animación `twinkle` (`scale(1)→scale(1.5) rotate(25deg)`, opacidad .9→.35), duración `2.2 + (i%4)*0.6`s, delay `i*0.25`s.
- **Sin tarjetas ni conectores por diseño**: el área queda libre para que la app coloque ahí las entradas arrastradas (drop target).

#### 5. Footer
- VT323 18px `#7fd4f5`, `space-between`, `padding:8px 4px 0`.
- Izquierda: "© 2004 personal garden ~ hecho con ★ en notepad".
- Derecha: dos chips `background:#062b3a`, `border:2px outset #2b93c4`, `radius:4px`, `padding:1px 8px` → "guardado ✓" (texto `#3ce87a`) y "firma el libro de visitas".

## Interactions & Behavior
- Inputs controlados (título, descripción); "crear entrada" limpia ambos campos (en producción: crear la entrada y añadirla al tablero).
- Hover en nav: azul → verde. Active en botones biselados: bajan 4px y la sombra dura pasa a 1px (efecto de pulsación 3D).
- Marquee y parpadeo son `infinite`; respetar `prefers-reduced-motion` si el codebase lo maneja.
- Drag & drop pendiente de implementar: arrastrar la entrada del sidebar al tablero; soltarla de vuelta en el sidebar la devuelve.
- Sin estados de carga/error definidos; el tablero tiene scroll cuando el contenido exceda el viewport.

## State Management
- `title: string`, `desc: string` — formulario controlado.
- `theme: 'cielo' | 'menta' | 'laguna'` — overlay del tablero.
- `showGlitter: boolean` — muestra/oculta las estrellas.
- En producción se añade: lista de entradas con `{id, title, desc, image, x, y}` persistida en el backend, y estado de arrastre.

## Design Tokens
**Colores**
- Azul primario `#0aa3e0`; claro `#6fd8ff`; oscuro `#0a5f95`; más oscuro `#08507e` / `#073f63`
- Azules suaves: `#cceeff`, `#e6f7ff`, `#d9f7ff`, `#e2f6ff`, `#7fd4f5`
- Verde primario `#3ce87a`; claro `#d6ffe4`; medio `#2fd672`; oscuro `#14814a` / `#0d5c30`; fondo suave `#effff5`
- Turquesa del tablero: `#8fe3d2`, `#2fb6c9`
- Oscuros: `#04222f` (body), `#062b3a`, `#03151d`, `#04303f` (texto), `#14577a`, `#2b93c4`
- Neutros: `#fff`, `#dcdcdc`, `#9a9a9a`, `#5a5a5a`, `#5b7f8f`, `#3d87a8`

**Espaciado**: 4 / 5 / 6 / 8 / 10 / 12 / 14 / 18 px. Sidebar 330px; header pad `10px 18px`; marquee 30px.

**Tipografía**: Bungee 13–23px (títulos); VT323 17–26px (labels/valores); Comic Neue 12–15px (texto, 700 en botones); Verdana base.

**Radios**: 4, 6, 8, 10, 12, 14, 16, 20 (pills), 50% (círculos).

**Sombras duras (bisel)**: `0 3px 0 <dark>` (pills), `0 5px 0 #073f63` (CTA), `0 6px 0 rgba(0,0,0,.35)` (header), `0 8px 0 rgba(0,0,0,.3)` (paneles), anillo `0 0 0 3px #08507e`. Glow: `0 0 14px rgba(10,163,224,.7)`, `0 0 8px #3ce87a`.

**Animaciones**: `marquee` 26s linear; `twinkle` 2.2–4s ease-in-out; `blink` 1.1s steps(1).

## Assets
- No hay imágenes propias: los espacios de imagen son **placeholders rayados** (`repeating-linear-gradient` 45°) con etiqueta monoespaciada. Sustituir por las imágenes que suba el usuario.
- Glifos usados como iconos: `✿ ★ ✓ ♫ ←`. Sin librería de iconos.
- Fuentes: Google Fonts — Bungee, VT323, Comic Neue.
- `referencia-actual-personal-garden.png`: captura del tablero actual (antes del rediseño).
- `referencia-estilo-y2k.jpg`: referencia de estilo Y2K (marcos biselados, brillos) — **solo dirección visual**, no copiar arte.

## Files
- `Arbol de Ideas Y2K.dc.html` — diseño completo (estilos inline; ignorar el runtime `<x-dc>`/`{{ }}`).
- `referencia-actual-personal-garden.png`
- `referencia-estilo-y2k.jpg`
