import * as THREE from 'three'
import type { StarTrack } from '../data/stars'
import { temperatureToColor } from '../util/color'

export interface VisState {
  radius: number
  turbulence: number
  noiseScale: number
  flowSpeed: number
  emissive: number
  bloom: number
  spin: number
  color: THREE.Color
  // layer weights (0..1)
  core: number
  nebula: number
  blackhole: number
  neutron: number
  supernova: number
  // particle-mode weights
  wind: number
  flares: number
  jets: number
  cloud: number
  disk: number
}

const _a = new THREE.Color()
const _b = new THREE.Color()

export function makeVisState(): VisState {
  return {
    radius: 1,
    turbulence: 0.3,
    noiseScale: 2.5,
    flowSpeed: 0.2,
    emissive: 1.3,
    bloom: 1,
    spin: 0.1,
    color: new THREE.Color('#ffffff'),
    core: 1,
    nebula: 0,
    blackhole: 0,
    neutron: 0,
    supernova: 0,
    wind: 0,
    flares: 0,
    jets: 0,
    cloud: 0,
    disk: 0,
  }
}

function accumulate(out: VisState, track: StarTrack, idx: number, amount: number) {
  const ph = track.phases[idx]
  const v = ph.visual
  out.radius += v.radius * amount
  out.turbulence += v.turbulence * amount
  out.noiseScale += v.noiseScale * amount
  out.flowSpeed += v.flowSpeed * amount
  out.emissive += v.emissive * amount
  out.bloom += v.bloom * amount
  out.spin += v.spin * amount

  switch (v.kind) {
    case 'nebula':
      out.nebula += amount
      break
    case 'blackhole':
      out.blackhole += amount
      break
    case 'neutron':
      out.neutron += amount
      out.core += amount
      break
    case 'supernova':
      out.supernova += amount
      out.core += amount
      break
    default:
      out.core += amount
  }

  if (v.particles !== 'none' && v.particles !== 'explosion') {
    out[v.particles] += amount
  }
}

// Mutates `out` in place to avoid per-frame allocations.
export function getVisualAt(out: VisState, track: StarTrack, pos: number): VisState {
  const max = track.phases.length - 1
  const p = THREE.MathUtils.clamp(pos, 0, max)
  const i0 = Math.floor(p)
  const i1 = Math.min(i0 + 1, max)
  const f = p - i0

  // reset accumulators
  out.radius = out.turbulence = out.noiseScale = out.flowSpeed = 0
  out.emissive = out.bloom = out.spin = 0
  out.core = out.nebula = out.blackhole = out.neutron = out.supernova = 0
  out.wind = out.flares = out.jets = out.cloud = out.disk = 0

  accumulate(out, track, i0, 1 - f)
  accumulate(out, track, i1, f)

  _a.copy(temperatureToColor(track.phases[i0].visual.temperature))
  _b.copy(temperatureToColor(track.phases[i1].visual.temperature))
  out.color.copy(_a).lerp(_b, f)

  return out
}
