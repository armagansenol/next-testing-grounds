import s from "./header.module.scss"

import cx from "clsx"
import { useGSAP } from "@gsap/react"
import { useRef } from "react"
import { ScrollTrigger, gsap } from "@/lib/gsap"

import { Link } from "@/components/utility/link"

export default function Header() {
  const ref = useRef(null)

  useGSAP(
    () => {
      const tl = gsap

        .from(ref.current, {
          yPercent: -100,
          paused: true,
          duration: 0.2,
        })
        .progress(1)

      ScrollTrigger.create({
        id: "header",
        animation: tl,
        trigger: ref.current,
        markers: true,
        start: "top top",
        end: "max",
        onUpdate: (self) => {
          self.direction === -1 ? tl.play() : tl.reverse()
        },
      })
    },
    {
      scope: ref,
    }
  )
  return (
    <header className={cx(s.header, "flex items-center justify-center gap-10 bg-lime-300")} ref={ref}>
      <div>
        <Link href="/">HOME</Link>
      </div>
      <div>
        <Link href="/page-two">PAGE TWO</Link>
      </div>
    </header>
  )
}
