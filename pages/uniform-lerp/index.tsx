import { PerspectiveCamera } from "@react-three/drei"
import { Canvas, useFrame } from "@react-three/fiber"
import { Perf } from "r3f-perf"
import * as React from "react"
import * as THREE from "three"

import vertexShader from "@/public/shaders/uniform-lerp/vertex.glsl"
import fragmentShader from "@/public/shaders/uniform-lerp/fragment.glsl"
import { convertHexToGLSLRGB } from "@/lib/utils"

export default function UniformLerp() {
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="relative w-full h-full">
        <Scene />
      </div>
    </div>
  )
}

function Scene() {
  return (
    <Canvas shadows>
      <color attach="background" args={["#ffffff"]} />

      <PerspectiveCamera makeDefault position={[0, 0, 4]} near={0.1} fov={50} />

      <ambientLight intensity={0.75} />

      <React.Suspense fallback={null}>
        <Geometry />
      </React.Suspense>

      <Perf position="top-left" style={{ transform: "scale(1)" }} />
    </Canvas>
  )
}

function Geometry() {
  const groupRef = React.useRef<THREE.Group>(null)
  const materialRef = React.useRef<THREE.ShaderMaterial>(null)

  const uniforms = React.useMemo(
    () => ({
      color: { value: new THREE.Vector4(1.0, 0.356, 0.29, 1) },
    }),
    []
  )

  const colors = React.useRef([
    new THREE.Color().setFromVector3(convertHexToGLSLRGB("#0075CE")),
    new THREE.Color().setFromVector3(convertHexToGLSLRGB("#FF5B4A")),
    new THREE.Color().setFromVector3(convertHexToGLSLRGB("#73C6E4")),
    new THREE.Color().setFromVector3(convertHexToGLSLRGB("#FFEBAA")),
  ])

  const currentColor = React.useRef(colors.current.length - 1)

  const t = React.useRef<number>(1)

  const transitionDuration = 0.4 // seconds

  useFrame((state, delta) => {
    if (!materialRef.current) return

    const c1 = colors.current[currentColor.current]
    const c2 = colors.current[(currentColor.current + 1) % colors.current.length]

    const lerped = c1.clone().lerp(c2, t.current)

    // Update t.current based on delta time
    t.current += delta / transitionDuration
    if (t.current > 1) t.current = 1 // Clamp t.current to 1

    materialRef.current.uniforms.color.value = new THREE.Vector4(lerped.r, lerped.g, lerped.b, 1)
  })

  const handlePointerDown = () => {
    currentColor.current = (currentColor.current + 1) % colors.current.length
    t.current = 0
  }

  return (
    <>
      <group ref={groupRef} onPointerDown={handlePointerDown}>
        <mesh geometry={new THREE.PlaneGeometry(5, 2)}>
          <shaderMaterial
            ref={materialRef}
            vertexShader={vertexShader}
            fragmentShader={fragmentShader}
            uniforms={uniforms}
          />
        </mesh>
      </group>
    </>
  )
}
