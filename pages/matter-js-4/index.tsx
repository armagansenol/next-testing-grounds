import cx from "clsx"
import Matter from "matter-js"
import * as React from "react"
import s from "./matter4.module.scss"
import { useMeasure } from "@uidotdev/usehooks"

import sample from "@/public/img/exit.png"
import { Img } from "@/components/utility/img"

export interface MatterJs4Props {}

export default function MatterJs4(props: MatterJs4Props) {
  const wallSize = 10

  const [ref, { width: wrapperWidth, height: wrapperHeight }] = useMeasure()
  const boundaryRef = React.useRef<HTMLDivElement>(null)
  const boxRef = React.useRef<HTMLDivElement>(null)
  const box2Ref = React.useRef<HTMLDivElement>(null)
  const rafRef = React.useRef<any>()
  const engineRef = React.useRef<Matter.Engine | null>(null)

  React.useEffect(() => {
    if (!wrapperWidth || !wrapperHeight || !boundaryRef.current) return

    engineRef.current = Matter.Engine.create()
    const engine = engineRef.current

    const heightAdjust = 1
    const width = wrapperWidth
    const height = wrapperHeight * heightAdjust
    const scale = window.devicePixelRatio

    const boxProps = {
      width: 100,
      height: 100,
      centerX: 50,
      centerY: 50,
    }

    const render = Matter.Render.create({
      element: boundaryRef.current,
      engine,
      options: {
        wireframes: false,
        showAngleIndicator: true,
        background: "transparent",
        showSleeping: false,
        width,
        height,
      },
    })
    Matter.Render.setPixelRatio(render, scale)

    const runner = Matter.Runner.create()
    Matter.Runner.run(runner, engine)

    createBoundingBox()
    // addObjects()
    addMouseConstraint()

    const gravity = 0
    engine.gravity.y = gravity

    // let time = 0

    // const changeGravity = function () {
    //   time = time + 0.005

    //   engine.gravity.x = Math.sin(time)
    //   engine.gravity.y = Math.cos(time)

    //   requestAnimationFrame(changeGravity)
    // }

    // changeGravity()

    Matter.Runner.run(engine)
    Matter.Render.run(render)

    function createBoundingBox() {
      if (!wrapperWidth || !wrapperHeight) return

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

      Matter.Composite.add(engine.world, [ground, wallLeft, wallRight, roof])
    }

    function addMouseConstraint() {
      //   const mouseConstraint = Matter.MouseConstraint.create(engine)

      //   Matter.Composite.add(engine.world, [mouseConstraint])

      const mouse = Matter.Mouse.create(render.canvas)
      const mouseConstraint = Matter.MouseConstraint.create(engine, {
        mouse,
        constraint: {
          //   stiffness: 0.2,
          render: {
            strokeStyle: "transparent",
            visible: false,
          },
        },
      })
      Matter.Composite.add(engine.world, [mouseConstraint])
      //   mouse.element.removeEventListener("mousewheel", mouse.mousewheel)
      //   mouse.element.removeEventListener("DOMMouseScroll", mouse.mousewheel)
      render.mouse = mouse
    }

    function animate() {
      if (!wrapperWidth || !wrapperHeight) return

      const box = {
        body: Matter.Bodies.circle(wrapperWidth / 2, 100, boxProps.height / 2, {
          frictionAir: 0,
          restitution: 1,
          velocity: {
            x: (Math.random() - 0.5) * 8,
            y: (Math.random() - 0.5) * 8,
          },
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

      const box2 = {
        body: Matter.Bodies.circle(wrapperWidth / 2, 100, boxProps.height, {
          frictionAir: 0,
          restitution: 0.5,
          velocity: {
            x: (Math.random() - 0.5) * 8,
            y: (Math.random() - 0.5) * 8,
          },
        }),
        elem: box2Ref.current,
        render() {
          if (!this.elem) return

          const { x, y } = this.body.position
          this.elem.style.setProperty("--move-x", `${x}px`)
          this.elem.style.setProperty("--move-y", `${y}px`)
          this.elem.style.setProperty("--rotate", `${this.body.angle}rad`)
        },
      }

      Matter.Composite.add(engine.world, [box.body, box2.body])

      function rerender() {
        // setTest(boxProps)
        // setTest2(boxProps)

        box.render()
        Matter.Engine.update(engine)
        rafRef.current = requestAnimationFrame(rerender)
      }

      rerender()
    }

    requestAnimationFrame(animate)

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
    <div className={cx(s.wrapper, "relative w-screen h-screen overflow-hidden p-20")}>
      <div className={cx(s.matter, "relative w-full h-full")} ref={ref}>
        <div className={cx(s.boundary, "relative w-full h-full")} ref={boundaryRef}>
          <div className={cx(s.box, `bg-teal-600 flex items-center justify-center will-change-transform`)} ref={boxRef}>
            <Img className={s.img} src={sample} alt="sample" />
          </div>
          <div
            className={cx(s.box, `bg-teal-600 flex items-center justify-center will-change-transform`)}
            ref={box2Ref}
          >
            <Img className={s.img} src={sample} alt="sample" />
          </div>
        </div>
      </div>
    </div>
  )
}
