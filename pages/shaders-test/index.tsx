import { Canvas, useFrame } from "@react-three/fiber"
import * as React from "react"
import * as THREE from "three"
import { OrbitControls } from "@react-three/drei"

import vertexShader from "./shaders/vertex.glsl"
import fragmentShader from "./shaders/fragment.glsl"

export interface ShadersTestProps {}

export default function ShadersTest(props: ShadersTestProps) {
  return (
    <div className="w-screen h-screen">
      <Scene />
    </div>
  )
}

function Scene() {
  return (
    <Canvas camera={{ position: [1.0, 1.5, 1.0] }}>
      <MovingPlane />
      <axesHelper />
      <OrbitControls />
    </Canvas>
  )
}

function MovingPlane() {
  // This reference will give us direct access to the mesh
  const mesh = React.useRef<THREE.Mesh>(null)

  const uniforms = React.useMemo(
    () => ({
      u_time: {
        value: 0.0,
      },
      u_colorA: { value: new THREE.Color("#FFE486") },
      u_colorB: { value: new THREE.Color("#FEB3D9") },
    }),
    []
  )

  useFrame((state) => {
    if (!mesh.current) return

    const { clock } = state

    mesh.current.material.uniforms.u_time.value = clock.getElapsedTime()
  })

  return (
    <mesh ref={mesh} position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={1.5}>
      <planeGeometry args={[1, 1, 16, 16]} />
      <shaderMaterial
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={uniforms}
        wireframe={false}
      />
    </mesh>
  )
}
