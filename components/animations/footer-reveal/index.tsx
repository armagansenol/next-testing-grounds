import s from "./footer-reveal.module.scss"

import { gsap } from "@/lib/gsap"
import { useGSAP } from "@gsap/react"
import cx from "clsx"
import { ReactNode, useCallback, useRef, useState } from "react"

type Props = {
  children: ReactNode
}

const FooterReveal = ({ children }: Props) => {
  const ref = useRef<HTMLDivElement | null>(null)
  const [height, setHeight] = useState(0)

  const refElement = useCallback((node: any) => {
    if (node === null) return
    setHeight(node.getBoundingClientRect().height)
  }, [])

  useGSAP(
    () => {
      gsap.set(ref.current, {
        yPercent: -50,
      })

      gsap.set(".overlay", {
        opacity: 1,
      })

      gsap.to(ref.current, {
        // translateZ: -100,
        yPercent: 0,
        ease: "none",
        scrollTrigger: {
          trigger: ref.current,
          start: "center bottom",
          end: () => `center bottom-=${height}`,
          scrub: true,
          // markers: true,
        },
      })

      gsap.to(".overlay", {
        // translateZ: -100,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: ref.current,
          start: "center bottom",
          end: () => `center bottom-=${height}`,
          scrub: true,
          // onEnter: () => {
          //   gsap.to(q("[data-overlay]"), {
          //     pointerEvents: "auto",
          //   })
          // },
          // onLeave: () => {
          //   gsap.to(q("[data-overlay]"), {
          //     pointerEvents: "none",
          //   })
          // },
          // onEnterBack: () => {
          //   gsap.to(q("[data-overlay]"), {
          //     pointerEvents: "auto",
          //   })
          // },
          // onLeaveBack: () => {
          //   gsap.to(q("[data-overlay]"), {
          //     pointerEvents: "none",
          //   })
          // }, // markers: true,
        },
      })
    },
    {
      scope: ref,
      dependencies: [height],
      revertOnUpdate: true,
    }
  )

  return (
    <div
      className={s.revealC}
      ref={(node) => {
        ref.current = node
        refElement(node)
      }}
    >
      {children}
      <div className={cx(s.overlay, "overlay")}></div>
    </div>
  )
}

export { FooterReveal }
