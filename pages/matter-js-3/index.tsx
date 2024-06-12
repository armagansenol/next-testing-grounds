import { Img } from "@/components/utility/img"
import Matter from "matter-js"
import * as React from "react"
import sample from "@/public/img/about-banner.jpg"
import s from "./matter3.module.scss"

export interface MatterJs3Props {}

export default function MatterJs3(props: MatterJs3Props) {
  const ref = React.useRef(null)

  React.useEffect(() => {
    let Engine = null
    let World = null
    let engine = null
    let world = null

    function initMatter(matterHolder: HTMLElement) {
      const Engine = Matter.Engine,
        Render = Matter.Render,
        Runner = Matter.Runner,
        Bodies = Matter.Bodies,
        World = Matter.World,
        MouseConstraint = Matter.MouseConstraint,
        Mouse = Matter.Mouse,
        Bounds = Matter.Bounds,
        Composite = Matter.Composite

      const engine = Engine.create()
      engine.enableSleeping = true
      world = engine.world

      const heightAdjust = 1
      const width = matterHolder.clientWidth
      const height = matterHolder.clientHeight * heightAdjust
      const scale = window.devicePixelRatio

      console.log("width", width)

      const render = Render.create({
        element: matterHolder,
        engine,
        options: {
          wireframes: true,
          showAngleIndicator: false,
          background: "transparent",
          showSleeping: false,
          width,
          height,
        },
      })
      Matter.Render.setPixelRatio(render, scale)

      const runner = Runner.create()
      Runner.run(runner, engine)
      const placement = { x: 1, y: 1 }
      const spacing = { x: 300, y: 300 }

      createBoundingBox()
      addObjects()
      addMouse()

      const gravity = 0.1
      engine.gravity.y = gravity
      Matter.Runner.run(engine)
      Render.run(render)
      window.requestAnimationFrame(mapHTML)

      function createBoundingBox() {
        World.add(engine.world, [
          Bodies.rectangle(width / 2, height + 250, width, 500, { label: "_noMap" }),
          Bodies.rectangle(width / 2, -50, width, 100, { label: "_noMap" }),
          Bodies.rectangle(-50, height / 2, 100, height, { label: "_noMap" }),
          Bodies.rectangle(width + 50, height / 2, 100, height, { label: "_noMap" }),
        ])
      }

      function addObjects() {
        matterHolder.querySelectorAll("[data-object]").forEach((object) => {
          addObject(object)
        })
      }

      function addObject(object: Element) {
        const objWidth = object.scrollWidth
        const objHeight = object.scrollHeight
        const rect = Matter.Bodies.rectangle(placement.x * spacing.y, placement.y * spacing.x, objWidth, objHeight, {
          label: object.getAttribute("data-object") as string,
          density: 0.8,
          frictionAir: 0.01,
          restitution: 0.5,
          friction: 0.001,
          render: {
            fillStyle: "transparent",
            strokeStyle: "transparent",
          },
        })

        World.add(engine.world, rect)
        Matter.Sleeping.update(rect, 50)
        const rotation = (Math.random() < 0.5 ? -1 : 1) * (Math.random() * 1)
        Matter.Body.rotate(rect, rotation)
        checkPlacement()
      }

      function checkPlacement() {
        placement.x++
        if (placement.x * spacing.x > width - spacing.x) {
          placement.y++
          placement.x = 1
        }
      }

      function addMouse() {
        const mouse = Mouse.create(render.canvas)
        const mouseConstraint = MouseConstraint.create(engine, {
          mouse,
          constraint: {
            stiffness: 0.2,
            render: {
              strokeStyle: "transparent",
              visible: false,
            },
          },
        })
        World.add(engine.world, mouseConstraint)

        mouse.element.removeEventListener("mousewheel", mouse.mousewheel)
        mouse.element.removeEventListener("DOMMouseScroll", mouse.mousewheel)
        render.mouse = mouse
      }

      function mapHTML() {
        const allBodies = Matter.Composite.allBodies(engine.world)

        allBodies.forEach((body) => {
          const targetObject: HTMLElement | null = matterHolder.querySelector(`[data-object="${body.label}"]`)
          if (body.label === "_noMap" || !targetObject) {
            return
          }
          targetObject.style.setProperty("--move-x", `${body.position.x}px`)
          targetObject.style.setProperty("--move-y", `${body.position.y}px`)
          targetObject.style.setProperty("--rotate", `${body.angle}rad`)
        })

        window.requestAnimationFrame(mapHTML)
      }
    }

    function initForm() {
      const submit: HTMLElement | null = document.querySelector("[data-submit]")
      const email = document.querySelector("[data-email]")
      const name = document.querySelector("[data-name]")

      // submit?.addEventListener("click", () => {
      //   alert(`Name: ${name.value} || Email: ${email.value}`)
      // })
    }

    document.addEventListener("DOMContentLoaded", () => {
      const matterHolder = ref.current
      if (!matterHolder) {
        return
      }
      initMatter(matterHolder)
      initForm()
    })
  }, [])

  return (
    <div className="relative h-screen w-screen" ref={ref}>
      <div className={s.matter} data-html-matter>
        <div data-object="obj0">
          <h1 className={s.marqee}>
            <div>
              <span>This pen uses matter.js with HTML elements</span>
              <span>This pen uses matter.js with HTML elements</span>
            </div>
          </h1>
        </div>

        <div data-object="obj1">
          <div className={s.inputGroup}>
            <label className={s.label} htmlFor="n-a-m-e">
              Name:
            </label>
            <input className={s.input} type="text" name="n-a-m-e" id="n-a-m-e" placeholder="First & Last" data-name />
          </div>
        </div>

        <div data-object="obj2">
          <div className={s.inputGroup}>
            <label className={s.label} htmlFor="e-m-ail">
              Email:
            </label>
            <input className={s.input} type="text" name="e-m-ail" id="e-m-ail" placeholder="ex@email.com" data-email />
          </div>
        </div>

        <div data-object="obj3">
          <button data-submit>Submit</button>
        </div>

        <div data-object="obj4">
          <div className={s.product}>
            <div className={s.image}>
              <Img src={sample} alt="lol" />
            </div>
            <h4>The Best Burger</h4>
            <button className={s.button}>Buy Now — $17.00</button>
          </div>
        </div>

        <div data-object="obj5">
          <div className={s.product}>
            <div className={s.image}>
              <Img src={sample} alt="lol" />
            </div>
            <h4>Pretty Good Fries</h4>
            <button className={s.button}>Buy Now — $8.00</button>
          </div>
        </div>
      </div>
    </div>
  )
}
