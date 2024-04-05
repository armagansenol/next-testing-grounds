import s from "./footer.module.scss"

import cx from "clsx"

import { TitleReveal } from "@/components/animations/title-reveal"

export default function Footer() {
  console.log("RENDER FOOTER")

  return (
    <footer className={cx(s.footer, "flex items-center justify-center bg-teal-100")}>
      <TitleReveal>FOOTER</TitleReveal>
    </footer>
  )
}
