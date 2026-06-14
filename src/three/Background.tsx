import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Stars } from '@react-three/drei'

// Faint distant nebula clouds painted with large additive points.
function DistantNebula() {
  const ref = useRef<THREE.Points>(null!)
  const geo = useMemo(() => {
    const N = 600
    const g = new THREE.BufferGeometry()
    const pos = new Float32Array(N * 3)
    const col = new Float32Array(N * 3)
    const size = new Float32Array(N)
    const palette = [
      new THREE.Color('#2a1a55'),
      new THREE.Color('#15324f'),
      new THREE.Color('#3a1540'),
    ]
    const v = new THREE.Vector3()
    for (let i = 0; i < N; i++) {
      v.set(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1)
        .normalize()
        .multiplyScalar(40 + Math.random() * 30)
      pos.set([v.x, v.y, v.z], i * 3)
      const c = palette[(Math.random() * palette.length) | 0]
      col.set([c.r, c.g, c.b], i * 3)
      size[i] = 30 + Math.random() * 50
    }
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    g.setAttribute('aColor', new THREE.BufferAttribute(col, 3))
    g.setAttribute('aSize', new THREE.BufferAttribute(size, 1))
    return g
  }, [])

  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        uniforms: { uOpacity: { value: 0.5 } },
        vertexShader: /* glsl */ `
          attribute float aSize; attribute vec3 aColor; varying vec3 vColor;
          void main(){ vColor=aColor; vec4 mv=modelViewMatrix*vec4(position,1.0);
            gl_Position=projectionMatrix*mv; gl_PointSize=aSize*(300.0/-mv.z); }`,
        fragmentShader: /* glsl */ `
          uniform float uOpacity; varying vec3 vColor;
          void main(){ vec2 c=gl_PointCoord-0.5; float d=length(c);
            if(d>0.5) discard; float a=smoothstep(0.5,0.0,d)*uOpacity;
            gl_FragColor=vec4(vColor,a); }`,
      }),
    [],
  )

  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.005
  })

  return <points ref={ref} geometry={geo} material={mat} />
}

export function Background() {
  return (
    <>
      <Stars radius={120} depth={60} count={6000} factor={4} saturation={0} fade speed={0.3} />
      <DistantNebula />
    </>
  )
}
