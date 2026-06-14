import { create } from 'zustand'
import { type Lang, type MassClass, trackById } from '../data/stars'

export const SPEEDS = [0.5, 1, 2, 4] as const

interface AppState {
  lang: Lang
  massClass: MassClass
  pos: number // continuous timeline position (0 .. phases-1)
  autoplay: boolean
  speed: number // autoplay speed multiplier
  compare: boolean
  compareMass: MassClass
  infoOpen: boolean

  toggleLang: () => void
  setMass: (m: MassClass) => void
  setPos: (p: number) => void
  toggleAutoplay: () => void
  setAutoplay: (v: boolean) => void
  setSpeed: (s: number) => void
  toggleCompare: () => void
  setCompareMass: (m: MassClass) => void
  setInfoOpen: (v: boolean) => void
  toggleInfoOpen: () => void
  next: () => void
  prev: () => void
}

const maxPos = (m: MassClass) => trackById(m).phases.length - 1
const wideScreen = typeof window === 'undefined' || window.innerWidth > 760

export const useStore = create<AppState>((set, get) => ({
  lang: 'it',
  massClass: 'sun',
  pos: 2, // start on the main sequence for the sun-like track
  autoplay: false,
  speed: 1,
  compare: false,
  compareMass: 'massive',
  infoOpen: wideScreen,

  toggleLang: () => set((s) => ({ lang: s.lang === 'it' ? 'en' : 'it' })),
  setMass: (m) =>
    set((s) => ({ massClass: m, pos: Math.min(s.pos, maxPos(m)), autoplay: false })),
  setPos: (p) => set({ pos: Math.max(0, Math.min(p, maxPos(get().massClass))) }),
  toggleAutoplay: () =>
    set((s) => {
      const max = maxPos(s.massClass)
      // restart from the beginning if pressing play at the end of the timeline
      if (!s.autoplay && s.pos >= max - 0.001) return { autoplay: true, pos: 0 }
      return { autoplay: !s.autoplay }
    }),
  setAutoplay: (v) => set({ autoplay: v }),
  setSpeed: (v) => set({ speed: v }),
  toggleCompare: () => set((s) => ({ compare: !s.compare })),
  setCompareMass: (m) => set({ compareMass: m }),
  setInfoOpen: (v) => set({ infoOpen: v }),
  toggleInfoOpen: () => set((s) => ({ infoOpen: !s.infoOpen })),
  next: () =>
    set((s) => ({
      pos: Math.min(Math.round(s.pos) + 1, maxPos(s.massClass)),
      autoplay: false,
    })),
  prev: () =>
    set((s) => ({ pos: Math.max(Math.round(s.pos) - 1, 0), autoplay: false })),
}))
