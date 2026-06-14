# 🌟 StarLife 3D

Un visualizzatore interattivo **3D del ciclo di vita delle stelle** — un'esperienza
educativa immersiva con timeline interattiva, transizioni animate e dati scientificamente
accurati (NASA / ESO). Testi in **italiano e inglese**.

> An interactive **3D stellar life-cycle viewer**: pick a stellar mass, scrub the timeline
> and watch a star evolve from nebula to white dwarf, neutron star or black hole.

## ✨ Funzionalità

- **Stella 3D in tempo reale** con shader GLSL (rumore simplex, granulazione, limb darkening,
  corona ed emissione luminosa).
- **Timeline interattiva** con cursore trascinabile e fasi selezionabili.
- **Tre percorsi evolutivi** per classe di massa:
  - Piccola massa (< 0.5 M☉): Nebulosa → Protostella → Nana Rossa → Nana Bianca (He)
  - Tipo solare (0.5–8 M☉): Nebulosa → Protostella → Sequenza Principale → Gigante Rossa → Nebulosa Planetaria → Nana Bianca
  - Massiccia (> 8 M☉): Nebulosa → Protostella → Sequenza Principale O/B → Supergigante Rossa → **Supernova** → Stella di Neutroni / Pulsar → Buco Nero
- **Transizioni animate**: espansione in gigante, esplosione di supernova con shockwave,
  disco di accrescimento del buco nero, fasci della pulsar.
- **Effetti particellari**: vento stellare, brillamenti, getti, eiezioni.
- **Vista doppia** per confrontare due stelle contemporaneamente.
- **Accelerazione temporale** per vedere l'intero ciclo in pochi secondi.
- **Pannello informativo** con durata, temperatura, luminosità, raggio, massa, fisica della
  fase ed esempi reali (Betelgeuse, Sirio B, SN 1987A, …).
- **Post-processing**: bloom dinamico, vignettatura, sfondo cosmico con campo stellare.

## 🛠 Stack

React 19 · TypeScript · Three.js · @react-three/fiber · @react-three/drei ·
@react-three/postprocessing · Zustand · Vite · shader GLSL.

## 🚀 Sviluppo locale

### Con Docker (consigliato)

```bash
make dev      # dev server con hot-reload  -> http://localhost:5173
make run      # build di produzione (nginx) -> http://localhost:8080
make up       # come run, ma in background
make down     # ferma il container in background
make help     # elenco di tutti i target
```

### Senza Docker

```bash
make install        # npm install
make local-dev      # vite dev server
make preview        # build + anteprima di produzione
```

## 🌐 Deploy su GitHub Pages

Il deploy è automatico tramite **GitHub Actions** (`.github/workflows/deploy.yml`):
ogni push su `main` ricostruisce e pubblica il sito.

Sito: **https://manzolo.github.io/StarLife3D/**

Il `base path` è impostato su `/StarLife3D/` tramite la variabile `BASE_PATH`
(in build locale/Docker vale `/`).

## 📚 Note scientifiche

I valori di massa, temperatura, luminosità, raggio e durata delle fasi sono
rappresentativi e basati su modelli di evoluzione stellare e dati osservativi
(NASA, ESO). Le proporzioni visive sono adattate per chiarezza didattica.
