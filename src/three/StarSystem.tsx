import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { StarTrack } from '../data/stars'
import {
  starVertexShader,
  starFragmentShader,
  coronaVertexShader,
  coronaFragmentShader,
} from '../shaders/star'
import { getVisualAt, makeVisState } from './interpolate'
import { fxState } from './fx'

const EJECTA_COUNT = 1400
const NEBULA_COUNT = 2200

// ---- particle shaders ----
const ejectaVert = /* glsl */ `
  attribute vec3 aDir;
  attribute float aSpeed;
  attribute float aOffset;
  attribute float aSize;
  uniform float uTime;
  uniform float uMode;     // 0 wind, 1 flares, 2 jets, 3 explosion
  uniform float uProgress; // 0..1 for explosion
  uniform float uRadius;
  uniform float uSpread;
  varying float vLife;
  void main() {
    float life;
    vec3 dir = aDir;
    if (uMode < 2.5 && uMode >= 1.5) {
      // jets: bias direction toward poles
      dir = normalize(vec3(aDir.x * 0.25, sign(aDir.y) * (0.7 + abs(aDir.y)), aDir.z * 0.25));
    }
    if (uMode > 2.5) {
      life = uProgress; // explosion
    } else {
      life = fract(uTime * aSpeed * 0.12 + aOffset);
    }
    float dist = uRadius + life * uSpread * aSpeed;
    vec3 pos = dir * dist;
    vLife = 1.0 - life;
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * uRadius * (300.0 / -mv.z) * (0.4 + vLife);
  }
`
const ejectaFrag = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying float vLife;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.0, d) * vLife * uOpacity;
    gl_FragColor = vec4(uColor, a);
  }
`

const nebulaVert = /* glsl */ `
  attribute float aSize;
  attribute vec3 aColor;
  uniform float uTime;
  uniform float uScale;
  varying vec3 vColor;
  void main() {
    vColor = aColor;
    vec3 p = position;
    float s = sin(uTime * 0.1 + p.x * 0.5);
    float c = cos(uTime * 0.1 + p.z * 0.5);
    p.xz += vec2(s, c) * 0.15;
    vec4 mv = modelViewMatrix * vec4(p * uScale, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * (260.0 / -mv.z);
  }
`
const nebulaFrag = /* glsl */ `
  uniform float uOpacity;
  varying vec3 vColor;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.0, d) * uOpacity;
    gl_FragColor = vec4(vColor, a * 0.6);
  }
`

const diskVert = /* glsl */ `
  varying float vRad;
  varying float vAng;
  void main() {
    vRad = length(position.xy);
    vAng = atan(position.y, position.x);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`
const diskFrag = /* glsl */ `
  uniform float uTime;
  uniform float uOpacity;
  varying float vRad;
  varying float vAng;
  void main() {
    // ring spans radius 0.35 (inner) -> 1.0 (outer)
    float r = clamp((vRad - 0.35) / 0.65, 0.0, 1.0);
    float swirl = sin(vAng * 6.0 + uTime * 4.0 - vRad * 22.0) * 0.5 + 0.5;
    float heat = smoothstep(1.0, 0.0, r);
    vec3 hot = vec3(1.0, 0.9, 0.6);
    vec3 cool = vec3(1.0, 0.3, 0.08);
    vec3 col = mix(cool, hot, heat) * (0.5 + 0.9 * swirl);
    float edge = smoothstep(0.0, 0.08, r) * smoothstep(1.0, 0.8, r);
    gl_FragColor = vec4(col * 1.7, edge * uOpacity);
  }
`

function buildEjecta() {
  const g = new THREE.BufferGeometry()
  const pos = new Float32Array(EJECTA_COUNT * 3)
  const dir = new Float32Array(EJECTA_COUNT * 3)
  const speed = new Float32Array(EJECTA_COUNT)
  const offset = new Float32Array(EJECTA_COUNT)
  const size = new Float32Array(EJECTA_COUNT)
  const v = new THREE.Vector3()
  for (let i = 0; i < EJECTA_COUNT; i++) {
    v.set(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1).normalize()
    dir.set([v.x, v.y, v.z], i * 3)
    speed[i] = 0.5 + Math.random() * 1.8
    offset[i] = Math.random()
    size[i] = 0.02 + Math.random() * 0.05
  }
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  g.setAttribute('aDir', new THREE.BufferAttribute(dir, 3))
  g.setAttribute('aSpeed', new THREE.BufferAttribute(speed, 1))
  g.setAttribute('aOffset', new THREE.BufferAttribute(offset, 1))
  g.setAttribute('aSize', new THREE.BufferAttribute(size, 1))
  return g
}

function buildNebula() {
  const g = new THREE.BufferGeometry()
  const pos = new Float32Array(NEBULA_COUNT * 3)
  const col = new Float32Array(NEBULA_COUNT * 3)
  const size = new Float32Array(NEBULA_COUNT)
  const palette = [
    new THREE.Color('#5b6cff'),
    new THREE.Color('#b25bff'),
    new THREE.Color('#ff5b8a'),
    new THREE.Color('#3fd0ff'),
    new THREE.Color('#ff9d5b'),
  ]
  const v = new THREE.Vector3()
  for (let i = 0; i < NEBULA_COUNT; i++) {
    const r = Math.pow(Math.random(), 0.5) * 6
    v.set(Math.random() * 2 - 1, (Math.random() * 2 - 1) * 0.55, Math.random() * 2 - 1)
      .normalize()
      .multiplyScalar(r)
    pos.set([v.x, v.y, v.z], i * 3)
    const c = palette[(Math.random() * palette.length) | 0]
    col.set([c.r, c.g, c.b], i * 3)
    size[i] = 0.3 + Math.random() * 1.4
  }
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  g.setAttribute('aColor', new THREE.BufferAttribute(col, 3))
  g.setAttribute('aSize', new THREE.BufferAttribute(size, 1))
  return g
}

interface Props {
  track: StarTrack
  getPos: () => number
  primary?: boolean
}

export function StarSystem({ track, getPos, primary = false }: Props) {
  const vis = useRef(makeVisState())
  const group = useRef<THREE.Group>(null!)
  const core = useRef<THREE.Mesh>(null!)
  const corona = useRef<THREE.Mesh>(null!)
  const ejecta = useRef<THREE.Points>(null!)
  const nebula = useRef<THREE.Points>(null!)
  const horizon = useRef<THREE.Mesh>(null!)
  const disk = useRef<THREE.Mesh>(null!)
  const beams = useRef<THREE.Group>(null!)
  const shock = useRef<THREE.Mesh>(null!)
  const sn = useRef({ active: false, t: 0 })

  const coreMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: starVertexShader,
        fragmentShader: starFragmentShader,
        transparent: true,
        uniforms: {
          uTime: { value: 0 },
          uColor: { value: new THREE.Color('#ffaa33') },
          uTurbulence: { value: 0.3 },
          uNoiseScale: { value: 2.5 },
          uFlowSpeed: { value: 0.2 },
          uEmissive: { value: 1.3 },
          uOpacity: { value: 1 },
        },
      }),
    [],
  )
  const coronaMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: coronaVertexShader,
        fragmentShader: coronaFragmentShader,
        transparent: true,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        uniforms: {
          uColor: { value: new THREE.Color('#ffcc66') },
          uIntensity: { value: 1 },
        },
      }),
    [],
  )
  const ejectaMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: ejectaVert,
        fragmentShader: ejectaFrag,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        uniforms: {
          uTime: { value: 0 },
          uMode: { value: 0 },
          uProgress: { value: 0 },
          uRadius: { value: 1 },
          uSpread: { value: 3 },
          uColor: { value: new THREE.Color('#ffddaa') },
          uOpacity: { value: 0 },
        },
      }),
    [],
  )
  const nebulaMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: nebulaVert,
        fragmentShader: nebulaFrag,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        uniforms: { uTime: { value: 0 }, uScale: { value: 1 }, uOpacity: { value: 0 } },
      }),
    [],
  )
  const diskMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: diskVert,
        fragmentShader: diskFrag,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
        uniforms: { uTime: { value: 0 }, uOpacity: { value: 0 } },
      }),
    [],
  )

  const ejectaGeo = useMemo(buildEjecta, [])
  const nebulaGeo = useMemo(buildNebula, [])

  useFrame((state, dt) => {
    const v = getVisualAt(vis.current, track, getPos())
    const time = state.clock.elapsedTime
    const d = Math.min(dt, 0.05)

    // ---- supernova one-shot ----
    const inSN = v.supernova > 0.4
    if (inSN && !sn.current.active) {
      sn.current.active = true
      sn.current.t = 0
    } else if (!inSN) {
      sn.current.active = false
    }
    if (sn.current.active) sn.current.t = Math.min(1, sn.current.t + d * 0.45)
    const snP = sn.current.t
    const snEase = 1 - Math.pow(1 - snP, 3)
    const flash = sn.current.active ? Math.max(0, 1 - snP * 1.6) : 0

    // ---- core ----
    if (group.current) group.current.rotation.y += d * v.spin
    const coreVisible = v.core
    core.current.visible = coreVisible > 0.01
    if (core.current.visible) {
      core.current.scale.setScalar(v.radius)
      coreMat.uniforms.uTime.value = time
      coreMat.uniforms.uColor.value.copy(v.color)
      coreMat.uniforms.uTurbulence.value = v.turbulence
      coreMat.uniforms.uNoiseScale.value = v.noiseScale
      coreMat.uniforms.uFlowSpeed.value = v.flowSpeed
      coreMat.uniforms.uEmissive.value = v.emissive + flash * 3
      coreMat.uniforms.uOpacity.value = coreVisible
    }

    // ---- corona ----
    corona.current.visible = coreVisible > 0.01
    if (corona.current.visible) {
      corona.current.scale.setScalar(v.radius * (1.35 + v.bloom * 0.15))
      coronaMat.uniforms.uColor.value.copy(v.color)
      coronaMat.uniforms.uIntensity.value = (0.6 + v.bloom * 0.6) * coreVisible + flash * 2
    }

    // ---- ejecta (wind / flares / jets / explosion) ----
    let mode = 0
    let op = 0
    if (sn.current.active) {
      mode = 3
      op = Math.max(v.wind, v.flares, v.jets, 0.2) + 0.8
      ejectaMat.uniforms.uSpread.value = 10
      ejectaMat.uniforms.uProgress.value = snEase
    } else {
      ejectaMat.uniforms.uSpread.value = 3
      if (v.jets > v.wind && v.jets > v.flares) {
        mode = 2
        op = v.jets
      } else if (v.flares >= v.wind) {
        mode = 1
        op = v.flares
      } else {
        mode = 0
        op = v.wind
      }
    }
    ejecta.current.visible = op > 0.01
    if (ejecta.current.visible) {
      ejectaMat.uniforms.uTime.value = time
      ejectaMat.uniforms.uMode.value = mode
      ejectaMat.uniforms.uRadius.value = Math.max(v.radius, 0.3)
      ejectaMat.uniforms.uOpacity.value = op
      ejectaMat.uniforms.uColor.value
        .copy(v.color)
        .lerp(new THREE.Color('#ffffff'), 0.3)
    }

    // ---- shockwave sphere (supernova) ----
    shock.current.visible = sn.current.active && snP < 0.95
    if (shock.current.visible) {
      shock.current.scale.setScalar(0.5 + snEase * 9)
      ; (shock.current.material as THREE.MeshBasicMaterial).opacity =
        Math.max(0, 1 - snP) * 0.5
    }

    // ---- nebula cloud ----
    nebula.current.visible = v.cloud > 0.01
    if (nebula.current.visible) {
      nebulaMat.uniforms.uTime.value = time
      nebulaMat.uniforms.uScale.value = 0.8 + v.radius
      nebulaMat.uniforms.uOpacity.value = v.cloud
      nebula.current.rotation.y += d * 0.02
    }

    // ---- black hole ----
    horizon.current.visible = v.blackhole > 0.01
    disk.current.visible = v.blackhole > 0.01 || v.disk > 0.01
    if (horizon.current.visible) {
      horizon.current.scale.setScalar(v.radius)
      ; (horizon.current.material as THREE.MeshBasicMaterial).opacity = v.blackhole
    }
    if (disk.current.visible) {
      diskMat.uniforms.uTime.value = time
      diskMat.uniforms.uOpacity.value = Math.max(v.blackhole, v.disk)
      disk.current.scale.setScalar(v.radius * 3.2)
      disk.current.rotation.z += d * 0.4
    }

    // ---- pulsar beams ----
    beams.current.visible = v.neutron > 0.01
    if (beams.current.visible) {
      beams.current.rotation.y += d * v.spin * 3
      beams.current.children.forEach((c) => {
        const m = (c as THREE.Mesh).material as THREE.MeshBasicMaterial
        m.opacity = v.neutron * 0.5
      })
      beams.current.scale.setScalar(Math.max(v.radius, 0.18))
    }

    if (primary) {
      fxState.bloom = v.bloom + flash * 1.5
    }
  })

  return (
    <group ref={group}>
      {/* star surface */}
      <mesh ref={core} material={coreMat}>
        <sphereGeometry args={[1, 64, 64]} />
      </mesh>
      {/* corona */}
      <mesh ref={corona} material={coronaMat}>
        <sphereGeometry args={[1, 32, 32]} />
      </mesh>
      {/* ejecta particles */}
      <points ref={ejecta} geometry={ejectaGeo} material={ejectaMat} />
      {/* supernova shockwave */}
      <mesh ref={shock} visible={false}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color="#fff0d0"
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>
      {/* nebula cloud */}
      <points ref={nebula} geometry={nebulaGeo} material={nebulaMat} />
      {/* black hole event horizon */}
      <mesh ref={horizon} visible={false}>
        <sphereGeometry args={[1, 48, 48]} />
        <meshBasicMaterial color="#000000" transparent opacity={0} />
      </mesh>
      {/* accretion disk */}
      <mesh ref={disk} rotation={[Math.PI / 2.2, 0, 0]} material={diskMat} visible={false}>
        <ringGeometry args={[0.35, 1, 96, 1]} />
      </mesh>
      {/* pulsar beams */}
      <group ref={beams} rotation={[0.4, 0, 0.2]} visible={false}>
        <mesh position={[0, 2.4, 0]}>
          <coneGeometry args={[0.9, 5, 24, 1, true]} />
          <meshBasicMaterial
            color="#9fd8ff"
            transparent
            opacity={0}
            blending={THREE.AdditiveBlending}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
        <mesh position={[0, -2.4, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.9, 5, 24, 1, true]} />
          <meshBasicMaterial
            color="#9fd8ff"
            transparent
            opacity={0}
            blending={THREE.AdditiveBlending}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      </group>
    </group>
  )
}
