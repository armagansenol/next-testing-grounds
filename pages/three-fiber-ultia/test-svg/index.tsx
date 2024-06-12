import { MeshProps, extend, useLoader } from "@react-three/fiber"
import { SVGLoader } from "three/addons/loaders/SVGLoader.js"

import { ExtrudeGeometry, MeshBasicMaterial, MeshPhongMaterial } from "three"
extend({ ExtrudeGeometry, MeshPhongMaterial, MeshBasicMaterial })

import { BallCollider, RigidBody } from "@react-three/rapier"
import { useMemo } from "react"
import * as THREE from "three"

const TestSvg = (props: MeshProps) => {
  const svgData = useLoader(SVGLoader, "/img/lvup-icon.svg")
  const shapes = useMemo(() => {
    return svgData.paths.map((p) => p.toShapes(true))
  }, [svgData])

  return (
    <RigidBody colliders="cuboid" position={[20, 20, 0]}>
      <BallCollider args={[0.48]} />
      <>
        {shapes.map((s, i) => (
          <>
            <mesh>
              <extrudeGeometry
                args={[
                  s,
                  {
                    depth: 1,
                    bevelEnabled: false,
                    steps: 30,
                  },
                ]}
              />
            </mesh>
            <meshPhongMaterial color="red" side={THREE.DoubleSide} />
          </>
        ))}
      </>
    </RigidBody>
  )
}

export default TestSvg
