import * as React from "react"

type SetupCanvas = (context: CanvasRenderingContext2D) => void

type Circle = {
  position: { x: number; y: number }
  radius: number
  color: string
}

type MyCanvasComponentProps = {
  width: number
  height: number
}

const circles: Circle[] = [
  { position: { x: 200, y: 150 }, radius: 50, color: "red" },
  { position: { x: 300, y: 250 }, radius: 30, color: "pink" },
]

function useCanvas(setupCanvas: SetupCanvas) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null)

  React.useEffect(() => {
    const canvas = canvasRef.current

    if (!canvas) return

    const context = canvas.getContext("2d")

    if (!context) return

    setupCanvas(context)
  }, [setupCanvas])

  return canvasRef
}

const Canvas2D: React.FC<MyCanvasComponentProps> = ({ height, width }) => {
  const setupCanvas = (context: CanvasRenderingContext2D) => {
    context.fillStyle = "blue"
    context.fillRect(0, 0, height, width)
    circles.forEach((circle) => drawCircle(context, circle))
  }

  const canvasRef = useCanvas(setupCanvas)

  function drawCircle(context: CanvasRenderingContext2D, circle: Circle) {
    context.beginPath()
    context.arc(circle.position.x, circle.position.y, circle.radius, 0, Math.PI * 2)
    context.closePath()
    context.fillStyle = circle.color
    context.fill()
  }

  return <canvas ref={canvasRef} height={height} width={width} />
}

export interface CodropsProps {}

export default function Codrops(props: CodropsProps) {
  return (
    <div className="flex items-center justify-center">
      <Canvas2D height={500} width={500} />
    </div>
  )
}
