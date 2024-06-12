import * as React from "react"
import s from "./react-split-text.module.scss"
import { useGSAP } from "@gsap/react"
import cx from "clsx"

export interface ReactSplitTextProps {}

export default function ReactSplitText(props: ReactSplitTextProps) {
  const textEl = (
    <div>
      Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quibusdam suscipit cupiditate commodi amet excepturi
      saepe minima laborum. Delectus, totam velit?
    </div>
  )

  const splitText = (el: React.JSX.Element) => {
    const text = `${textEl.props.children}`

    const lines = text.split("\n")
    let charIndex = 0

    return lines.map((line, lineIndex) => (
      <div key={`line-${lineIndex}`} className={`line line-${lineIndex}`}>
        {line.split(/(\s+)/).map((wordOrSpace, wordIndex) =>
          wordOrSpace.match(/\s+/) ? (
            <span
              key={`space-${lineIndex}-${wordIndex}`}
              className={`char char-${charIndex++} word-${wordIndex} line-${lineIndex}`}
            >
              {wordOrSpace}
            </span>
          ) : (
            wordOrSpace.split("").map((char, charIdx) => (
              <span
                key={`char-${lineIndex}-${wordIndex}-${charIdx}`}
                className={`char char-${charIndex++} word-${wordIndex} line-${lineIndex}`}
              >
                {char}
              </span>
            ))
          )
        )}
      </div>
    ))
  }
  const testRef = React.useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const lines = testRef?.current?.innerText.split(/\r?\n|\r|\n/g)
    console.log(lines)
  }, [])

  return (
    <div className={s.wrapper}>
      <div className={s.reactSplitText}>{splitText(textEl)}</div>
      <div className={cx(s.test, "test")} ref={testRef}>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quibusdam suscipit cupiditate{"\n"} commodi amet
        excepturi saepe minima laborum. Delectus, totam velit?
      </div>
    </div>
  )
}
