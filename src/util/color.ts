import * as THREE from 'three'

// Approximate black-body color from temperature (Kelvin).
// Based on Tanner Helland's algorithm, clamped to a pleasant range.
export function temperatureToColor(kelvin: number): THREE.Color {
  const temp = THREE.MathUtils.clamp(kelvin, 1000, 40000) / 100
  let r: number, g: number, b: number

  if (temp <= 66) {
    r = 255
    g = 99.4708025861 * Math.log(temp) - 161.1195681661
  } else {
    r = 329.698727446 * Math.pow(temp - 60, -0.1332047592)
    g = 288.1221695283 * Math.pow(temp - 60, -0.0755148492)
  }

  if (temp >= 66) {
    b = 255
  } else if (temp <= 19) {
    b = 0
  } else {
    b = 138.5177312231 * Math.log(temp - 10) - 305.0447927307
  }

  const clamp = (v: number) => THREE.MathUtils.clamp(v, 0, 255) / 255
  return new THREE.Color(clamp(r), clamp(g), clamp(b))
}
