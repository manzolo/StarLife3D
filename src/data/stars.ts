// StarLife 3D — scientific lifecycle data
// Sources: NASA, ESO, stellar evolution models. Values are representative.

export type Lang = 'it' | 'en'
export type MassClass = 'low' | 'sun' | 'massive'

export type PhaseKind =
  | 'nebula'
  | 'protostar'
  | 'main'
  | 'giant'
  | 'whiteDwarf'
  | 'neutron'
  | 'blackhole'
  | 'supernova'

export interface PhaseVisual {
  kind: PhaseKind
  radius: number // display radius (scene units)
  temperature: number // Kelvin, drives surface color
  turbulence: number // surface noise amplitude
  noiseScale: number
  flowSpeed: number
  emissive: number // emission intensity
  bloom: number // target bloom intensity
  particles: 'none' | 'wind' | 'flares' | 'cloud' | 'explosion' | 'disk' | 'jets'
  spin: number
}

export interface Bi {
  it: string
  en: string
}

export interface Phase {
  id: string
  name: Bi
  visual: PhaseVisual
  data: {
    duration: Bi
    temperature: string
    luminosity: string
    radius: string
    mass: string
  }
  physics: Bi
  examples: string
}

export interface StarTrack {
  id: MassClass
  label: Bi
  massRange: string
  phases: Phase[]
}

export const TRACKS: StarTrack[] = [
  {
    id: 'low',
    label: { it: 'Piccola massa (< 0.5 M☉)', en: 'Low mass (< 0.5 M☉)' },
    massRange: '< 0.5 M☉',
    phases: [
      {
        id: 'nebula',
        name: { it: 'Nebulosa', en: 'Nebula' },
        visual: { kind: 'nebula', radius: 0.35, temperature: 1200, turbulence: 0.9, noiseScale: 1.4, flowSpeed: 0.15, emissive: 0.4, bloom: 0.6, particles: 'cloud', spin: 0.04 },
        data: { duration: { it: '~1 milione di anni', en: '~1 million years' }, temperature: '10–50 K', luminosity: '—', radius: 'anni luce / light-years', mass: '< 0.5 M☉' },
        physics: { it: 'Una nube molecolare di gas e polvere collassa sotto la propria gravità, frammentandosi in grumi densi che diventeranno stelle.', en: 'A molecular cloud of gas and dust collapses under its own gravity, fragmenting into dense clumps that will become stars.' },
        examples: 'Nebulosa di Orione / Orion Nebula (M42)',
      },
      {
        id: 'protostar',
        name: { it: 'Protostella', en: 'Protostar' },
        visual: { kind: 'protostar', radius: 1.0, temperature: 2800, turbulence: 0.55, noiseScale: 2.0, flowSpeed: 0.25, emissive: 0.9, bloom: 0.7, particles: 'wind', spin: 0.12 },
        data: { duration: { it: '~10–100 milioni di anni', en: '~10–100 million years' }, temperature: '~2000–3000 K', luminosity: '0.01–0.1 L☉', radius: '~2 R☉', mass: '< 0.5 M☉' },
        physics: { it: 'Il nucleo si scalda per contrazione gravitazionale ma non ha ancora innescato la fusione stabile dell’idrogeno.', en: 'The core heats up through gravitational contraction but has not yet ignited stable hydrogen fusion.' },
        examples: 'Oggetti stellari giovani (YSO)',
      },
      {
        id: 'reddwarf',
        name: { it: 'Nana Rossa', en: 'Red Dwarf' },
        visual: { kind: 'main', radius: 0.55, temperature: 3200, turbulence: 0.3, noiseScale: 2.6, flowSpeed: 0.18, emissive: 1.2, bloom: 0.7, particles: 'flares', spin: 0.1 },
        data: { duration: { it: 'Fino a 10 mila miliardi di anni', en: 'Up to 10 trillion years' }, temperature: '2500–3800 K', luminosity: '0.0001–0.01 L☉', radius: '0.1–0.5 R☉', mass: '0.08–0.5 M☉' },
        physics: { it: 'Fonde idrogeno molto lentamente ed è completamente convettiva: brucia tutto il suo combustibile e vive enormemente a lungo.', en: 'Fuses hydrogen very slowly and is fully convective: it burns all its fuel and lives extraordinarily long.' },
        examples: 'Proxima Centauri, Stella di Barnard',
      },
      {
        id: 'whitedwarf',
        name: { it: 'Nana Bianca (He)', en: 'White Dwarf (He)' },
        visual: { kind: 'whiteDwarf', radius: 0.26, temperature: 16000, turbulence: 0.12, noiseScale: 4.0, flowSpeed: 0.08, emissive: 1.6, bloom: 0.8, particles: 'none', spin: 0.05 },
        data: { duration: { it: 'Raffreddamento per miliardi di anni', en: 'Cools over billions of years' }, temperature: '8000–30000 K', luminosity: '~0.001 L☉', radius: '~0.01 R☉ (≈ Terra)', mass: '~0.3 M☉' },
        physics: { it: 'Teorico: nessuna nana rossa ha ancora avuto il tempo di morire. Resterebbe un residuo di elio degenere che si raffredda lentamente.', en: 'Theoretical: no red dwarf has had time to die yet. It would leave a degenerate helium remnant that slowly cools.' },
        examples: 'Previsione modellistica / Model prediction',
      },
    ],
  },
  {
    id: 'sun',
    label: { it: 'Tipo solare (0.5–8 M☉)', en: 'Sun-like (0.5–8 M☉)' },
    massRange: '0.5–8 M☉',
    phases: [
      {
        id: 'nebula',
        name: { it: 'Nebulosa', en: 'Nebula' },
        visual: { kind: 'nebula', radius: 0.4, temperature: 1500, turbulence: 0.9, noiseScale: 1.4, flowSpeed: 0.15, emissive: 0.5, bloom: 0.7, particles: 'cloud', spin: 0.04 },
        data: { duration: { it: '~1–2 milioni di anni', en: '~1–2 million years' }, temperature: '10–50 K', luminosity: '—', radius: 'anni luce / light-years', mass: '0.5–8 M☉' },
        physics: { it: 'Una regione densa di una nube molecolare collassa; la conservazione del momento angolare forma un disco protoplanetario.', en: 'A dense region of a molecular cloud collapses; conservation of angular momentum forms a protoplanetary disk.' },
        examples: 'Nebulosa Aquila / Eagle Nebula (M16)',
      },
      {
        id: 'protostar',
        name: { it: 'Protostella', en: 'Protostar' },
        visual: { kind: 'protostar', radius: 1.4, temperature: 3000, turbulence: 0.55, noiseScale: 2.0, flowSpeed: 0.28, emissive: 1.0, bloom: 0.8, particles: 'wind', spin: 0.14 },
        data: { duration: { it: '~50 milioni di anni', en: '~50 million years' }, temperature: '~3000–4000 K', luminosity: '1–10 L☉', radius: '2–5 R☉', mass: '0.5–8 M☉' },
        physics: { it: 'La protostella emette potenti getti bipolari e vento stellare mentre continua ad accrescere massa dal disco.', en: 'The protostar emits powerful bipolar jets and stellar wind while still accreting mass from the disk.' },
        examples: 'T Tauri',
      },
      {
        id: 'main',
        name: { it: 'Sequenza Principale', en: 'Main Sequence' },
        visual: { kind: 'main', radius: 1.0, temperature: 5800, turbulence: 0.32, noiseScale: 2.8, flowSpeed: 0.22, emissive: 1.3, bloom: 0.85, particles: 'flares', spin: 0.1 },
        data: { duration: { it: '~10 miliardi di anni', en: '~10 billion years' }, temperature: '5000–6000 K', luminosity: '1 L☉', radius: '1 R☉', mass: '1 M☉' },
        physics: { it: 'Equilibrio idrostatico: la fusione dell’idrogeno in elio nel nucleo bilancia esattamente la gravità. Fase più lunga e stabile.', en: 'Hydrostatic equilibrium: hydrogen-to-helium fusion in the core exactly balances gravity. The longest, most stable phase.' },
        examples: 'Il Sole / The Sun, Alpha Centauri A',
      },
      {
        id: 'giant',
        name: { it: 'Gigante Rossa', en: 'Red Giant' },
        visual: { kind: 'giant', radius: 3.6, temperature: 3500, turbulence: 0.45, noiseScale: 1.8, flowSpeed: 0.12, emissive: 1.0, bloom: 0.8, particles: 'wind', spin: 0.05 },
        data: { duration: { it: '~1 miliardo di anni', en: '~1 billion years' }, temperature: '3000–4000 K', luminosity: '100–1000 L☉', radius: '10–100 R☉', mass: '~1 M☉' },
        physics: { it: 'Esaurito l’idrogeno nel nucleo, gli strati esterni si espandono e si raffreddano; inizia la fusione dell’elio in carbonio.', en: 'With core hydrogen exhausted, the outer layers expand and cool; helium begins fusing into carbon.' },
        examples: 'Aldebaran, Arturo / Arcturus',
      },
      {
        id: 'planetary',
        name: { it: 'Nebulosa Planetaria', en: 'Planetary Nebula' },
        visual: { kind: 'nebula', radius: 0.5, temperature: 9000, turbulence: 0.8, noiseScale: 1.2, flowSpeed: 0.1, emissive: 0.7, bloom: 0.9, particles: 'cloud', spin: 0.03 },
        data: { duration: { it: '~10 mila anni', en: '~10 thousand years' }, temperature: 'nucleo ~100000 K', luminosity: 'variabile', radius: '~1 anno luce / light-year', mass: '~0.6 M☉ residuo' },
        physics: { it: 'Gli strati esterni vengono espulsi gentilmente, illuminati dal nucleo caldo esposto, formando un guscio di gas colorato.', en: 'The outer layers are gently expelled, lit by the exposed hot core, forming a colorful shell of gas.' },
        examples: 'Nebulosa Anello / Ring Nebula (M57), Helix',
      },
      {
        id: 'whitedwarf',
        name: { it: 'Nana Bianca', en: 'White Dwarf' },
        visual: { kind: 'whiteDwarf', radius: 0.27, temperature: 20000, turbulence: 0.1, noiseScale: 4.0, flowSpeed: 0.07, emissive: 1.8, bloom: 0.9, particles: 'none', spin: 0.04 },
        data: { duration: { it: 'Si raffredda per miliardi di anni', en: 'Cools over billions of years' }, temperature: '8000–40000 K', luminosity: '0.0001–0.1 L☉', radius: '~0.01 R☉ (≈ Terra)', mass: '~0.6 M☉' },
        physics: { it: 'Resta un nucleo di carbonio e ossigeno sostenuto dalla pressione di degenerazione degli elettroni. Non fonde più: si raffredda lentamente.', en: 'A carbon-oxygen core remains, supported by electron degeneracy pressure. No longer fusing: it slowly cools.' },
        examples: 'Sirio B / Sirius B',
      },
    ],
  },
  {
    id: 'massive',
    label: { it: 'Massiccia (> 8 M☉)', en: 'Massive (> 8 M☉)' },
    massRange: '> 8 M☉',
    phases: [
      {
        id: 'nebula',
        name: { it: 'Nebulosa', en: 'Nebula' },
        visual: { kind: 'nebula', radius: 0.45, temperature: 2000, turbulence: 1.0, noiseScale: 1.3, flowSpeed: 0.18, emissive: 0.6, bloom: 0.8, particles: 'cloud', spin: 0.05 },
        data: { duration: { it: '~100 mila anni', en: '~100 thousand years' }, temperature: '10–50 K', luminosity: '—', radius: 'anni luce / light-years', mass: '> 8 M☉' },
        physics: { it: 'Le regioni più massicce collassano rapidamente; la forte radiazione UV ionizza il gas circostante (regione H II).', en: 'The most massive regions collapse rapidly; intense UV radiation ionizes surrounding gas (H II region).' },
        examples: 'Nebulosa Carena / Carina Nebula',
      },
      {
        id: 'protostar',
        name: { it: 'Protostella massiccia', en: 'Massive Protostar' },
        visual: { kind: 'protostar', radius: 1.8, temperature: 4500, turbulence: 0.6, noiseScale: 1.8, flowSpeed: 0.35, emissive: 1.4, bloom: 1.0, particles: 'jets', spin: 0.2 },
        data: { duration: { it: '~100 mila anni', en: '~100 thousand years' }, temperature: '~4000–6000 K', luminosity: '1000+ L☉', radius: '~10 R☉', mass: '> 8 M☉' },
        physics: { it: 'Accrescimento rapidissimo con getti relativistici. La stella raggiunge in fretta condizioni estreme di temperatura.', en: 'Extremely rapid accretion with relativistic jets. The star quickly reaches extreme temperature conditions.' },
        examples: 'Protostelle nelle regioni OB',
      },
      {
        id: 'main',
        name: { it: 'Sequenza Principale (O/B)', en: 'Main Sequence (O/B)' },
        visual: { kind: 'main', radius: 1.6, temperature: 25000, turbulence: 0.35, noiseScale: 3.0, flowSpeed: 0.3, emissive: 1.8, bloom: 1.1, particles: 'wind', spin: 0.14 },
        data: { duration: { it: '~3–10 milioni di anni', en: '~3–10 million years' }, temperature: '20000–40000 K', luminosity: '10000–1000000 L☉', radius: '5–15 R☉', mass: '> 8 M☉' },
        physics: { it: 'Fonde idrogeno a ritmo furioso, emette intensa luce UV blu e perde massa con venti stellari potentissimi. Vita breve.', en: 'Fuses hydrogen at a furious rate, emits intense blue UV light and loses mass through powerful stellar winds. Short-lived.' },
        examples: 'Rigel, Spica',
      },
      {
        id: 'supergiant',
        name: { it: 'Supergigante Rossa', en: 'Red Supergiant' },
        visual: { kind: 'giant', radius: 4.6, temperature: 3500, turbulence: 0.55, noiseScale: 1.5, flowSpeed: 0.1, emissive: 1.1, bloom: 0.9, particles: 'wind', spin: 0.03 },
        data: { duration: { it: '~1 milione di anni', en: '~1 million years' }, temperature: '3000–4500 K', luminosity: '100000+ L☉', radius: '100–1500 R☉', mass: '> 8 M☉' },
        physics: { it: 'Fonde elementi sempre più pesanti in gusci concentrici (carbonio, ossigeno, silicio…) fino a formare un nucleo di ferro inerte.', en: 'Fuses progressively heavier elements in concentric shells (carbon, oxygen, silicon…) until an inert iron core forms.' },
        examples: 'Betelgeuse, Antares',
      },
      {
        id: 'supernova',
        name: { it: 'Supernova (Tipo II)', en: 'Supernova (Type II)' },
        visual: { kind: 'supernova', radius: 1.2, temperature: 12000, turbulence: 1.0, noiseScale: 1.0, flowSpeed: 0.6, emissive: 3.0, bloom: 2.0, particles: 'explosion', spin: 0.1 },
        data: { duration: { it: 'Esplosione in secondi, bagliore per settimane', en: 'Explodes in seconds, glows for weeks' }, temperature: 'miliardi di K (core)', luminosity: 'fino a 10 miliardi L☉', radius: 'shockwave a ~10000 km/s', mass: 'rilascia gli elementi pesanti' },
        physics: { it: 'Il nucleo di ferro collassa in millisecondi; il rimbalzo genera un’onda d’urto catastrofica che disintegra la stella, forgiando gli elementi pesanti.', en: 'The iron core collapses in milliseconds; the rebound drives a catastrophic shockwave that shreds the star, forging heavy elements.' },
        examples: 'SN 1987A, Nebulosa del Granchio / Crab (SN 1054)',
      },
      {
        id: 'neutron',
        name: { it: 'Stella di Neutroni / Pulsar', en: 'Neutron Star / Pulsar' },
        visual: { kind: 'neutron', radius: 0.18, temperature: 600000, turbulence: 0.08, noiseScale: 5.0, flowSpeed: 0.05, emissive: 2.2, bloom: 1.4, particles: 'jets', spin: 1.6 },
        data: { duration: { it: 'Stabile per miliardi di anni', en: 'Stable for billions of years' }, temperature: '~600000 K superficie', luminosity: 'fasci radio/X', radius: '~10–12 km', mass: '1.4–2.2 M☉' },
        physics: { it: 'Materia degenere di neutroni incredibilmente densa. Ruota rapidamente emettendo fasci di radiazione: se puntano verso di noi, è una pulsar.', en: 'Incredibly dense degenerate neutron matter. It spins rapidly, emitting beams of radiation: if they point at us, it is a pulsar.' },
        examples: 'Pulsar del Granchio / Crab Pulsar, PSR B1919+21',
      },
      {
        id: 'blackhole',
        name: { it: 'Buco Nero', en: 'Black Hole' },
        visual: { kind: 'blackhole', radius: 0.45, temperature: 9000, turbulence: 0.2, noiseScale: 2.0, flowSpeed: 0.5, emissive: 1.5, bloom: 1.2, particles: 'disk', spin: 0.6 },
        data: { duration: { it: 'Praticamente eterno', en: 'Effectively eternal' }, temperature: 'disco di accrescimento milioni di K', luminosity: 'estrema (se accresce)', radius: 'orizzonte ~30 km (10 M☉)', mass: '> ~2.5–3 M☉' },
        physics: { it: 'Per le stelle più massicce il collasso del nucleo è inarrestabile: si forma una singolarità con un orizzonte degli eventi da cui nulla sfugge.', en: 'For the most massive stars the core collapse is unstoppable: a singularity forms with an event horizon from which nothing escapes.' },
        examples: 'Cygnus X-1, Sagittarius A* (supermassiccio)',
      },
    ],
  },
]

export function trackById(id: MassClass): StarTrack {
  return TRACKS.find((t) => t.id === id) ?? TRACKS[1]
}
