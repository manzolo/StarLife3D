import { create } from 'zustand'
import { type Lang, type MassClass, trackById } from '../data/stars'

interface AppState {
  lang: Lang
  massClass: MassClass
  pos: number // continuous timeline position (0 .. phases-1)
  autoplay: boolean
  compare: boolean
  compareMass: MassClass

  toggleLang: () => void
  setMass: (m: MassClass) => void
  setPos: (p: number) => void
  toggleAutoplay: () => void
  setAutoplay: (v: boolean) => void
  toggleCompare: () => void
  setCompareMass: (m: MassClass) => void
  next: () => void
  prev: () => void
}

const maxPos = (m: MassClass) => trackById(m).phases.length - 1

export const useStore = create<AppState>((set, get) => ({
  lang: 'it',
  massClass: 'sun',
  pos: 2, // start on the main sequence for the sun-like track
  autoplay: false,
  compare: false,
  compareMass: 'massive',

  toggleLang: () => set((s) => ({ lang: s.lang === 'it' ? 'en' : 'it' })),
  setMass: (m) =>
    set((s) => ({ massClass: m, pos: Math.min(s.pos, maxPos(m)), autoplay: false })),
  setPos: (p) => set({ pos: Math.max(0, Math.min(p, maxPos(get().massClass))) }),
  toggleAutoplay: () => set((s) => ({ autoplay: !s.autoplay })),
  setAutoplay: (v) => set({ autoplay: v }),
  toggleCompare: () => set((s) => ({ compare: !s.compare })),
  setCompareMass: (m) => set({ compareMass: m }),
  next: () =>
    set((s) => ({
      pos: Math.min(Math.round(s.pos) + 1, maxPos(s.massClass)),
      autoplay: false,
    })),
  prev: () =>
    set((s) => ({ pos: Math.max(Math.round(s.pos) - 1, 0), autoplay: false })),
}))
