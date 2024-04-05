import { CustomEase, ScrollTrigger, gsap } from "@/lib/gsap"
import { useGSAP } from "@gsap/react"
import { useRef } from "react"
import cx from "clsx"

export interface TextRevealProps {
  children: JSX.Element | JSX.Element[]
}

const TextReveal = (props: TextRevealProps) => {
  const { children } = props
  const ref = useRef(null)

  useGSAP(
    () => {
      if (ScrollTrigger.isTouch) {
        return
      }

      gsap.from(".animated-text", {
        yPercent: 100,
        stagger: 0.1,
        ease: CustomEase.create("easeName", "0.43,0.195,0.2,1"),
        duration: 1,
        scrollTrigger: {
          trigger: ref.current,
        },
      })
    },
    { scope: ref }
  )

  return (
    <span ref={ref}>
      {Array.isArray(children) ? (
        children.map((item, i) => {
          return (
            <span className={cx("overflow-hidden tablet:block")} key={i}>
              <span className={cx("animated-text tablet:block will-change-transform")}>{item}</span>
            </span>
          )
        })
      ) : (
        <span className={cx("overflow-hidden tablet:block")}>
          <span className={cx("animated-text tablet:block will-change-transform")}>{children}</span>
        </span>
      )}
    </span>
  )
}

export { TextReveal }
