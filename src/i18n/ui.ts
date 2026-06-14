import type { Lang } from '../data/stars'

export const UI = {
  title: { it: 'StarLife 3D', en: 'StarLife 3D' },
  subtitle: {
    it: 'Il ciclo di vita delle stelle in 3D',
    en: 'The life cycle of stars in 3D',
  },
  massFilter: { it: 'Massa stellare', en: 'Stellar mass' },
  timeline: { it: 'Linea temporale', en: 'Timeline' },
  autoplay: { it: 'Accelerazione temporale', en: 'Time acceleration' },
  play: { it: 'Avvia', en: 'Play' },
  pause: { it: 'Pausa', en: 'Pause' },
  speed: { it: 'Velocità', en: 'Speed' },
  compare: { it: 'Confronta', en: 'Compare' },
  compareOn: { it: 'Vista doppia attiva', en: 'Split view on' },
  duration: { it: 'Durata', en: 'Duration' },
  temperature: { it: 'Temperatura', en: 'Temperature' },
  luminosity: { it: 'Luminosità', en: 'Luminosity' },
  radius: { it: 'Raggio', en: 'Radius' },
  mass: { it: 'Massa', en: 'Mass' },
  physics: { it: 'Cosa succede', en: 'What happens' },
  examples: { it: 'Esempi reali', en: 'Real examples' },
  curiosity: { it: 'Lo sapevi?', en: 'Did you know?' },
  shuffle: { it: 'Altra curiosità', en: 'Another fact' },
  source: { it: 'Fonte', en: 'Source' },
  sources: { it: 'Fonti', en: 'Sources' },
  phase: { it: 'Fase', en: 'Phase' },
  next: { it: 'Successiva', en: 'Next' },
  prev: { it: 'Precedente', en: 'Previous' },
  hint: {
    it: 'Trascina per ruotare · scorri per zoom · usa la timeline per evolvere la stella',
    en: 'Drag to rotate · scroll to zoom · use the timeline to evolve the star',
  },
  of: { it: 'di', en: 'of' },
} as const

export function t(key: keyof typeof UI, lang: Lang): string {
  return UI[key][lang]
}
