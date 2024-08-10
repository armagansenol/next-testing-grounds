import { gsap } from "@/lib/gsap"
import { useGLTF } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { BallCollider, RapierRigidBody, RigidBody } from "@react-three/rapier"
import * as React from "react"
import * as THREE from "three"

export interface SmileysProps {
  which: {
    [key: string]: any
  }
}

export default function Smiley(props: SmileysProps) {
  const { which } = props

  const api = React.useRef<RapierRigidBody>(null)
  const { nodes, materials } = useGLTF("/glb/ultia-test.glb")

  const intensity = 0.1

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (!api.current) return

      api.current.applyImpulse(
        { x: gsap.utils.random(-intensity, intensity), y: gsap.utils.random(-intensity, intensity), z: 0 },
        true
      )
      // api.current?.applyTorqueImpulse(
      //   { x: gsap.utils.random(-intensity, intensity), y: gsap.utils.random(-intensity, intensity), z: 0 },
      //   true
      // )
      // api.current?.setRotation(
      //   {
      //     x: gsap.utils.random(5, 10),
      //     y: gsap.utils.random(5, 10),
      //     z: gsap.utils.random(5, 10),
      //     w: gsap.utils.random(5, 10),
      //   },
      //   true
      // )
      // api.current?.addForce({ x: gsap.utils.random(-1, 1), y: gsap.utils.random(-1, 1), z: 0 }, true)
    }, gsap.utils.random(1000, 5000))

    return () => {
      clearInterval(interval)
    }
  }, [])

  function click() {
    api.current?.applyImpulse(
      {
        x: gsap.utils.random(-intensity * 5, intensity * 5),
        y: gsap.utils.random(-intensity * 5, intensity * 5),
        z: 0,
      },
      true
    ) // api.current?.applyTorqueImpulse({ x: Math.random() / 2, y: Math.random() / 2, z: Math.random() / 2 }, true)
  }

  const vec = new THREE.Vector3()

  useFrame((state, delta) => {
    api.current?.applyImpulse(
      vec
        .copy(api.current.translation())
        .normalize()
        .multiplyScalar(-2 * delta),
      true
    )
  })

  return (
    <>
      <RigidBody
        colliders={false}
        ref={api}
        // uncomment next line to lock rotations to Z
        // enabledRotations={[false, false, true]}
        enabledTranslations={[true, true, false]}
        linearDamping={1}
        angularDamping={1}
        restitution={1.5}
        mass={10}
        {...props}
      >
        <BallCollider args={[0.48]} />
        <mesh
          castShadow
          receiveShadow
          onClick={click}
          geometry={nodes[which].geometry}
          material={materials.PaletteMaterial001}
          material-roughness={0.2}
          material-toneMapped={false}
        />
        {/* <Html>
          <Link
            className="flex items-center justify-center w-[200px] h-[200px] rounded-[50%] bg-slate-400 -translate-x-1/2 -translate-y-1/2 opacity-[0.6]"
            href="/"
          >
            HOME
          </Link>
        </Html> */}
      </RigidBody>
    </>
  )
}
