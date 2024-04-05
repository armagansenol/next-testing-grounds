import { ReactNode } from "react"

import AnimateInOut from "@/components/animations/animate-in-out"

type Props = {
  children: ReactNode
  durationIn: number
  durationOut: number
  delay?: number
  set?: gsap.TweenVars
}

const FadeInOut = ({ children, delay, durationIn, durationOut }: Props) => (
  <AnimateInOut
    durationIn={durationIn}
    durationOut={durationOut}
    delay={delay}
    from={{
      opacity: 1,
      duration: 0.5,
    }}
    to={{
      opacity: 0,
    }}
  >
    {children}
  </AnimateInOut>
)

export default FadeInOut
