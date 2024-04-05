import { gsap } from "@/lib/gsap"
import { useGSAP } from "@gsap/react"
import { ReactNode, useRef } from "react"

interface Parallax {
  children: ReactNode
  speedX?: number
  speedY: number
}

const Parallax = (props: Parallax) => {
  const { children, speedX, speedY } = props
  const ref = useRef(null)

  useGSAP(
    () => {
      gsap.to(ref.current, {
        ...(speedX && { xPercent: 100 * speedX }),
        ...(speedY && { yPercent: 100 * speedY }),
        scrollTrigger: {
          id: "parallax",
          markers: false,
          scrub: true,
          trigger: ref.current,
        },
      })
    },
    { scope: ref, dependencies: [speedX, speedY] }
  )

  return (
    <div ref={ref} className="inherit-dims">
      {children}
    </div>
  )
}

export { Parallax }
