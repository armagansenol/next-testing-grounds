import cx from 'clsx';
import { Bodies, Composite, Engine, Render } from 'matter-js';
import * as React from 'react';

export interface MatterJsProps {}

export default function MatterJs(props: MatterJsProps) {
  const scene = React.useRef(null)
  const engine = React.useRef(Engine.create())
  const isPressed = React.useRef(false)

  React.useEffect(() => {
    // mount
    const cw = document.body.clientWidth
    const ch = document.body.clientHeight / 1.2

    if (!scene.current) return

    const render = Render.create({
      element: scene.current,
      engine: engine.current,
      options: {
        width: cw,
        height: ch,
        wireframes: false,
        background: "transparent",
        pixelRatio: 0.9,
      },
    })

    // boundaries
    Composite.add(engine.current.world, [
      Bodies.rectangle(cw / 2, 5, cw, 10, { isStatic: true, render: { fillStyle: "#000000" } }),
      Bodies.rectangle(-10, ch / 2, 20, ch, { isStatic: true }),
      Bodies.rectangle(cw / 2, ch + 10, cw, 20, { isStatic: true }),
      Bodies.rectangle(cw + 10, ch / 2, 20, ch, { isStatic: true }),
      Bodies.rectangle(cw + 10, ch / 2, 20, ch, { isStatic: true }),
    ])

    // run the engine
    Engine.run(engine.current)
    Render.run(render)

    // unmount
    return () => {
      // destroy Matter
      Render.stop(render)
      Composite.clear(engine.current.world, false)
      Engine.clear(engine.current)
      render.canvas.remove()
      //   render.canvas = null
      //   render.context = null
      render.textures = {}
    }
  }, [])

  const handleDown = () => {
    isPressed.current = true
  }

  const handleUp = () => {
    isPressed.current = false
  }

  const handleAddCircle = (e: any) => {
    if (isPressed.current) {
      const ball = Bodies.circle(e.clientX, e.clientY, 10 + Math.random() * 30, {
        mass: 0.001,
        restitution: 0.2,
        friction: 0.5,
        render: {
          fillStyle: "#0000ff",
        },
      })
      Composite.add(engine.current.world, [ball])
    }
  }

  return (
    <div onMouseDown={handleDown} onMouseUp={handleUp} onMouseMove={handleAddCircle}>
      <div
        className={cx("border-solid border-x-cyan-800 border-spacing-1")}
        ref={scene}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  )
}
