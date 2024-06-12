import { gsap } from "@/lib/gsap"
import { Environment, Html, Lightformer, Sphere, useTexture } from "@react-three/drei"
import { Canvas, extend, useFrame, useThree } from "@react-three/fiber"
import {
  CuboidCollider,
  InstancedRigidBodies,
  InstancedRigidBodyProps,
  Physics,
  RapierRigidBody,
  RigidBody,
} from "@react-three/rapier"
import cx from "clsx"
import { easing } from "maath"
import dynamic from "next/dynamic"
import { AmbientLight, MathUtils, SpotLight, Vector3 } from "three"
import s from "./three-fiber.module.scss"
import { useMemo, useRef } from "react"
extend({ AmbientLight, SpotLight })
import { EffectComposer, SSAO } from "@react-three/postprocessing"

const Smiley = dynamic(() => import("@/components/smiley"), {
  loading: () => (
    <Html>
      <p>Loading...</p>
    </Html>
  ),
  ssr: false,
})

export interface ThreeFiberProps {}

export default function ThreeFiber(props: ThreeFiberProps) {
  const shapes = ["heart", "blink", "blush", "laugh", "heart", "blink", "blush", "laugh"]

  return (
    <div className={cx(s.wrapper)}>
      <Canvas
        shadows
        orthographic
        camera={{ position: [0, 0, 10], zoom: 120 }}
        onCreated={(state) => {
          state.scene.backgroundBlurriness = 0.4
        }}
      >
        <ambientLight intensity={Math.PI} />
        <spotLight decay={0} position={[5, 10, 2.5]} angle={0.2} castShadow />
        <Physics gravity={[0, 0, 0]}>
          {Array.from({ length: shapes.length }, (v, i) => (
            <Smiley
              key={i}
              which={shapes[i % shapes.length]}
              position={[gsap.utils.random(-5, 5), gsap.utils.random(-5, 5), 0]}
            />
          ))}
          <Walls />
          <Pointer />
          <Balls />
        </Physics>
        <Environment files="/hdr/adamsbridge.hdr" background blur={0.7}>
          <Lightformer
            form="rect"
            intensity={4}
            position={[15, 10, 10]}
            scale={20}
            target={[0, 0, 0]}
            //   onCreated={(self) => self.lookAt(0, 0, 0)}
          />
          <Lightformer
            intensity={2}
            position={[-10, 0, -20]}
            scale={[10, 100, 1]}
            target={[0, 0, 0]}
            //   onCreated={(self) => self.lookAt(0, 0, 0)}
          />
        </Environment>
        <Effects />
      </Canvas>
    </div>
  )
}

function Walls() {
  const { width, height } = useThree((state) => state.viewport)
  return (
    <>
      <CuboidCollider position={[0, height / 2 + 1, 0]} args={[width / 2, 1, 1]} />
      <CuboidCollider position={[0, -height / 2 - 1, 0]} args={[width / 2, 1, 1]} />
      <CuboidCollider position={[-width / 2 - 1, 0, 0]} args={[1, height * 10, 10]} />
      <CuboidCollider position={[width / 2 + 1, 0, 0]} args={[1, height * 10, 1]} />
    </>
  )
}

function Pointer({ vec = new Vector3() }) {
  const api = useRef<RapierRigidBody>(null)

  useFrame(({ pointer, viewport }, delta) => {
    easing.damp3(vec, [(pointer.x * viewport.width) / 2, (pointer.y * viewport.height) / 2, 0], 0.1, delta, Infinity)
    api.current?.setNextKinematicTranslation(vec)
  })

  return (
    <RigidBody type="kinematicPosition" colliders="ball" ref={api}>
      <Sphere receiveShadow castShadow args={[0.75]}>
        <meshStandardMaterial color="hotpink" roughness={0} envMapIntensity={0.2} />
      </Sphere>
    </RigidBody>
  )
}

function Effects() {
  return (
    <EffectComposer>
      <SSAO radius={0.2} intensity={20} color="blue" />
    </EffectComposer>
  )
}

function Balls({ count = 15, vec = new Vector3(), rfs = MathUtils.randFloatSpread }) {
  const api = useRef<RapierRigidBody[]>(null)
  const texture = useTexture("/img/test-logo.png")
  //   const texture = useTexture("/img/berkant-test.png")

  useFrame((state, delta) => {
    api.current?.forEach((body) => {
      body.applyImpulse(
        vec
          .copy(body.translation())
          .normalize()
          .multiplyScalar(-400 * delta),
        true
      )
    })
  })

  const instances = useMemo(() => {
    const instances: InstancedRigidBodyProps[] = []

    for (let i = 0; i < count; i++) {
      instances.push({
        key: "instance_" + Math.random(),
        position: [rfs(10), rfs(10), rfs(10)],
        rotation: [Math.random(), Math.random(), Math.random()],
      })
    }

    return instances
  }, [])

  return (
    <InstancedRigidBodies ref={api} colliders="ball" linearDamping={0.65} angularDamping={0.95} instances={instances}>
      <instancedMesh castShadow receiveShadow args={[undefined, undefined, count]}>
        <meshStandardMaterial color="#ffffff" map={texture} roughness={0} envMapIntensity={0.2} />
        <sphereGeometry />
      </instancedMesh>
    </InstancedRigidBodies>
  )
}
