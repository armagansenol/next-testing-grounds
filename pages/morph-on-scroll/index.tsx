import { gsap } from "@/lib/gsap"
import { OrthographicCamera, Stats, useGLTF } from "@react-three/drei"
import { Canvas, useFrame } from "@react-three/fiber"
import * as React from "react"
import * as THREE from "three"
import { MeshSurfaceSampler } from "three/addons/math/MeshSurfaceSampler.js"
import { GLTF } from "three-stdlib"

import fragmentShader from "./misc/fragment.glsl"
import vertexShader from "./misc/vertex.glsl"

export const shaderOptions = {
  debug: true,
  uniforms: {
    u_sec1: { type: "f", value: 0.0 },
    u_sec2: { type: "f", value: 0.0 },
    u_sec3: { type: "f", value: 0.0 },
    u_sec4: { type: "f", value: 0.0 },
  },
  vertex: vertexShader,
  fragment: fragmentShader,
}

type GLTFResult = GLTF & {
  nodes: {
    Tek_Leylek: THREE.Mesh
  }
  materials: {
    ["diffuse_Black.004"]: THREE.MeshPhysicalMaterial
  }
}

export default function MorphOnScroll() {
  return (
    <div className="w-screen flex items-center justify-center">
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none">
        <Scene />
      </div>
      <div>
        <div className="w-screen h-screen s s-1"></div>
        <div className="w-screen h-screen s s-2"></div>
        <div className="w-screen h-screen s s-3"></div>
        <div className="w-screen h-screen s s-4"></div>
        <div className="w-screen h-screen s s-5"></div>
      </div>
    </div>
  )
}

function Scene() {
  return (
    <Canvas>
      {/* <color attach="background" args={["#000000"]} /> */}

      {/* <PerspectiveCamera makeDefault position={[0, 0, 100]} near={0.1} fov={50} /> */}
      <OrthographicCamera makeDefault position={[0, 0, 10]} near={0.1} zoom={300} />

      <ambientLight intensity={12.2} />
      <directionalLight castShadow position={[20, 20, 20]} intensity={0.11} />
      <pointLight position={[20, 0, 20]} intensity={10} />

      <React.Suspense fallback={null}>
        <Geometry />
      </React.Suspense>
      {/* <Rig /> */}
      {/* <OrbitControls /> */}
      {/* <EffectComposer>
        <HueSaturation saturation={-0.2} />
        <BrightnessContrast brightness={0} contrast={0.25} />
        <TiltShift2 samples={6} blur={0.01} />
        <Bloom mipmapBlur luminanceThreshold={0} intensity={0.2} />
        <ToneMapping />
      </EffectComposer> */}
      <Stats />
    </Canvas>
  )
}

function Geometry() {
  const rotationPower = 0.01
  const groupRef = React.useRef<THREE.Group | null>(null)
  const meshRef = React.useRef<THREE.Points | null>(null)

  const { nodes } = useGLTF("/glb/stork-test.glb") as GLTFResult

  React.useEffect(() => {
    function getGeometryPosition(geometry: THREE.BufferGeometry) {
      const numParticles = 100000
      const material = new THREE.MeshBasicMaterial()
      const mesh = new THREE.Mesh(geometry, material)
      const sampler = new MeshSurfaceSampler(mesh).build()
      const particlesPosition = new Float32Array(numParticles * 3)
      for (let i = 0; i < numParticles; i++) {
        const newPosition = new THREE.Vector3()
        const normal = new THREE.Vector3()

        sampler.sample(newPosition, normal)
        particlesPosition.set([newPosition.x, newPosition.y, newPosition.z], i * 3)
      }

      return particlesPosition
    }

    function setMesh() {
      const geometry = new THREE.BufferGeometry()
      const firstPos = getGeometryPosition(new THREE.SphereGeometry(1, 32, 32))
      const secPos = getGeometryPosition(new THREE.TorusGeometry(0.7, 0.3, 32, 32))
      const thirdPos = getGeometryPosition(nodes.Tek_Leylek.geometry)
      const forthPos = getGeometryPosition(new THREE.CylinderGeometry(1, 1, 1, 32, 32))
      const fivePos = getGeometryPosition(new THREE.IcosahedronGeometry(1.1, 0))

      const scaleFactor = 0.01 // Adjust the scale factor as needed
      for (let i = 0; i < thirdPos.length; i += 3) {
        thirdPos[i] *= scaleFactor // Scale X
        thirdPos[i + 1] *= scaleFactor // Scale Y
        thirdPos[i + 2] *= scaleFactor // Scale Z
      }

      const material = new THREE.RawShaderMaterial({
        vertexShader: shaderOptions.vertex,
        fragmentShader: shaderOptions.fragment,
        uniforms: shaderOptions.uniforms,
        transparent: true,
        blending: THREE.AdditiveBlending,
      })

      geometry.setAttribute("position", new THREE.BufferAttribute(firstPos, 3))
      geometry.setAttribute("secPosition", new THREE.BufferAttribute(secPos, 3))
      geometry.setAttribute("thirdPosition", new THREE.BufferAttribute(thirdPos, 3))
      geometry.setAttribute("forthPosition", new THREE.BufferAttribute(forthPos, 3))
      geometry.setAttribute("fivePosition", new THREE.BufferAttribute(fivePos, 3))

      meshRef.current = new THREE.Points(geometry, material)

      groupRef.current?.add(meshRef.current)
    }

    function setScroll() {
      if (!meshRef.current) return

      const material = meshRef.current.material

      if (material instanceof THREE.ShaderMaterial) {
        gsap
          .timeline({
            defaults: {},
            scrollTrigger: {
              trigger: "body",
              start: "top top",
              end: "bottom bottom",
              scrub: 0.7,
            },
          })
          .to(meshRef.current.rotation, {
            x: Math.PI * 2,
            y: Math.PI * 2,
            z: Math.PI * 2,
          })

        gsap.to(material.uniforms.u_sec1, {
          value: 1.0,
          scrollTrigger: {
            trigger: ".s-1",
            start: "bottom bottom",
            end: "bottom top",
            scrub: 0.7,
          },
        })
        gsap.to(material.uniforms.u_sec2, {
          value: 1.0,
          scrollTrigger: {
            trigger: ".s-2",
            start: "bottom bottom",
            end: "bottom top",
            scrub: 0.7,
          },
        })
        gsap.to(material.uniforms.u_sec3, {
          value: 1.0,
          scrollTrigger: {
            trigger: ".s-3",
            start: "bottom bottom",
            end: "bottom top",
            scrub: 0.7,
          },
        })
        gsap.to(material.uniforms.u_sec4, {
          value: 1.0,
          scrollTrigger: {
            trigger: ".s-4",
            start: "bottom bottom",
            end: "bottom top",
            scrub: 0.7,
          },
        })
      }
    }

    setMesh()
    setScroll()

    console.log(meshRef.current)
  }, [])

  useFrame(() => {
    if (!groupRef.current) return

    // groupRef.current.rotation.x += rotationPower
    // groupRef.current.rotation.y += rotationPower
    groupRef.current.rotation.z += rotationPower
  })

  return (
    <>
      <group ref={groupRef} rotation={new THREE.Euler(Math.PI * 2 * 0.2, 0, Math.PI * 2 * 0.2)}></group>
    </>
  )
}
