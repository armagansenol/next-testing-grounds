import s from "./header.module.scss"

import cx from "clsx"
import { useRef } from "react"

import { Link } from "@/components/utility/link"

export default function Header() {
  const ref = useRef(null)

  // useGSAP(
  //   () => {
  //     const tl = gsap

  //       .from(ref.current, {
  //         yPercent: -100,
  //         paused: true,
  //         duration: 0.2,
  //       })
  //       .progress(1)

  //     ScrollTrigger.create({
  //       id: "header",
  //       animation: tl,
  //       trigger: ref.current,
  //       markers: true,
  //       start: "top top",
  //       end: "max",
  //       onUpdate: (self) => {
  //         self.direction === -1 ? tl.play() : tl.reverse()
  //       },
  //     })
  //   },
  //   {
  //     scope: ref,
  //   }
  // )
  return (
    <header className={cx(s.header, "flex items-center justify-center gap-10 bg-lime-300")} ref={ref}>
      <div>
        <Link href="/">HOME</Link>
      </div>
      <div>
        <Link href="/page-two">PAGE TWO</Link>
      </div>
      <div>
        <Link href="/file-upload">FILE UPLOAD</Link>
      </div>
      <div>
        <Link href="/slider">SLIDER</Link>
      </div>
      <div>
        <Link href="/form-test">FORM TEST</Link>
      </div>
      <div>
        <Link href="/codrops">CODROPS</Link>
      </div>
      <div>
        <Link href="/matter-js">matter.js</Link>
      </div>
      <div>
        <Link href="/matter-js-2">matter.js 2</Link>
      </div>
      <div>
        <Link href="/matter-js-3">matter.js 3</Link>
      </div>
      <div>
        <Link href="/matter-js-4">matter.js 4</Link>
      </div>
      <div>
        <Link href="/splitting-js">splitting.js</Link>
      </div>
      <div>
        <Link href="/react-split-text">react split text</Link>
      </div>
      <div>
        <Link href="/three-fiber">three fiber</Link>
      </div>
      <div>
        <Link href="/three-fiber-ultia">three fiber ultia</Link>
      </div>
      <div>
        <Link href="/tiptap-test">tiptap</Link>
      </div>
    </header>
  )
}
