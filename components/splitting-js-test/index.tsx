import * as React from "react"
import "splitting/dist/splitting.css"
import "splitting/dist/splitting-cells.css"
import Splitting from "splitting"
import { useGSAP } from "@gsap/react"
import { gsap } from "@/lib/gsap"
import s from "./splitting-js-test.module.scss"
import cx from "clsx"

export interface SplittingJsTestProps {}

export default function SplittingJsTest(props: SplittingJsTestProps) {
  //   const textRef = React.useRef<HTMLHeadingElement>(null)

  useGSAP(() => {
    // if (!textRef.current) return

    // Splitting({
    //   /* target: String selector, Element, Array of Elements, or NodeList */
    //   target: textRef.current,
    //   /* by: String of the plugin name */
    //   by: "lines",
    //   /* key: Optional String to prefix the CSS variables */
    //   key: null,
    // })

    // gsap.from(".char", {
    //   autoAlpha: 0,
    //   duration: 1,
    //   stagger: 0.01,
    // })

    // Splitting.js
    // Calling the Splitting function to split the text into individual words/characters,
    const splittingOutput = Splitting({
      target: ".content__text",
      by: "lines",
      key: null,
    })

    // .content__text elements
    const texts = [...Array.from(document.querySelectorAll(".content__text"))]

    // Cache all .char elements at the beginning. Each text contains multiple words, each word contains multiple chars.
    const chars = texts.map((text) => {
      // Get the words for each text
      const words = Array.from(text.querySelectorAll(".word"))
      // For each word, get the chars
      return [...words].map((word) => word.querySelectorAll(".char"))
    })

    // Let's define the position of the current text
    let currentTextPos = 0

    // Check if there's an animation in progress
    let isAnimating = false

    // Add class current to the "current" one
    texts[currentTextPos].classList.add("content__text--current")

    // Set perspective
    texts.forEach((text) => {
      gsap.set(text, { perspective: 1000 })
    })
    splittingOutput
      .map((output) => output.words)
      .flat()
      .forEach((word) => {
        if (!word) return

        gsap.set(word, { transformStyle: "preserve-3d" })
      })

    // switch between texts
    const switchTexts = () => {
      if (isAnimating) return false
      isAnimating = true

      const upcomingTextPos = currentTextPos ? 0 : 1

      // All current text words
      const currentWords = splittingOutput[currentTextPos].words

      if (!currentWords) return

      // All upcoming text words
      const upcomingtWords = splittingOutput[upcomingTextPos].words

      if (!upcomingtWords) return

      const tl = gsap.timeline({
        onComplete: () => {
          // Update currentTextPos
          currentTextPos = upcomingTextPos
          isAnimating = false
        },
      })
      currentWords.forEach((_, wordIndex) => {
        const wordTimeline = gsap.timeline().fromTo(
          chars[currentTextPos][wordIndex],
          {
            willChange: "transform",
            transformOrigin: "0% 50%",
            opacity: 1,
            rotationY: 0,
            z: 0,
          },
          {
            duration: 0.3,
            ease: "sine.in",
            opacity: 0,
            rotationY: -45,
            z: 30,
            stagger: {
              each: 0.05,
              from: "end",
            },
          }
        )
        tl.add(wordTimeline, (currentWords.length - (wordIndex - 1)) * 0.02)
      })

      tl.add(() => {
        texts[currentTextPos].classList.remove("content__text--current")
      })
      tl.add(() => {
        texts[upcomingTextPos].classList.add("content__text--current")
      }, ">-=0.6").addLabel("previous", ">")

      upcomingtWords.forEach((_, wordIndex) => {
        const wordTimeline = gsap.timeline().fromTo(
          chars[upcomingTextPos][wordIndex],
          {
            willChange: "transform",
            transformOrigin: "0% 50%",
            opacity: 0,
            rotationY: 90,
            z: -60,
          },
          {
            duration: 0.6,
            ease: "back.out(4)",
            opacity: 1,
            rotationY: 0,
            z: 0,
            stagger: {
              each: 0.05,
              from: "start",
            },
          }
        )
        tl.add(wordTimeline, `previous+=${(upcomingtWords.length - (wordIndex - 1)) * 0.02}`)
      })
    }

    switchTexts()
  }, [])

  return (
    <div className="relative">
      <h2 className={cx(s.text, "content__text")}>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quia quidem repudiandae, nulla adipisci est qui
        exercitationem unde doloremque nemo nihil inventore quasi, tempore error. Id harum ullam debitis officia,
        inventore amet saepe sapiente perferendis aut cum numquam totam.
      </h2>
      <h2 className={cx(s.text, "content__text")}>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quia quidem repudiandae, nulla adipisci est qui
        exercitationem unde doloremque nemo nihil inventore quasi, tempore error. Id harum ullam debitis officia,
        inventore amet saepe sapiente perferendis aut cum numquam totam.
      </h2>
    </div>
  )
}
