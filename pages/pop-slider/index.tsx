import { gsap } from "@/lib/gsap"
import { useGSAP } from "@gsap/react"
import { Environment, MeshTransmissionMaterial, PerspectiveCamera, Text, useGLTF } from "@react-three/drei"
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber"
import { useControls } from "leva"
import { Perf } from "r3f-perf"
import { forwardRef, Suspense, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react"
import * as THREE from "three"
import { GLTF } from "three-stdlib"

import { convertHexToGLSLRGB } from "@/lib/utils"
import fragmentShaderWavyVortex from "./shaders/wavy-vortex/fragment.glsl"
import vertexShaderWavyVortex from "./shaders/wavy-vortex/vertex.glsl"

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
    <Canvas>
      <color attach="background" args={["#ffffff"]} />

      <PerspectiveCamera makeDefault position={[0, 0, 4]} near={0.1} fov={50} />

      <ambientLight intensity={0.75} />

      <Environment preset="studio" environmentIntensity={0.005} />

      <Rig />
      {/* <OrbitControls /> */}

      <Suspense fallback={null}>
        <Geometry />
      </Suspense>

      <Perf position="top-left" />
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
      bgColor: convertHexToGLSLRGB("#0075CE"),
    },
    {
      geometry: new THREE.SphereGeometry(0.2),
      position: new THREE.Vector3(0, 0, 1.5),
      scale: 0.5,
      color: "lightgreen",
      //HEXDECIMAL TO RGB CONVERSION
      bgColor: convertHexToGLSLRGB("#FF5B4A"),
    },
    {
      geometry: new THREE.BoxGeometry(0.2, 0.2, 0.2),
      position: new THREE.Vector3(0, 0, 1.5),
      scale: 0.5,
      color: "lightgreen",
      bgColor: convertHexToGLSLRGB("#73C6E4"),
    },
    {
      geometry: new THREE.ConeGeometry(0.3, 0.3, 32),
      position: new THREE.Vector3(0, 0, 1.5),
      scale: 0.5,
      color: "lightgreen",
      bgColor: convertHexToGLSLRGB("#FFEBAA"),
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
      <group position={new THREE.Vector3(0, 0, 0)} ref={groupRef} scale={0.25}>
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
        position={[0, -1.5, 0]}
        fontSize={0.2}
        lineHeight={1}
        color="#000000"
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
      {/* <Background /> */}
      {/* <Spiral /> */}
      <WavyVortex />
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
    // <mesh
    //   ref={(node) => {
    //     myRef.current = node
    //     if (typeof ref === "function") {
    //       ref(node)
    //     } else if (ref) {
    //       ref.current = node
    //     }
    //   }}
    //   position={item.position}
    //   scale={active ? new THREE.Vector3(1, 1, 1) : new THREE.Vector3(0, 0, 0)}
    //   geometry={item.geometry}
    //   material={new THREE.MeshStandardMaterial({ color: item.color })}
    // />
    <IceGlass />
  )
})

type GLTFResult = GLTF & {
  nodes: {
    ["pCube1-mesh"]: THREE.Mesh
    ["pCube1-mesh_1"]: THREE.Mesh
    ["pCube1-mesh_2"]: THREE.Mesh
    ["pCube1-mesh_3"]: THREE.Mesh
    ["pCube1-mesh_4"]: THREE.Mesh
    ["pCube1-mesh_5"]: THREE.Mesh
    ["pCube1-mesh_6"]: THREE.Mesh
    ["pCube1-mesh_7"]: THREE.Mesh
    ["pCube1-mesh_8"]: THREE.Mesh
    ["pCube1-mesh_9"]: THREE.Mesh
    ["pCube1-mesh_10"]: THREE.Mesh
    ["pCube1-mesh_11"]: THREE.Mesh
    ["pCube1-mesh_12"]: THREE.Mesh
    ["pCube1-mesh_13"]: THREE.Mesh
    CUsersberkaOneDriveMasaüstüBardak_Altobj: THREE.Mesh
    CUsersberkaOneDriveMasaüstüBardak_Ustobj: THREE.Mesh
  }
  materials: {
    bus: THREE.MeshPhysicalMaterial
    ["bus #1"]: THREE.MeshPhysicalMaterial
    ["bus #2"]: THREE.MeshPhysicalMaterial
    ["bus #3"]: THREE.MeshPhysicalMaterial
    ["bus #1"]: THREE.MeshPhysicalMaterial
    ["bus #1"]: THREE.MeshPhysicalMaterial
    ["bus #4"]: THREE.MeshPhysicalMaterial
    ["bus #1"]: THREE.MeshPhysicalMaterial
    ["bus #1"]: THREE.MeshPhysicalMaterial
    ["bus #1"]: THREE.MeshPhysicalMaterial
    ["bus #2"]: THREE.MeshPhysicalMaterial
    ["bus #1"]: THREE.MeshPhysicalMaterial
    ["bus #1"]: THREE.MeshPhysicalMaterial
    ["bus #2"]: THREE.MeshPhysicalMaterial
    ["Glass Basic Grey #2"]: THREE.MeshPhysicalMaterial
    Paint: THREE.MeshPhysicalMaterial
  }
}

function IceGlass(props: JSX.IntrinsicElements["group"]) {
  const { nodes } = useGLTF("/glb/bardak.glb") as GLTFResult
  const meshRef = useRef<THREE.Group>(null)
  const iceCubesMap = useLoader(THREE.TextureLoader, "/img/ice-cubes.png")
  const rotationSpeed = useRef(0.005)
  const scaleAmount = useRef(0.03)

  useFrame(() => {
    if (meshRef.current) {
      // meshRef.current.rotation.x += 0.001
      meshRef.current.rotation.y += rotationSpeed.current
      // meshRef.current.rotation.z += 0.001

      meshRef.current.scale.x = scaleAmount.current
      meshRef.current.scale.y = scaleAmount.current
      meshRef.current.scale.z = scaleAmount.current
    }
  })

  useMemo(() => {
    if (iceCubesMap) {
      iceCubesMap.wrapS = iceCubesMap.wrapT = THREE.ClampToEdgeWrapping
      iceCubesMap.offset.set(0, 0)
      iceCubesMap.rotation = Math.PI
      iceCubesMap.flipY = false
      iceCubesMap.center = new THREE.Vector2(0.5, 0.5)

      const aspectRatio = iceCubesMap.image.width / iceCubesMap.image.height
      iceCubesMap.repeat.set(0.28 * aspectRatio, 0.55 * aspectRatio)
    }
  }, [iceCubesMap])

  return (
    <>
      <group
        {...props}
        dispose={null}
        position={[0, -1, 0]}
        rotation={[0, 0, 0]}
        onPointerEnter={() => {
          scaleAmount.current = 0.035
          rotationSpeed.current = 0.05
        }}
        onPointerLeave={() => {
          scaleAmount.current = 0.03
          rotationSpeed.current = 0.005
        }}
      >
        <group ref={meshRef}>
          {/* <IceCubes {...nodes} /> */}
          <Cup {...nodes} />
        </group>
        {/* <mesh geometry={new THREE.BoxGeometry(4, 5, 0)} scale={5} position={[5, vw > 1024 ? 105 : 105, 0]}>
          <meshPhysicalMaterial
            map={iceCubesMap}
            bumpMap={iceCubesMap}
            bumpScale={4}
            color={"#D5FFFF"}
            transparent={true}
            opacity={0.5}
          />
        </mesh> */}
      </group>
    </>
  )
}

function Cup(nodes: GLTFResult["nodes"]) {
  const groupRef = useRef<THREE.Group | null>(null)
  const packageMap = useLoader(THREE.TextureLoader, "/img/chill-owra-package.png")

  useMemo(() => {
    if (packageMap) {
      packageMap.wrapS = packageMap.wrapT = THREE.ClampToEdgeWrapping
      packageMap.offset.set(-1.2, -0.2)
      packageMap.rotation = Math.PI * 1.5
      packageMap.flipY = true
      packageMap.center = new THREE.Vector2(0.5, 0.5)

      const aspectRatio = packageMap.image.width / packageMap.image.height
      packageMap.repeat.set(1.2, 1.5)
    }
  }, [packageMap])

  const materialProps = useControls(
    "cup",
    {
      meshPhysicalMaterial: false,
      transmissionSampler: true,
      backside: true,
      backsideThickness: { value: 2, min: -10, max: 10 },
      samples: { value: 10, min: 0, max: 32, step: 1 },
      resolution: { value: 2048, min: 256, max: 2048, step: 256 },
      backsideResolution: { value: 1024, min: 32, max: 2048, step: 256 },
      transmission: { value: 1, min: 0, max: 1 },
      roughness: { value: 0.0, min: 0, max: 1, step: 0.01 },
      ior: { value: 1.5, min: 1, max: 5, step: 0.01 },
      thickness: { value: 0.25, min: 0, max: 10, step: 0.01 },
      chromaticAberration: { value: 0.4, min: 0, max: 1 },
      anisotropy: { value: 0.3, min: 0, max: 1, step: 0.01 },
      distortion: { value: 0.0, min: 0, max: 1, step: 0.01 },
      distortionScale: { value: 0.3, min: 0.01, max: 1, step: 0.01 },
      temporalDistortion: { value: 0.65, min: 0, max: 1, step: 0.01 },
      attenuationDistance: { value: 0.5, min: 0, max: 2.5, step: 0.01 },
      clearcoat: { value: 0, min: 0, max: 1 },
      attenuationColor: "#ffffff",
      color: "white",
    },
    { collapsed: true }
  )

  useFrame(() => {
    if (!groupRef.current) return

    // groupRef.current.rotation.x += 0.01
    // groupRef.current.rotation.y += 0.01
    // groupRef.current.rotation.z += 0.01
  })

  return (
    <group ref={groupRef} castShadow={false} receiveShadow={false}>
      <group scale={0.25}>
        <mesh
          geometry={nodes.CUsersberkaOneDriveMasaüstüBardak_Ustobj.geometry}
          position={[1.37532806, -83.60058784, 0.00108719]}
        >
          <MeshTransmissionMaterial {...materialProps} side={THREE.DoubleSide} />
        </mesh>

        <mesh geometry={nodes.CUsersberkaOneDriveMasaüstüBardak_Altobj.geometry} position={[1.3753624, -79.21138, 0]}>
          <MeshTransmissionMaterial {...materialProps} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </group>
  )
}

useGLTF.preload("/glb/bardak.glb")

// function Background() {
//   // This reference will give us direct access to the mesh
//   const mesh = useRef<THREE.Mesh>(null)
//   const mousePosition = useRef({ x: 0, y: 0 })

//   const updateMousePosition = useCallback((e: any) => {
//     mousePosition.current = { x: e.pageX, y: e.pageY }
//   }, [])

//   function getRandomHexColor(): string {
//     const letters = "0123456789ABCDEF"
//     let color = "#"

//     for (let i = 0; i < 6; i++) {
//       color += letters[Math.floor(Math.random() * 16)]
//     }

//     return color
//   }

//   const uniforms = useMemo(
//     () => ({
//       u_time: {
//         value: 0.0,
//       },
//       u_mouse: { value: new THREE.Vector2(0, 0) },
//       u_bg: {
//         value: new THREE.Color("#A1A3F7"),
//       },
//       u_colorA: { value: new THREE.Color("#FF5B4A") },
//       u_colorB: { value: new THREE.Color("#FF5B4A") },
//     }),
//     []
//   )

//   useEffect(() => {
//     window.addEventListener("mousemove", updateMousePosition, false)

//     return () => {
//       window.removeEventListener("mousemove", updateMousePosition, false)
//     }
//   }, [updateMousePosition])

//   const [bg, setBg] = useState(new THREE.Color("#A1A3F7"))

//   useFrame((state) => {
//     if (!mesh.current) return

//     const { clock } = state

//     mesh.current.material.uniforms.u_time.value = clock.getElapsedTime()
//     mesh.current.material.uniforms.u_mouse.value = new THREE.Vector2(mousePosition.current.x, mousePosition.current.y)
//     mesh.current.material.uniforms.u_bg.value = bg
//   })

//   // State for initial and target colors
//   const [initialColor, setInitialColor] = useState(new THREE.Color("#F05D21"))
//   const [currentColor, setCurrentColor] = useState(new THREE.Color("#00FF00"))
//   const [targetColor, setTargetColor] = useState(currentColor.clone())

//   const startTime = useRef(0)
//   const interpolationDuration = 12.0 // Duration of the interpolation in seconds

//   // useFrame((state) => {
//   //   if (!mesh.current) return

//   //   const elapsedTime = state.clock.getElapsedTime() - startTime.current
//   //   const t = Math.min(elapsedTime / interpolationDuration, 1.0) // Calculate interpolation factor

//   //   console.log("t", t)

//   //   // Interpolate between the initial color and the target color
//   //   const interpolatedColor = initialColor.clone().lerp(targetColor, t)

//   //   console.log(interpolatedColor)

//   //   // Update the material uniform with the interpolated color
//   //   mesh.current.material.uniforms.u_colorA.value = interpolatedColor
//   //   mesh.current.material.uniforms.u_colorB.value = interpolatedColor

//   //   // Optionally, update the currentColor state when the interpolation is complete
//   //   if (t < interpolationDuration) {
//   //     setCurrentColor(interpolatedColor.clone())
//   //   } else {
//   //     setInitialColor(interpolatedColor.clone())
//   //   }
//   // })

//   // const startColorTransition = (newColor: THREE.Color) => {
//   //   setTargetColor(newColor.clone())
//   //   setInitialColor(currentColor.clone())
//   //   startTime.current = 0 // Reset the start time
//   // }

//   return (
//     <>
//       <mesh
//         ref={mesh}
//         geometry={new THREE.SphereGeometry(15, 64, 64)}
//         position={new THREE.Vector3(0, 0, 0)}
//         // onClick={() => startColorTransition(new THREE.Color(getRandomHexColor()))}
//       >
//         <shaderMaterial
//           fragmentShader={fragmentShader}
//           vertexShader={vertexShader}
//           uniforms={uniforms}
//           wireframe={false}
//           side={THREE.DoubleSide}
//         />
//       </mesh>

//       <mesh
//         ref={mesh}
//         geometry={new THREE.SphereGeometry(1, 64, 64)}
//         position={new THREE.Vector3(0, 0, -1)}
//         rotation={new THREE.Euler(0, Math.PI * 2 * 0.75, 0)}
//       >
//         <shaderMaterial
//           fragmentShader={fragmentShader}
//           vertexShader={vertexShader}
//           uniforms={uniforms}
//           wireframe={false}
//           side={THREE.DoubleSide}
//         />
//       </mesh>
//     </>
//   )
// }

// function Spiral() {
//   function extractNumbersFromString(string: string) {
//     if (!string) return

//     var numbers = string.match(/\d+/g).map(Number)
//     console.log("numbers:" + numbers)
//     return numbers
//   }

//   // This reference will give us direct access to the mesh
//   const mesh = useRef<THREE.Mesh>(null)
//   const mousePosition = useRef({ x: 0, y: 0 })

//   const updateMousePosition = useCallback((e: any) => {
//     mousePosition.current = { x: e.pageX, y: e.pageY }
//   }, [])

//   function getRandomHexColor(): string {
//     const letters = "0123456789ABCDEF"
//     let color = "#"

//     for (let i = 0; i < 6; i++) {
//       color += letters[Math.floor(Math.random() * 16)]
//     }

//     return color
//   }

//   const uniforms = useMemo(
//     () => ({
//       u_time: { type: "f", value: 1.0 },
//       u_mouse: { type: "v2", value: new THREE.Vector2() },
//       u_resolution: { type: "v2", value: new THREE.Vector2() },
//       primary_color: { type: "v3", value: convertHexToGLSLRGB("#ffd000") },
//       secondary_color: { type: "v3", value: convertHexToGLSLRGB("#1c1c1c") },
//       ripples_number: { type: "f", value: "3.0" } /*1 to 10*/,
//       ripple_size: { type: "f", value: "0.1" },
//       ripple_bleed: { type: "f", value: "0.000001" },
//       speed_factor: { type: "f", value: "2.0" } /*0 to 100*/,
//       direction: { type: "f", value: "-1.0" },
//       ripple_base_size: { type: "f", value: "0.1" },
//     }),
//     []
//   )

//   useEffect(() => {
//     window.addEventListener("mousemove", updateMousePosition, false)

//     return () => {
//       window.removeEventListener("mousemove", updateMousePosition, false)
//     }
//   }, [updateMousePosition])

//   const [bg, setBg] = useState(new THREE.Color("#A1A3F7"))

//   useFrame((state) => {
//     if (!mesh.current) return

//     uniforms.u_time.value += 0.005
//     uniforms.u_time.value += 0.05
//   })

//   return (
//     <>
//       <mesh
//         ref={mesh}
//         geometry={new THREE.SphereGeometry(15, 128, 128)}
//         position={new THREE.Vector3(0, 0, -10)}
//         rotation={new THREE.Euler(Math.PI * 2 * 0.25, 0, 0)}
//       >
//         <shaderMaterial
//           fragmentShader={fragmentShaderSpiral}
//           vertexShader={vertexShaderSpiral}
//           uniforms={uniforms}
//           wireframe={false}
//           side={THREE.DoubleSide}
//         />
//       </mesh>
//     </>
//   )
// }

// interface CustomMaterialProps extends THREE.ShaderMaterialParameters {
//   color: THREE.Vector4
//   // ringDistance: number
//   // maxRings: number
//   // waveCount: number
//   // waveDepth: number
//   // yCenter: number
//   // direction: number
//   // time: number
// }

const CustomMaterial: React.FC = (props) => {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const { size, viewport } = useThree()

  // Calculate the aspect ratio
  const aspectRatio = size.width / size.height
  const planeWidth = viewport.width * 0.95
  const planeHeight = (planeWidth / aspectRatio) * 0.95

  useEffect(() => {
    if (!meshRef.current) return

    const geometry = new THREE.PlaneGeometry(planeWidth, planeHeight)
    meshRef.current.geometry = geometry
  }, [planeWidth, planeHeight])

  // const uniforms = useMemo(
  //   () => ({
  //     color: { value: props.color },
  //     ringDistance: { value: props.ringDistance },
  //     maxRings: { value: props.maxRings },
  //     waveCount: { value: props.waveCount },
  //     waveDepth: { value: props.waveDepth },
  //     yCenter: { value: props.yCenter },
  //     direction: { value: props.direction },
  //     time: { value: 0 },
  //     width: { value: 0 },
  //     height: { value: 0 },
  //   }),
  //   []
  // )

  const controls = useControls({
    ringDistance: {
      value: 0.05,
      min: 0.0,
      max: 1.0,
      step: 0.00125,
    },
    maxRings: {
      value: 10,
      min: 2,
      max: 50,
      step: 1,
    },
    waveCount: {
      value: 10,
      min: 2,
      max: 100,
      step: 1,
    },
    waveDepth: {
      value: 0.04,
      min: 0.01,
      max: 0.2,
      step: 0.005,
    },
    yCenter: {
      value: 0.8,
      min: 0.0,
      max: 3.0,
      step: 0.1,
    },
    direction: {
      value: 1.2,
      min: -3.0,
      max: 3.0,
      step: 0.1,
    },
  })

  const uniforms = useMemo(
    () => ({
      color: { value: new THREE.Color().setFromVector3(convertHexToGLSLRGB("#0075CE")) },
      ringDistance: { value: controls.ringDistance },
      maxRings: { value: controls.maxRings },
      waveCount: { value: controls.waveCount },
      waveDepth: { value: controls.waveDepth },
      yCenter: { value: controls.yCenter },
      direction: { value: controls.direction },
      time: { value: 0 },
      width: { value: 0 },
      height: { value: 0 },
    }),
    []
  )

  useFrame(({ clock, size }) => {
    if (!materialRef.current) return

    materialRef.current.uniforms.time.value = clock.getElapsedTime() * 0.25
    materialRef.current.uniforms.width.value = size.width
    materialRef.current.uniforms.height.value = size.height

    materialRef.current.uniforms.ringDistance.value = controls.ringDistance
    materialRef.current.uniforms.maxRings.value = controls.maxRings
    materialRef.current.uniforms.waveCount.value = controls.waveCount
    materialRef.current.uniforms.waveDepth.value = controls.waveDepth
    materialRef.current.uniforms.yCenter.value = controls.yCenter
    materialRef.current.uniforms.direction.value = controls.direction
  })

  const colors = useRef([
    new THREE.Color().setFromVector3(convertHexToGLSLRGB("#0075CE")),
    new THREE.Color().setFromVector3(convertHexToGLSLRGB("#FF5B4A")),
    new THREE.Color().setFromVector3(convertHexToGLSLRGB("#73C6E4")),
    new THREE.Color().setFromVector3(convertHexToGLSLRGB("#FFEBAA")),
  ])

  const currentColor = useRef(colors.current.length - 1)

  const t = useRef<number>(1)

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
    <mesh
      ref={meshRef}
      geometry={new THREE.PlaneGeometry(planeWidth, planeHeight)}
      castShadow={false}
      receiveShadow={false}
      onPointerDown={handlePointerDown}
    >
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={vertexShaderWavyVortex}
        fragmentShader={fragmentShaderWavyVortex}
      />
    </mesh>
  )
}

function WavyVortex() {
  return <CustomMaterial />
}

function Rig() {
  const { camera, pointer } = useThree()
  const vec = new THREE.Vector3()
  return useFrame(() => camera.position.lerp(vec.set(pointer.x / 8, pointer.y / 32, camera.position.z), 0.09))
}
