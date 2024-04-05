import s from "./scroll-skew.module.scss"

import { ScrollTrigger, gsap } from "@/lib/gsap"
import { useGSAP } from "@gsap/react"
import cx from "clsx"
import { ReactElement, useRef, useState } from "react"

import { Marquee } from "@/components/animations/marquee"

type Props = {
  children: ReactElement
  direction?: number
}

const ScrollSkew = ({ children }: Props) => {
  const ref = useRef(null)
  const [direction, setDirection] = useState(1)

  useGSAP(
    () => {
      gsap.set(".transform-c", { xPercent: 0 })

      /* ADD SKEW SECTION */
      let proxy = { skew: 0, scale: 0 }
      let skewSetter = gsap.quickSetter(".sliding", "skewX", "deg") // fast
      let clamp = gsap.utils.clamp(-20, 20) // don't let the skew go beyond 20 degrees.

      ScrollTrigger.create({
        onUpdate: (self) => {
          let skew = clamp(self.getVelocity() / -200)

          if (self.direction !== direction) {
            setDirection(self.direction)
          }

          // only do something if the skew is MORE severe. Remember, we're always tweening back to 0, so if the user slows their scrolling quickly, it's more natural to just let the tween handle that smoothly rather than jumping to the smaller skew.
          if (Math.abs(skew) > Math.abs(proxy.skew)) {
            proxy.skew = skew
            gsap.to(proxy, {
              // xPercent: () => 100 * self.direction,
              skew: 0,
              duration: 0.4,
              ease: "power3",
              overwrite: true,
              onUpdate: () => {
                skewSetter(proxy.skew)
                // scaleSetter(proxy.scale)
              },
            })
          }
        },
      })

      gsap.to(".sliding", {
        xPercent: () => 40,
        scrollTrigger: {
          trigger: ".sliding",
          // markers: true,
          scrub: true,
        },
      })
    },
    { scope: ref }
  )

  return (
    <div className={s.scrollSkew} ref={ref}>
      <div className={cx(s.transformC, "transform-c")}>
        <div className={cx(s.marqueeInner, "sliding")}>
          <Marquee inverted={direction === 1 ? true : false} repeat={5}>
            {children}
          </Marquee>
        </div>
      </div>
    </div>
  )
}

export default ScrollSkew
