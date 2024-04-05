import { EASE, ScrollTrigger, gsap } from "@/lib/gsap"
import { useGSAP } from "@gsap/react"
import cx from "clsx"
import { useRef } from "react"

export interface TitleRevealProps {
  children: string
}

const TitleReveal = (props: TitleRevealProps) => {
  const { children } = props
  const ref = useRef(null)

  console.log("RENDER TITLE REVEAL")

  useGSAP(
    () => {
      if (ScrollTrigger.isTouch) {
        return
      }

      const tl = gsap.timeline({ paused: true }).from(".animated-text", {
        yPercent: 110,
        stagger: 0.025,
        ease: EASE,
        duration: 1,
        scale: 0.9,
      })

      ScrollTrigger.create({
        id: "title-reveal",
        animation: tl,
        trigger: ref.current,
        markers: true,
        refreshPriority: -1,
      })
    },
    { scope: ref }
  )

  return (
    <span ref={ref}>
      {Array.from(children).map((letter, i) => {
        return (
          <span className={cx("overflow-hidden tablet:inline-block whitespace-pre-wrap")} key={i}>
            <span className={cx("animated-text tablet:inline-block will-change-transform")}>{letter}</span>
          </span>
        )
      })}
    </span>
  )
}

export { TitleReveal }
