import { gsap } from "@/lib/gsap"
import { useGSAP } from "@gsap/react"
import { PerspectiveCamera, Stats, Text } from "@react-three/drei"
import { Canvas, useFrame } from "@react-three/fiber"
import { forwardRef, Suspense, useEffect, useImperativeHandle, useRef, useState } from "react"
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

export default function PopSlider() {
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
      {/* <Rig /> */}
      {/* <OrbitControls /> */}
      <Stats />
    </Canvas>
  )
}

function Geometry() {
  const groupRef = useRef<THREE.Group>(null)
  const [currentItem, setCurrentItem] = useState(0)
  const [buttonDisabled, setButtonDisabled] = useState(false)
  const { contextSafe } = useGSAP()
  const tlRef = useRef<gsap.core.Timeline | null>(null)

  const items = [
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

  const itemRefs = useRef<THREE.Mesh[]>([])

  useEffect(() => {
    if (!groupRef.current) return

    tlRef.current = gsap.timeline().to(groupRef.current.scale, {
      x: 0,
      y: 0,
      z: 0,
      duration: 0.4,
      ease: "expo.out",
      onComplete: () => {
        if (!groupRef.current) return
        setCurrentItem((prev) => (prev + 1) % items.length)
        gsap.to(groupRef.current.scale, {
          x: 1,
          y: 1,
          z: 1,
          duration: 1,
          ease: "expo.out",
          onComplete: () => {
            setButtonDisabled(false)
          },
        })
      },
    })
  }, [])

  const handlePointerDown = contextSafe(() => {
    if (!tlRef.current) return

    setButtonDisabled(true)

    if (buttonDisabled) return

    tlRef.current.play(0)
  })

  return (
    <>
      <group position={new THREE.Vector3(0, 0, 0)} ref={groupRef} scale={1.25}>
        {items.map((item, index) => (
          <group key={index}>
            <SliderItem
              item={item}
              index={index}
              active={index === currentItem}
              ref={(node) => {
                if (node) {
                  itemRefs.current[index] = node
                }
              }}
            />
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

const SliderItem = forwardRef<THREE.Mesh, SliderItemProps>(({ item, active, index }, ref) => {
  const myRef = useRef<THREE.Mesh | null>(null)
  useImperativeHandle(ref, () => myRef.current as THREE.Mesh)
  const { contextSafe } = useGSAP()
  const [rotateSpeed, setRotateSpeed] = useState(0.2)

  const handlePointerOver = contextSafe(() => {
    if (!myRef.current) return

    setRotateSpeed(0.6)

    gsap.to(myRef.current.scale, {
      x: 1.5,
      y: 1.5,
      z: 1.5,
      duration: 2,
      ease: "elastic.out",
    })
  })

  const handlePointerOut = contextSafe(() => {
    if (!myRef.current) return

    setRotateSpeed(0.2)

    gsap.to(myRef.current.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: 1.5,
      ease: "elastic.out",
    })
  })

  useFrame(() => {
    if (!myRef.current) return

    myRef.current.rotation.x += 0.02 * rotateSpeed
    myRef.current.rotation.y += 0.02 * rotateSpeed
    myRef.current.rotation.z += 0.02 * rotateSpeed
  })

  return (
    <mesh
      ref={(node) => {
        myRef.current = node
        if (typeof ref === "function") {
          ref(node)
        } else if (ref) {
          ref.current = node
        }
      }}
      position={item.position}
      scale={active ? new THREE.Vector3(1, 1, 1) : new THREE.Vector3(0, 0, 0)}
      geometry={item.geometry}
      material={new THREE.MeshStandardMaterial({ color: item.color })}
    />
  )
})
