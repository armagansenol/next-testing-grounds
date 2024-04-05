import gsap from "gsap"
import { CustomEase } from "gsap/dist/CustomEase"
import { ScrollTrigger } from "gsap/dist/ScrollTrigger"
import { useGSAP } from "@gsap/react"

if (typeof window !== undefined) {
  gsap.registerPlugin(ScrollTrigger, CustomEase, useGSAP)
}

// const GOLDEN_RATIO = (1 + Math.sqrt(5)) / 2
// const RECIPROCAL_GR = 1 / GOLDEN_RATIO
// const DURATION = RECIPROCAL_GR

const EASE = CustomEase.create("ease", ".43,.195,.02,1")

gsap.defaults({
  duration: 0.4,
  ease: "none",
})

ScrollTrigger.defaults({
  markers: false,
  // markers: process.env.NEXT_PUBLIC_NODE_ENV === "development"
})

export { CustomEase, EASE, ScrollTrigger, gsap }
