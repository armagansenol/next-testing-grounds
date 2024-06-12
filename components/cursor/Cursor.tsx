import s from "./cursor.module.scss"

import useMousePosition from "@/hooks/use-mouse-position"
import { gsap } from "@/lib/gsap"
import { useGSAP } from "@gsap/react"
import cx from "clsx"
import { useRef, useState } from "react"
import { useIsomorphicLayoutEffect } from "usehooks-ts"

import { MediaComponent } from "@/components/utility/media-component"
import { useCursorStore } from "@/lib/store/cursor"
import { useLenisStore } from "@/lib/store/lenis"
import { CursorType } from "@/types"

const Cursor = () => {
  const ref = useRef(null)
  const { type, toggleVisibility, media, visible, reset } = useCursorStore()
  const mouse = useMousePosition()
  const { lenis } = useLenisStore()

  const [active, setActive] = useState(false)
  const [cursorUi, setCursorUi] = useState<CursorType>(CursorType.default)
  const [mediaUi, setMediaUi] = useState(media)

  // visibility
  useIsomorphicLayoutEffect(() => {
    const handleMouseEnter = () => {
      if (!visible) toggleVisibility()
    }

    const handleMouseLeave = () => {
      if (visible) toggleVisibility()
    }

    document.body.addEventListener("mouseenter", handleMouseEnter)
    document.body.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      document.body.removeEventListener("mouseenter", handleMouseEnter)
      document.body.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [visible])

  // motion
  useGSAP(
    () => {
      if (active) {
        const quickX = gsap.quickTo(ref.current, "x", { duration: 0.1, ease: "power3" })
        const quickY = gsap.quickTo(ref.current, "y", { duration: 0.1, ease: "power3" })

        quickX(mouse.x ?? 0)
        quickY(mouse.y ?? 0)

        return
      }

      if (mouse.x !== null && mouse.y !== null) {
        setActive(true)

        gsap.set(ref.current, {
          x: mouse.x ?? 0,
          y: mouse.y ?? 0,
          onComplete: () => {
            if (!visible) toggleVisibility()
          },
        })
      }
    },
    {
      dependencies: [mouse, active],
    }
  )

  // type
  useGSAP(
    () => {
      setCursorUi(type)
    },
    {
      scope: ref,
      dependencies: [type],
    }
  )

  // text animation
  useGSAP(
    () => {
      gsap.to(".text", {
        opacity: type === "click" || type === "media" ? 1 : 0,
        duration: 0.2,
      })
    },
    {
      scope: ref,
      dependencies: [type],
    }
  )

  // media
  useGSAP(
    () => {
      setMediaUi(media)
    },
    {
      scope: ref,
      dependencies: [media],
    }
  )

  // reset on scroll
  useIsomorphicLayoutEffect(() => {
    if (type === "default") {
      return
    }

    lenis?.on("scroll", () => {
      reset()
    })
  }, [lenis, type])

  return (
    <div
      className={cx(s.cursor, {
        [s.visible]: visible,
      })}
      ref={ref}
    >
      <div className={cx(s.c, "c", "flex items-center", [s[cursorUi]])}>
        {type === "media" && (
          <div className={cx(s.mediaC, "media-c")}>{mediaUi && <MediaComponent media={mediaUi} />}</div>
        )}
        <span className={cx(s.text, "text", { [s.active]: cursorUi === "click" || cursorUi === "media" })}>
          Click to view
        </span>
      </div>
    </div>
  )
}

export default Cursor
