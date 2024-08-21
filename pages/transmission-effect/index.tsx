import { MeshTransmissionMaterial, OrbitControls, PerspectiveCamera, Stats } from "@react-three/drei"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Bloom, BrightnessContrast, EffectComposer, HueSaturation, TiltShift2 } from "@react-three/postprocessing"
import { useControls } from "leva"
import * as React from "react"
import * as THREE from "three"

export interface TransmissionEffectProps {}

export default function TransmissionEffect(props: TransmissionEffectProps) {
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
    <Canvas>
      <color attach="background" args={["#000000"]} />

      <PerspectiveCamera makeDefault position={[0, 0, 4]} near={0.1} fov={50} />
      {/* <OrthographicCamera makeDefault position={[0, 0, 10]} near={0.1} zoom={50} /> */}

      <ambientLight intensity={12.2} />
      <directionalLight castShadow position={[20, 20, 20]} intensity={0.11} />
      <pointLight position={[20, 0, 20]} intensity={10} />

      {/* <Environment preset="studio" backgroundBlurriness={4} /> */}

      <EffectComposer>
        <HueSaturation saturation={-0.1} />
        <BrightnessContrast brightness={0} contrast={0.1} />
        {/* <WaterEffect factor={0.75} /> */}
        <TiltShift2 samples={6} blur={0.2} />
        <Bloom mipmapBlur luminanceThreshold={0} intensity={0.4} />
        {/* <ToneMapping /> */}
      </EffectComposer>
      <React.Suspense fallback={null}>
        <Geometry />
      </React.Suspense>
      {/* <Rig /> */}
      <OrbitControls />
      <Stats />
    </Canvas>
  )
}

function Geometry() {
  const groupRef = React.useRef<THREE.Group>(null)
  const boxRef = React.useRef<THREE.Group>(null)

  const w = 1
  const h = 50
  const d = 2

  const materialProps = useControls({
    transmissionSampler: true,
    backside: false,
    samples: { value: 10, min: 1, max: 32, step: 1 },
    resolution: { value: 256, min: 256, max: 2048, step: 256 },
    transmission: { value: 1, min: 0, max: 1 },
    metalness: { value: 0, min: 0, max: 1 },
    roughness: { value: 0.2, min: 0, max: 1, step: 0.01 },
    thickness: { value: 8.5, min: 0, max: 10, step: 0.01 },
    ior: { value: 5, min: 1, max: 5, step: 0.01 },
    chromaticAberration: { value: 0.06, min: 0, max: 1 },
    anisotropy: { value: 0.1, min: 0, max: 1, step: 0.01 },
    distortion: { value: 1, min: 0, max: 1, step: 0.01 },
    distortionScale: { value: 0.25, min: 0.01, max: 1, step: 0.01 },
    temporalDistortion: { value: 0.05, min: 0, max: 1, step: 0.01 },
    clearcoat: { value: 1, min: 0, max: 1 },
    attenuationDistance: { value: 0.5, min: 0, max: 10, step: 0.01 },
    attenuationColor: "#ffffff",
    color: "#ffffff",
  })

  const { pointer } = useThree()
  const vec = new THREE.Vector3()
  const vec2 = new THREE.Vector3()

  useFrame(() => {
    if (!boxRef.current) return
    if (!groupRef.current) return

    boxRef.current.position.lerp(vec.set(pointer.x * 2, pointer.y / 2, boxRef.current.position.z), 0.09)
    const hipotenus = Math.pow(pointer.x, 2) + Math.pow(pointer.y, 2)
    boxRef.current.scale.lerp(vec2.set(1 - hipotenus, 1 - hipotenus, boxRef.current.scale.z), 0.09)
  })

  const itemCount = 50
  const fullCircle = 2 * Math.PI

  return (
    <>
      <group
        ref={groupRef}
        position={new THREE.Vector3(0, 0, 0)}
        scale={1.25}
        rotation={new THREE.Euler(0, 0, fullCircle * 1.1)}
      >
        {new Array(itemCount).fill("lol").map((item, i) => (
          <group key={i}>
            <mesh
              geometry={new THREE.CylinderGeometry(w, w, h, 64)}
              position={new THREE.Vector3((w / 10) * i - (w * itemCount) / 20, 0, 0)}
              scale={0.1}
              rotation={new THREE.Euler(0, 0, 0)}
            >
              <MeshTransmissionMaterial {...materialProps} />
            </mesh>
          </group>
        ))}
      </group>

      <group rotation={new THREE.Euler(0, 0, 0)} ref={boxRef}>
        <mesh
          geometry={new THREE.BoxGeometry(20, 20, 1)}
          position={new THREE.Vector3(0, 0, -0.5)}
          scale={0.1}
          material={new THREE.MeshStandardMaterial({ color: "#F05D21" })}
        ></mesh>
      </group>
    </>
  )
}

function Rig() {
  const { camera, pointer } = useThree()
  const vec = new THREE.Vector3()
  return useFrame(() => camera.position.lerp(vec.set(pointer.x / 4, pointer.y / 16, camera.position.z), 0.09))
}
