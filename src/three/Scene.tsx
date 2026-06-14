import { memo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import { BloomEffect } from 'postprocessing'
import * as THREE from 'three'
import { useStore } from '../state/store'
import { trackById } from '../data/stars'
import { StarSystem } from './StarSystem'
import { Background } from './Background'
import { fxState } from './fx'

function AutoplayDriver() {
  useFrame((_, dt) => {
    const s = useStore.getState()
    if (!s.autoplay) return
    const max = trackById(s.massClass).phases.length - 1
    let next = s.pos + Math.min(dt, 0.05) * 0.45
    if (next >= max) next = 0 // loop the life cycle
    s.setPos(next)
  })
  return null
}

function BloomController({ effectRef }: { effectRef: React.RefObject<BloomEffect | null> }) {
  useFrame(() => {
    const e = effectRef.current
    if (e) e.intensity = THREE.MathUtils.lerp(e.intensity, fxState.bloom, 0.08)
  })
  return null
}

// Stable references so the <Canvas> host never re-applies these on re-render.
const CAMERA = { position: [0, 1.5, 9] as [number, number, number], fov: 50 }
const DPR: [number, number] = [1, 2]
const GL = { antialias: false, powerPreference: 'high-performance' as const }

// Memoized: language/UI re-renders of the parent must NOT reconcile the 3D tree.
export const SceneCanvas = memo(function SceneCanvas() {
  const bloomRef = useRef<BloomEffect | null>(null)

  return (
    <Canvas camera={CAMERA} dpr={DPR} gl={GL}>
      <color attach="background" args={['#05060f']} />
      <ambientLight intensity={0.15} />
      <Background />
      <Stage />
      <OrbitControls
        enablePan={false}
        minDistance={3}
        maxDistance={40}
        autoRotate
        autoRotateSpeed={0.3}
        enableDamping
      />
      <AutoplayDriver />
      <BloomController effectRef={bloomRef} />
      <EffectComposer>
        <Bloom
          ref={bloomRef}
          intensity={1}
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          mipmapBlur
          radius={0.7}
        />
        <Vignette eskil={false} offset={0.2} darkness={0.85} />
      </EffectComposer>
    </Canvas>
  )
})

// Reads store with subscriptions only for structural changes (mass/compare),
// while continuous position is read imperatively each frame.
function Stage() {
  const massClass = useStore((s) => s.massClass)
  const compare = useStore((s) => s.compare)
  const compareMass = useStore((s) => s.compareMass)

  const getPos = () => useStore.getState().pos

  if (compare) {
    return (
      <>
        <group position={[-4.2, 0, 0]} scale={0.7}>
          <StarSystem track={trackById(massClass)} getPos={getPos} primary />
        </group>
        <group position={[4.2, 0, 0]} scale={0.7}>
          <StarSystem track={trackById(compareMass)} getPos={getPos} />
        </group>
      </>
    )
  }

  return <StarSystem track={trackById(massClass)} getPos={getPos} primary />
}
