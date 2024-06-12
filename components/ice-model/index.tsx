import { useGLTF } from "@react-three/drei"
import * as THREE from "three"
import { GLTF } from "three-stdlib"

type GLTFResult = GLTF & {
  nodes: {
    imagetostl_mesh0: THREE.Mesh
    imagetostl_mesh1: THREE.Mesh
    imagetostl_mesh2: THREE.Mesh
    imagetostl_mesh3: THREE.Mesh
    imagetostl_mesh4: THREE.Mesh
    imagetostl_mesh5: THREE.Mesh
    imagetostl_mesh6: THREE.Mesh
    imagetostl_mesh7: THREE.Mesh
    imagetostl_mesh8: THREE.Mesh
    imagetostl_mesh9: THREE.Mesh
  }
  materials: {
    mat0: THREE.MeshStandardMaterial
    mat1: THREE.MeshStandardMaterial
    mat2: THREE.MeshStandardMaterial
    mat3: THREE.MeshStandardMaterial
    mat4: THREE.MeshStandardMaterial
    mat5: THREE.MeshStandardMaterial
    mat6: THREE.MeshStandardMaterial
    mat7: THREE.MeshStandardMaterial
    mat8: THREE.MeshStandardMaterial
    mat9: THREE.MeshStandardMaterial
  }
}

export interface GroupProps {}

export default function Model(props: JSX.IntrinsicElements["group"]) {
  const { nodes, materials } = useGLTF("/glb/ice.glb") as GLTFResult
  return (
    <group {...props} dispose={null}>
      <mesh castShadow receiveShadow geometry={nodes.imagetostl_mesh0.geometry} material={materials.mat0} />
      <mesh castShadow receiveShadow geometry={nodes.imagetostl_mesh1.geometry} material={materials.mat1} />
      <mesh castShadow receiveShadow geometry={nodes.imagetostl_mesh2.geometry} material={materials.mat2} />
      <mesh castShadow receiveShadow geometry={nodes.imagetostl_mesh3.geometry} material={materials.mat3} />
      <mesh castShadow receiveShadow geometry={nodes.imagetostl_mesh4.geometry} material={materials.mat4} />
      <mesh castShadow receiveShadow geometry={nodes.imagetostl_mesh5.geometry} material={materials.mat5} />
      <mesh castShadow receiveShadow geometry={nodes.imagetostl_mesh6.geometry} material={materials.mat6} />
      <mesh castShadow receiveShadow geometry={nodes.imagetostl_mesh7.geometry} material={materials.mat7} />
      <mesh castShadow receiveShadow geometry={nodes.imagetostl_mesh8.geometry} material={materials.mat8} />
      <mesh castShadow receiveShadow geometry={nodes.imagetostl_mesh9.geometry} material={materials.mat9} />
    </group>
  )
}

useGLTF.preload("/glb/ice.glb")
