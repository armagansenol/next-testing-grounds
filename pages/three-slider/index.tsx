import { gsap } from "@/lib/gsap"
import { PerspectiveCamera, Stats, Text } from "@react-three/drei"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Suspense, useEffect, useRef, useState } from "react"
import * as THREE from "three"

interface SliderItemProps {
  active: boolean
  index: number
  item: {
    position: THREE.Vector3
    scale: number
    geometry: THREE.BufferGeometry
    color: string
  }
}

export default function ThreeSlider() {
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
      <color attach="background" args={["#000000"]} />
      <PerspectiveCamera makeDefault position={[0, 0, 4]} near={0.1} fov={50} />
      {/* <OrthographicCamera makeDefault position={[0, 0, 10]} near={0.1} zoom={50} /> */}
      <ambientLight intensity={0.2} />
      <directionalLight castShadow position={[4, -4, 12]} intensity={1} />
      <pointLight position={[0, 0, 20]} intensity={1000} />

      {/* <EffectComposer>
        <HueSaturation saturation={-0.2} />
        <BrightnessContrast brightness={0} contrast={0.25} />
        <WaterEffect factor={0.75} />
        <TiltShift2 samples={6} blur={0.4} />
        <Bloom mipmapBlur luminanceThreshold={0} intensity={5} />
        <ToneMapping />
      </EffectComposer> */}

      <Suspense fallback={null}>
        <Geometry />
      </Suspense>
      <Rig />
      {/* <OrbitControls /> */}
      <Stats />
    </Canvas>
  )
}

function Geometry() {
  const groupRef = useRef<THREE.Group>(null)

  const items: SliderItemProps["item"][] = [
    {
      geometry: new THREE.IcosahedronGeometry(0.2),
      position: new THREE.Vector3(0, 0, 1.5),
      scale: 0.5,
      color: "lightgreen",
    },
    {
      geometry: new THREE.SphereGeometry(0.2),
      position: new THREE.Vector3(0, 0, 1.5),
      scale: 0.5,
      color: "lightgreen",
    },
    {
      geometry: new THREE.BoxGeometry(0.2, 0.2, 0.2),
      position: new THREE.Vector3(0, 0, 1.5),
      scale: 0.5,
      color: "lightgreen",
    },
    {
      geometry: new THREE.ConeGeometry(0.3, 0.3, 32),
      position: new THREE.Vector3(0, 0, 1.5),
      scale: 0.5,
      color: "lightgreen",
    },
  ]

  const [currentItem, setCurrentItem] = useState(0)

  const handlePointerDown = () => {
    setCurrentItem((prev) => prev + 1)
  }

  useEffect(() => {
    if (!groupRef.current) return

    const fullCircle = 2 * Math.PI

    gsap.to(groupRef.current.rotation, {
      x: 0,
      y: () => (fullCircle / items.length) * currentItem * -1,
      z: 0,
      duration: 1.2,
      ease: "back.inOut",
    })
  }, [currentItem])

  return (
    <>
      <group position={new THREE.Vector3(0, 0, 0)} ref={groupRef} scale={1.25}>
        {items.map((item, index) => (
          <group rotation={new THREE.Euler(0, ((2 * Math.PI) / items.length) * index, 0)}>
            <SliderItem item={item} index={index} active={index === currentItem} />
          </group>
        ))}
      </group>
      <Text
        position={[0, -1.3, 0]}
        fontSize={0.2}
        lineHeight={1}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
        fillOpacity={1}
        textAlign="center"
        material-toneMapped={false} // Disables tone mapping for this material
        material-color="white"
        onPointerDown={handlePointerDown}
      >
        {`next`}
      </Text>
    </>
  )
}

function SliderItem({ index, item, active }: SliderItemProps) {
  const ref = useRef<THREE.Mesh>(null)
  const [startAnimation, setStartAnimation] = useState(false)

  const scale = { initial: 0.75, zoomed: 1.5 }

  useEffect(() => {
    if (!ref.current) return

    const tl = gsap.timeline({ paused: true })

    const rotation = Math.PI * 1.4

    tl.to(
      ref.current.scale,
      {
        x: scale.initial,
        y: scale.initial,
        z: scale.initial,
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

  // useEffect(() => {
  //   if (!ref.current) return

  //   gsap.to(ref.current?.scale, {
  //     x: () => (active ? 1 : 0.1),
  //     y: () => (active ? 1 : 0.1),
  //     z: () => (active ? 1 : 0.1),
  //     duration: 1.2,
  //     ease: "back.inOut",
  //   })
  // }, [active])

  useFrame(() => {
    if (!ref.current) return

    const r = startAnimation ? 1.2 : 0.3

    ref.current.rotation.x = ref.current.rotation.y = ref.current.rotation.z += 0.02 * r
  })

  const handlePointerOver = () => {
    if (!ref.current) return
    setStartAnimation(true)

    gsap.to(ref.current.scale, {
      x: scale.zoomed,
      y: scale.zoomed,
      z: scale.zoomed,
      duration: 2,
      ease: "elastic.out",
    })
  }

  const handlePointerOut = () => {
    if (!ref.current) return
    setStartAnimation(false)

    gsap.to(ref.current.scale, {
      x: scale.initial,
      y: scale.initial,
      z: scale.initial,
      duration: 1.5,
      ease: "elastic.out",
    })
  }

  return (
    <>
      <mesh
        ref={ref}
        position={item.position}
        scale={scale.initial}
        geometry={item.geometry}
        material={new THREE.MeshStandardMaterial({ color: item.color })}
        onPointerEnter={handlePointerOver}
        onPointerLeave={handlePointerOut}
        castShadow
      />
      <mesh
        geometry={new THREE.CircleGeometry(6, 96)}
        scale={0.1}
        position={new THREE.Vector3(0, 0, 1)}
        material={new THREE.MeshStandardMaterial({ color: "blue", side: THREE.DoubleSide })}
        receiveShadow
      >
        {/* <MeshTransmissionMaterial {...ModelControls} /> */}
      </mesh>
    </>
  )
}

function Rig() {
  const { camera, pointer } = useThree()
  const vec = new THREE.Vector3()
  return useFrame(() => camera.position.lerp(vec.set(pointer.x / 4, pointer.y / 16, camera.position.z), 0.09))
}

function CanvasText() {
  const { viewport } = useThree()
  const vw = viewport.width * 100

  return (
    <Text
      position={[0, -1.3, 0]}
      fontSize={0.2}
      lineHeight={1}
      color="#FFFFFF"
      anchorX="center"
      anchorY="middle"
      fillOpacity={1}
      textAlign="center"
      material-toneMapped={false} // Disables tone mapping for this material
      material-color="white"
    >
      {`NEXT`}
    </Text>
  )
}
