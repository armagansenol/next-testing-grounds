import cx from "clsx"
import Matter from "matter-js"
import * as React from "react"
import s from "./matter-2.module.scss"
import { useMeasure } from "@uidotdev/usehooks"

export interface MatterJs2Props {}

export default function MatterJs2(props: MatterJs2Props) {
  const wallSize = 10

  const [ref, { width: wrapperWidth, height: wrapperHeight }] = useMeasure()
  const boundaryRef = React.useRef<HTMLDivElement>(null)
  const boxRef = React.useRef<HTMLDivElement>(null)
  const rafRef = React.useRef<any>()
  const engineRef = React.useRef<Matter.Engine | null>(null)

  const [test, setTest] = React.useState<{
    width: number
    height: number
    centerX: number
    centerY: number
  } | null>(null)

  const [test2, setTest2] = React.useState<any>(null)

  React.useEffect(() => {
    if (!wrapperWidth || !wrapperHeight || !boxRef.current || !boundaryRef.current) return

    const groundProps = {
      width: wrapperWidth,
      height: wallSize,
      centerX: wrapperWidth / 2,
      centerY: wrapperHeight + wallSize / 2,
    }

    const roofProps = {
      width: wrapperWidth,
      height: wallSize,
      centerX: wrapperWidth / 2,
      centerY: -wallSize / 2,
    }

    const wallLeftProps = {
      width: wallSize,
      height: wrapperHeight,
      centerX: -wallSize / 2,
      centerY: wrapperHeight / 2,
    }

    const wallRightProps = {
      width: wallSize,
      height: wrapperHeight,
      centerX: wrapperWidth + wallSize / 2,
      centerY: wrapperHeight / 2,
    }

    const boxProps = {
      width: 100,
      height: 100,
      centerX: 50,
      centerY: 50,
    }

    const animate = () => {
      engineRef.current = Matter.Engine.create()
      const engine = engineRef.current

      const ground = Matter.Bodies.rectangle(
        groundProps.centerX,
        groundProps.centerY,
        groundProps.width,
        groundProps.height,
        {
          isStatic: true,
        }
      )

      const roof = Matter.Bodies.rectangle(
        roofProps.centerX,
        roofProps.centerY,
        roofProps.width * 2,
        roofProps.height,
        {
          isStatic: true,
        }
      )

      const wallLeft = Matter.Bodies.rectangle(
        wallLeftProps.centerX,
        wallLeftProps.centerY,
        wallLeftProps.width,
        wallLeftProps.height * 4,
        {
          isStatic: true,
        }
      )

      const wallRight = Matter.Bodies.rectangle(
        wallRightProps.centerX,
        wallRightProps.centerY,
        wallRightProps.width,
        wallRightProps.height * 4,
        {
          isStatic: true,
        }
      )

      const box = {
        body: Matter.Bodies.rectangle(wrapperWidth / 2, 100, boxProps.width, boxProps.height, {
          frictionAir: 0.001,
        }),
        elem: boxRef.current,
        render() {
          if (!this.elem) return

          const { x, y } = this.body.position
          this.elem.style.setProperty("--move-x", `${x}px`)
          this.elem.style.setProperty("--move-y", `${y}px`)
          this.elem.style.setProperty("--rotate", `${this.body.angle}rad`)
        },
      }

      const mouseConstraint = Matter.MouseConstraint.create(engine)

      Matter.Composite.add(engine.world, [box.body, ground, wallLeft, wallRight, roof, mouseConstraint])

      function rerender() {
        // setTest(boxProps)
        // setTest2(boxProps)

        box.render()
        Matter.Engine.update(engine)
        rafRef.current = requestAnimationFrame(rerender)
      }

      rerender()
    }

    animate()

    return () => {
      if (!engineRef.current) return
      if (!rafRef.current) return

      cancelAnimationFrame(rafRef.current)
      Matter.Engine.clear(engineRef.current)
      // see https://github.com/liabru/matter-js/issues/564
      // for additional cleanup if using MJS renderer/runner
    }
  }, [wrapperHeight, wrapperWidth])

  return (
    <div className={cx(s.wrapper, "relative w-screen h-screen overflow-hidden")}>
      <div className={cx(s.matter, "relative w-full h-full")} ref={ref}>
        <div ref={boundaryRef}>
          {/* {test && (
          <div
            style={{
              position: "absolute",
              border: "1px solid blue",
              left: `${test.centerX - test.width / 2}px`,
              top: `${test.centerY - test.height / 2}px`,
              width: `${test.width}px`,
              height: `${test.height}px`,
            }}
          ></div>
        )} */}

          {/* {test2 && (
          <div
            style={{
              position: "absolute",
              border: "1px solid red",
              left: `${test2.left}px`,
              top: `${test2.top}px`,
              width: `${test2.width}px`,
              height: `${test2.height}px`,
            }}
          ></div>
        )} */}

          <div className={cx(s.box, `bg-teal-600 flex items-center justify-center will-change-transform`)} ref={boxRef}>
            BOX
          </div>
        </div>
      </div>
    </div>
  )
}
