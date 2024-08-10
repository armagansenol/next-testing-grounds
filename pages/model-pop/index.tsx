import { gsap } from "@/lib/gsap"
import { Environment, MeshTransmissionMaterial, Stats, Text, useGLTF, PerspectiveCamera } from "@react-three/drei"
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber"
import { Bloom, EffectComposer } from "@react-three/postprocessing"
import { Suspense, useEffect, useMemo, useRef, useState } from "react"
import * as THREE from "three"
import { GLTF } from "three-stdlib"
import ModelControls from "./misc/modelControls"

export interface ModelPopProps {}

export default function ModelPop(props: ModelPopProps) {
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="relative z-20 w-full h-full">
        <Scene />
      </div>
      <div className="absolute w-96 h-96 border-2 border-dashed border-purple-950 rounded-[50%] z-10"></div>
    </div>
  )
}

function Scene() {
  return (
    <Canvas>
      <PerspectiveCamera makeDefault position={[0, 0, 0]} near={0} far={1} />
      <ambientLight intensity={0.8} />
      {/* <directionalLight castShadow position={[2.5, 12, 12]} intensity={4} />
      <pointLight position={[20, 20, 20]} />
      <pointLight position={[-20, -20, -20]} intensity={5} /> */}
      <Environment preset="warehouse" />

      <EffectComposer>
        <Bloom mipmapBlur luminanceThreshold={1} intensity={0.1} />
      </EffectComposer>
      <Suspense fallback={null}>
        <Geometry />
      </Suspense>
      <Rig />
      {/* <OrbitControls /> */}
      <Stats />
    </Canvas>
  )
}

type GLTFResult = GLTF & {
  nodes: {
    pCube1: THREE.Mesh
  }
  materials: {
    ["Glass Wavy White #1"]: THREE.MeshPhysicalMaterial
  }
}

function Geometry() {
  const ref = useRef<THREE.Mesh>(null)
  const [startAnimation, setStartAnimation] = useState(false)
  const t = useLoader(THREE.TextureLoader, "/img/ice-bg.jpg")
  const iceT = useLoader(THREE.TextureLoader, "/img/ice-texture.jpg")
  const { nodes } = useGLTF("/glb/ice-origin-center.glb") as GLTFResult

  useMemo(() => {
    const vec2 = new THREE.Vector2(1, 2)
    iceT.wrapS = THREE.RepeatWrapping
    iceT.wrapT = THREE.RepeatWrapping
    iceT.repeat.set(vec2.x, vec2.y)
  }, [iceT])

  useEffect(() => {
    if (!ref.current) return

    const tl = gsap.timeline({ paused: true })

    const scale = 3.75
    const rotation = Math.PI * 1.4

    tl.to(
      ref.current.scale,
      {
        x: scale,
        y: scale,
        z: scale,
        duration: 1,
        ease: "expo.out",
      },
      "s"
    ).to(
      ref.current.rotation,
      {
        x: rotation,
        y: rotation,
        z: rotation,
        duration: 1,
        ease: "expo.out",
      },
      "s"
    )

    tl.play()
  }, [])

  useFrame((state) => {
    if (!ref.current) return

    const r = startAnimation ? 1.2 : 0.3

    ref.current.rotation.x = ref.current.rotation.y = ref.current.rotation.z += 0.02 * r
    // ref.current.position.y =
    //   props.position.y + Math[props.r > 0.5 ? "cos" : "sin"](state.clock.getElapsedTime() * props.r) * props.r
  })

  const handlePointerOver = () => {
    if (!ref.current) return
    setStartAnimation(true)

    const scale = 4
    gsap.to(ref.current.scale, {
      x: scale,
      y: scale,
      z: scale,
      duration: 1,
      ease: "power2.out",
    })
  }

  const handlePointerOut = () => {
    if (!ref.current) return
    setStartAnimation(false)

    const scale = 2
    gsap.to(ref.current.scale, {
      x: scale,
      y: scale,
      z: scale,
      duration: 1,
      ease: "expo.out",
    })
  }

  const modelOptions = ModelControls()

  return (
    <>
      <group position={new THREE.Vector3(0, 0, -20)}>
        {/* <Html position={new THREE.Vector3(0, 0, -1)} center>
          <div className="w-96 h-96 bg-slate-400"></div>
        </Html> */}
        {/* <mesh
          ref={ref}
          geometry={nodes.pCube1.geometry}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
          scale={0}
          position={new THREE.Vector3(0, 0, 5)}
          //   material={
          //     new THREE.MeshPhysicalMaterial({
          //       ...modelOptions,
          //       normalMap: iceT,
          //       normalScale: new THREE.Vector2(2, 2),
          //     })
          //   }
        >
          <meshPhysicalMaterial
            {...modelOptions}
            normalMap={iceT}
            normalScale={new THREE.Vector2(1, 1)}
            transmissionMap={iceT}

            // displacementMap={iceT}
            // displacementScale={0.1}
            // displacementBias={0.001}
            // bumpMap={iceT}
            // bumpScale={10.3}
          />
        </mesh> */}
        <mesh
          geometry={new THREE.PlaneGeometry(50, 50)}
          scale={1}
          position={new THREE.Vector3(0, 0, 0)}
          material={
            new THREE.MeshBasicMaterial({
              map: t,
              toneMapped: false,
            })
          }
        />
        <CanvasText />
        <Model />
      </group>
    </>
  )
}

function Rig() {
  const { camera, pointer } = useThree()

  console.log(pointer.x)

  const vec = new THREE.Vector3()
  return useFrame(() => camera.position.lerp(vec.set(pointer.x / 2, pointer.y / 2, camera.position.z), 0.09))
}

function CanvasText() {
  const { viewport } = useThree()
  const vw = viewport.width * 100

  return (
    <Text
      position={[0, 0, 1]}
      fontSize={vw > 1024 ? 10 : 1}
      lineHeight={1}
      color="blue"
      anchorX="center"
      anchorY="middle"
      fillOpacity={1}
      textAlign="center"
      material-toneMapped={false} // Disables tone mapping for this material
    >
      {`TEST\nTEST`}
    </Text>
  )
}

import { useAnimations } from "@react-three/drei"

type GLTFResultt = GLTF & {
  nodes: {
    box: THREE.Mesh
  }
  materials: {
    lambert1: THREE.MeshStandardMaterial
  }
}

type ActionName = "boxAction"
type GLTFActions = Record<ActionName, THREE.AnimationAction>

export function Model(props: JSX.IntrinsicElements["group"]) {
  const group = useRef<THREE.Group>(null)
  const { nodes, materials, animations } = useGLTF("/glb/box.glb") as GLTFResultt
  const { actions, names } = useAnimations<any>(animations, group)

  const handlePointerOver = () => {
    console.log(actions.boxAction)

    actions[names[0]]?.reset().play()
  }

  const modelOptions = ModelControls()

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene" position={[0, 0, 5]}>
        <mesh
          name="box"
          geometry={new THREE.IcosahedronGeometry(1)}
          position={[0, 0.03, 0]}
          rotation={[Math.PI / 2, 0, 1.398]}
          scale={10}
          onPointerOver={handlePointerOver}
        >
          <MeshTransmissionMaterial {...modelOptions} />
        </mesh>
      </group>
    </group>
  )
}

useGLTF.preload("/glb/box.glb")
