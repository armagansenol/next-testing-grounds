import { PerspectiveCamera, shaderMaterial, Stats } from "@react-three/drei"
import { Canvas, extend, ReactThreeFiber, useFrame, useLoader } from "@react-three/fiber"
import { Suspense, useEffect, useRef } from "react"
import * as THREE from "three"
import { shaderOptions } from "./_shaders/shaderOptions"

const MyShaderMaterial = shaderMaterial(shaderOptions.uniforms, shaderOptions.vertex, shaderOptions.fragment)

extend({ MyShaderMaterial })

declare global {
  namespace JSX {
    interface IntrinsicElements {
      myShaderMaterial: ReactThreeFiber.Object3DNode<THREE.ShaderMaterial, typeof THREE.ShaderMaterial>
    }
  }
}

export default function ShaderTransitions() {
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
      <PerspectiveCamera
        makeDefault
        position={[0, 0, 4]}
        near={0.1}
        fov={2 * (180 / Math.PI) * Math.atan(15 / (2 * 4))}
      />
      {/* <OrthographicCamera
        makeDefault
        position={[0, 0, 1]}
        near={0.1}
        zoom={30}
      /> */}
      <ambientLight intensity={0.2} />
      <directionalLight castShadow position={[4, -4, 12]} intensity={1} />
      <pointLight position={[0, 0, 20]} intensity={1000} />

      <Suspense fallback={null}>
        <Geometry />
      </Suspense>
      {/* <OrbitControls /> */}
      <Stats />
    </Canvas>
  )
}

function Geometry() {
  const groupRef = useRef<THREE.Group>(null)
  const tex1 = useLoader(THREE.TextureLoader, "/img/g-1.jpg")
  const tex2 = useLoader(THREE.TextureLoader, "/img/g-6.jpg")
  const displacement = useLoader(THREE.TextureLoader, "/img/disp1.jpg")

  const meshRef = useRef<THREE.Mesh>(null)
  const progressRef = useRef(0)
  const animatingRef = useRef(false)

  useEffect(() => {
    if (!meshRef.current) return

    const imageAspect = tex1.image.height / tex1.image.width
    let a1
    let a2

    if (window.innerHeight / window.innerWidth > imageAspect) {
      a1 = (window.innerWidth / window.innerHeight) * imageAspect
      a2 = 1
    } else {
      a1 = 1
      a2 = window.innerHeight / window.innerWidth / imageAspect
    }

    if (meshRef.current.material instanceof THREE.ShaderMaterial) {
      meshRef.current.material.uniforms.resolution.value.x = window.innerWidth
      meshRef.current.material.uniforms.resolution.value.y = window.innerHeight
      meshRef.current.material.uniforms.resolution.value.z = a1
      meshRef.current.material.uniforms.resolution.value.w = a2
    }
  }, [tex1])

  const handleClick = () => {
    animatingRef.current = true
    progressRef.current = 0
  }

  useFrame((state, delta) => {
    if (animatingRef.current) {
      progressRef.current += delta * 0.1
      if (progressRef.current >= 1) {
        animatingRef.current = false
        progressRef.current = 1
      }
      if (meshRef.current) {
        if (meshRef.current.material instanceof THREE.ShaderMaterial) {
          meshRef.current.material.uniforms.progress.value = progressRef.current
        }
      }
    }
  })

  return (
    <>
      <group position={new THREE.Vector3(0, 0, 0)} ref={groupRef} scale={1.25} onPointerDown={handleClick}>
        <mesh ref={meshRef} geometry={new THREE.PlaneGeometry(15, 10)}>
          <myShaderMaterial
            attach="material"
            uniforms={{
              progress: { value: 1 },
              width: { value: 2 },
              scaleX: { value: 4 },
              scaleY: { value: 10 },
              texture1: { value: tex1 },
              texture2: { value: tex2 },
              displacement: { value: displacement },
              resolution: {
                value: new THREE.Vector4(
                  window.innerWidth,
                  window.innerHeight,
                  1.0,
                  window.innerHeight / window.innerWidth
                ),
              },
              time: { value: 0 },
            }}
            toneMapped={false}
          />
        </mesh>
      </group>
    </>
  )
}
