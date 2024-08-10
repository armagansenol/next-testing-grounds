import { MeshTransmissionMaterial, useGLTF } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useControls } from "leva"
import { useRef } from "react"
import * as THREE from "three"
import { GLTF } from "three-stdlib"

const fileName = "dis.glb"

type GLTFResult = GLTF & {
  nodes: {
    polySurface63_2: THREE.Mesh
    polySurface64_2: THREE.Mesh
  }
  materials: {
    ["Hologram #1"]: THREE.MeshStandardMaterial
  }
}

export default function Model() {
  const { nodes, materials } = useGLTF(`/glb/${fileName}`) as GLTFResult

  const meshRef = useRef<any>()
  const mesh2Ref = useRef<any>()

  useFrame(() => {
    if (meshRef.current) {
      // meshRef.current.rotation.x += 0.001
      meshRef.current.rotation.y += 0.001
      // meshRef.current.rotation.z += 0.001
    }

    if (mesh2Ref.current) {
      // mesh2Ref.current.rotation.x -= 0.001
      mesh2Ref.current.rotation.y += 0.001
      // meshRef.current.rotation.z += 0.001
    }
  })

  const materialProps = useControls({
    meshPhysicalMaterial: false,
    transmissionSampler: false,
    backside: false,
    samples: { value: 10, min: 1, max: 32, step: 1 },
    resolution: { value: 2048, min: 256, max: 2048, step: 256 },
    transmission: { value: 1, min: 0, max: 1 },
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
    // attenuationColor: "#ffffff",
    // color: "#c9ffa1",
    // bg: "#839681",
  })

  return (
    <>
      <group scale={0.025}>
        <group position={[1.253, -100.981, -10.119]} scale={10} ref={meshRef}>
          <mesh castShadow receiveShadow geometry={nodes.polySurface63_2.geometry}>
            {materialProps.meshPhysicalMaterial ? (
              <meshPhysicalMaterial {...materialProps} />
            ) : (
              <MeshTransmissionMaterial
                // background={new THREE.Color(materialProps.bg)}
                {...materialProps}
              />
            )}
            <meshStandardMaterial toneMapped={false} emissive="hotpink" color="red" emissiveIntensity={2} />
          </mesh>

          <mesh ref={mesh2Ref} castShadow receiveShadow geometry={nodes.polySurface64_2.geometry}>
            {materialProps.meshPhysicalMaterial ? (
              <meshPhysicalMaterial {...materialProps} />
            ) : (
              <MeshTransmissionMaterial
                //  background={new THREE.Color(materialProps.bg)}
                {...materialProps}
              />
            )}
            <meshStandardMaterial toneMapped={false} emissive="hotpink" color="red" emissiveIntensity={2} />
          </mesh>
        </group>
      </group>
    </>
  )
}

useGLTF.preload(`/glb/${fileName}`)
