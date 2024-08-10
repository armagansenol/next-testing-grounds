import { LoadingSpinner } from "@/components/utility/loading-spinner"
import { Environment, Html, OrbitControls, Stats } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { Bloom, EffectComposer, N8AO, TiltShift2 } from "@react-three/postprocessing"
import dynamic from "next/dynamic"
import { Suspense } from "react"
import * as THREE from "three"

const ToothModel = dynamic(() => import("@/components/tooth-model"), {
  loading: () => (
    <Html>
      <LoadingSpinner />
    </Html>
  ),
  ssr: false,
})

export default function GltfjsxModelTest() {
  return (
    <div className="w-screen h-screen">
      <Canvas camera={{ position: [0, 0, 10] }}>
        <color attach="background" args={["#151518"]} />
        <Suspense fallback={null}>
          <ToothModel />
          <group rotation={[0, 0, Math.PI / 4]}>
            <mesh position={[0, 0, -10]}>
              <planeGeometry args={[20, 2]} />
              <meshBasicMaterial color="#e0e0e0" side={THREE.DoubleSide} />
            </mesh>
            <mesh position={[0, 0, -10]}>
              <planeGeometry args={[2, 20]} />
              <meshBasicMaterial color="#e0e0e0" side={THREE.DoubleSide} />
            </mesh>
          </group>
        </Suspense>
        <Environment preset="studio" />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        <EffectComposer>
          <N8AO aoRadius={1} intensity={2} />
          <TiltShift2 blur={0.2} />
          <Bloom mipmapBlur luminanceThreshold={1} intensity={0.3} />
        </EffectComposer>
        <OrbitControls />
        <Stats />
      </Canvas>
    </div>
  )
}
