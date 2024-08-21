import { MeshTransmissionMaterial, useGLTF } from "@react-three/drei"
import { extend, useFrame } from "@react-three/fiber"
import { useRef } from "react"
import * as THREE from "three"
import { GLTF } from "three-stdlib"
import { useAnimations } from "@react-three/drei"
import { useControls } from "leva"

extend({ MeshTransmissionMaterial })

type GLTFResult = GLTF & {
  nodes: {
    Dis_Ust: THREE.Mesh
    Dis_Alt: THREE.Mesh
  }
  materials: {
    ["Dientes_initialShadingGroup.001"]: THREE.MeshPhysicalMaterial
    ["Dientes_initialShadingGroup.002"]: THREE.MeshPhysicalMaterial
  }
}

export default function ToothModel(props: JSX.IntrinsicElements["group"]) {
  const group = useRef<THREE.Group>(null)
  const { nodes, materials, animations } = useGLTF("/glb/tooth.glb") as GLTFResult
  const { actions } = useAnimations(animations, group)

  const meshRef = useRef<any>()
  const mesh2Ref = useRef<any>()

  const materialProps = useControls({
    transmissionSampler: true,
    backside: false,
    samples: { value: 10, min: 1, max: 32, step: 1 },
    resolution: { value: 2048, min: 256, max: 2048, step: 256 },
    transmission: { value: 1, min: 0, max: 1 },
    metalness: { value: 1, min: 0, max: 1 },
    roughness: { value: 0.0, min: 0, max: 1, step: 0.01 },
    thickness: { value: 3.5, min: 0, max: 10, step: 0.01 },
    ior: { value: 1.5, min: 1, max: 5, step: 0.01 },
    chromaticAberration: { value: 0.06, min: 0, max: 1 },
    anisotropy: { value: 0.1, min: 0, max: 1, step: 0.01 },
    distortion: { value: 0.0, min: 0, max: 1, step: 0.01 },
    distortionScale: { value: 0.3, min: 0.01, max: 1, step: 0.01 },
    temporalDistortion: { value: 0.5, min: 0, max: 1, step: 0.01 },
    clearcoat: { value: 1, min: 0, max: 1 },
    attenuationDistance: { value: 0.5, min: 0, max: 10, step: 0.01 },
    attenuationColor: "#FFDF00",
    color: "#FFDF00",
    bg: "#FFDF00",
  })

  function handlePointerDown() {
    actions["Dis UstAction"]?.reset().setEffectiveTimeScale(10).play()
    actions["Dis AltAction"]?.reset().setEffectiveTimeScale(10).play()
  }

  function handlePointerUp() {
    actions["Dis UstAction"]?.stop()
    actions["Dis AltAction"]?.stop()
  }

  useFrame(() => {
    if (meshRef.current) {
      // meshRef.current.rotation.x += 0.001
      meshRef.current.rotation.y += 0.001
      // meshRef.current.rotation.z += 0.001
    }

    if (mesh2Ref.current) {
      // mesh2Ref.current.rotation.x += 0.001
      mesh2Ref.current.rotation.y += 0.001
      // meshRef.current.rotation.z += 0.001
    }
  })

  return (
    <group
      ref={group}
      onPointerOver={handlePointerDown}
      onPointerOut={handlePointerUp}
      position={[0, -5, 0]}
      scale={0.5}
    >
      <group>
        <mesh
          castShadow
          receiveShadow
          name="Dis_Ust"
          geometry={nodes.Dis_Ust.geometry}
          position={[-0.109, 14.822, -5.212]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <MeshTransmissionMaterial {...materialProps} />
        </mesh>
        <mesh
          castShadow
          receiveShadow
          name="Dis_Alt"
          geometry={nodes.Dis_Alt.geometry}
          position={[0.169, 9.668, -5.886]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <MeshTransmissionMaterial {...materialProps} />
        </mesh>
      </group>
    </group>
  )
}

useGLTF.preload("/glb/tooth.glb")
