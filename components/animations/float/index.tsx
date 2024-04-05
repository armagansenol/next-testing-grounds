import { ScrollTrigger, gsap } from "@/lib/gsap"
import { useGSAP } from "@gsap/react"
import { ReactNode, useRef } from "react"

interface Props {
  children: ReactNode
  amountY?: number
  amountRotate?: number
}

const Float = (props: Props) => {
  const { children, amountY = gsap.utils.random(-10, 10), amountRotate = gsap.utils.random(-3, 3) } = props
  const ref = useRef(null)

  useGSAP(
    () => {
      const tl = gsap.timeline({ paused: true }).to(ref.current, {
        yPercent: amountY,
        rotate: amountRotate,
        duration: 4,
        repeat: -1,
        yoyo: true,
        yoyoEase: "none",
      })

      ScrollTrigger.create({
        animation: tl,
        trigger: ref.current,
        toggleActions: "play pause play pause",
      })
    },
    {
      dependencies: [amountRotate, amountY],
    }
  )

  return (
    <div className="inherit-dims will-change-transform" ref={ref}>
      {children}
    </div>
  )
}

export default Float
