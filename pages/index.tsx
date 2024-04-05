import s from "@/pages/home/home.module.scss"

import { ScrollTrigger, gsap } from "@/lib/gsap"
import { useGSAP } from "@gsap/react"
import cx from "clsx"
import { useRef } from "react"

import g1 from "@/public/img/g-1.jpg"
import g2 from "@/public/img/g-2.jpg"
import g3 from "@/public/img/g-3.jpg"
import g4 from "@/public/img/g-4.jpg"
import g5 from "@/public/img/g-5.jpg"
import g6 from "@/public/img/g-6.jpg"

import { TitleReveal } from "@/components/animations/title-reveal"
import { Img } from "@/components/utility/img"
import { Video } from "@/components/utility/video"
import { DefaultLayout } from "@/layouts/default"
import Footer from "@/components/footer"

export default function Home() {
  const ref = useRef(null)

  console.log("RENDER HOME")

  useGSAP(
    () => {
      const tl = gsap.timeline({ paused: true }).to(
        ".title",
        {
          yPercent: -100,
        },
        "s"
      )

      ScrollTrigger.create({
        animation: tl,
        id: "title",
        markers: true,
        scrub: true,
        trigger: ".title",
        start: `top top+=${document.querySelector(".title")?.getBoundingClientRect().top}`,
      })
    },
    { scope: ref }
  )

  useGSAP(
    () => {
      const tl = gsap.timeline({ paused: true }).to(
        ".circleImg",
        {
          borderRadius: 0,
          scale: 2,
        },
        "s"
      )

      ScrollTrigger.create({
        animation: tl,
        id: "circle-img",
        markers: true,
        scrub: true,
        trigger: ".circleImgC",
        pin: true,
      })
    },
    { scope: ref }
  )

  useGSAP(
    () => {
      const tl = gsap
        .timeline({ paused: true })
        .to(
          ".cols-c",
          {
            scale: 4,
          },
          "s"
        )
        .from(
          ".t",
          {
            scale: 2,
          },
          "s"
        )
        .to(
          ".sliding-col",
          {
            yPercent: -25,
          },
          "s"
        )
        .to(
          ".overlay",
          {
            opacity: 0,
          },
          "s"
        )
        .to(
          ".img-c",
          {
            borderRadius: 0,
          },
          "s"
        )

      ScrollTrigger.create({
        animation: tl,
        id: "animated-grid",
        markers: false,
        pin: true,
        scrub: true,
        trigger: ".cols-c",
        start: "top top",
        end: "bottom+=8000px bottom",
      })
    },
    { scope: ref }
  )

  useGSAP(
    () => {
      const tl = gsap.timeline({ paused: true })

      tl.to(".text-c", {
        ease: "none",
        opacity: 0,
        scale: 0.8,
        yPercent: 50,
      })

      ScrollTrigger.create({
        animation: tl,
        id: "text",
        markers: false,
        scrub: true,
        trigger: ".text-c",
        start: "center center",
      })
    },
    { scope: ref }
  )

  useGSAP(
    () => {
      const tl = gsap.timeline({ paused: true })

      const cards: HTMLDivElement[] = gsap.utils.toArray(".card")

      tl.to(".text-c", {
        ease: "none",
        opacity: 0,
        scale: 0.8,
        yPercent: 30,
      })

      cards.forEach((card, i) => {
        tl.to(
          card,
          {
            ease: "none",
            scale: 1,
            y: 0,
            duration: 1 * i,
          },
          "s"
        ).to(
          i === cards.length - 1 ? null : card,
          {
            ease: "none",
            opacity: 0,
            scale: 0.8,
            yPercent: 30,
            delay: (0.1 + i) * 1,
          },
          "s"
        )
      })

      ScrollTrigger.create({
        animation: tl,
        id: "cards",
        markers: false,
        pin: true,
        scrub: true,
        trigger: ".cards",
        end: "+=8000px",
      })
    },
    { scope: ref }
  )

  return (
    <DefaultLayout
      seo={{
        title: "title",
        description: "description",
      }}
    >
      <div ref={ref}>
        <div
          className={cx(
            s.box,
            s.intro,
            "intro relative overflow-hidden bg-sky-500 z-50 flex items-center justify-center w-screen h-screen"
          )}
        >
          <span className={s.index}>1</span>
          <h1 className={cx(s.title, "title")}>
            <TitleReveal>JUST DESIGN FX</TitleReveal>
          </h1>
        </div>

        <div
          className={cx(
            s.box,
            "circleImgC relative overflow-hidden bg-sky-600 z-50 flex items-center justify-center w-screen h-screen"
          )}
        >
          <span className={s.index}>2</span>

          <div className={cx(s.circleImg, "circleImg")}>
            <Img alt="lol" src={g2} className="object-cover" />
          </div>
        </div>

        <div className={cx(s.box, s.colsC, "cols-c -translate-y-full mb-[-200vh] overflow-hidden w-screen h-screen")}>
          <div
            className={cx(
              "overlay absolute top-0 left-0 right-0 bottom-0 bg-noir mix-blend-color pointer-events-none z-[99999999]"
            )}
          ></div>
          <div
            className={cx(
              "overlay absolute top-0 left-0 right-0 bottom-0 bg-orange-600 mix-blend-multiply pointer-events-none z-[99999999]"
            )}
          ></div>
          <div className={cx(s.cols, "cols")}>
            <div className={cx(s.col, "sliding-col", "flex flex-col")}>
              <div className={cx(s.imgC, "img-c")}>
                <div className={cx(s.t, "t")}>
                  <Img src={g4} alt="sample" className="object-cover" />
                </div>
              </div>
              <div className={cx(s.imgC, "img-c")}>
                <div className={cx(s.t, "t")}>
                  <Img src={g5} alt="sample" className="object-cover" />
                </div>
              </div>
              <div className={cx(s.imgC, "img-c")}>
                <div className={cx(s.t, "t")}>
                  <Img src={g4} alt="sample" className="object-cover" />
                </div>
              </div>
            </div>

            <div className={cx(s.col, "flex flex-col")}>
              <div className={cx(s.imgC, "img-c")}>
                <div className={cx(s.t, "t")}>
                  <Img src={g2} alt="sample" className="object-cover" />
                </div>
              </div>
              <div className={cx(s.imgC, "img-c")}>
                <div className={cx(s.t, "t")}>
                  <Video src="/vid/sample.mov" />
                </div>
              </div>
              <div className={cx(s.imgC, "img-c")}>
                <div className={cx(s.t, "t")}>
                  <Img src={g1} alt="sample" className="object-cover" />
                </div>
              </div>
            </div>

            <div className={cx(s.col, "sliding-col", "flex flex-col")}>
              <div className={cx(s.imgC, "img-c")}>
                <div className={cx(s.t, "t")}>
                  <Img src={g3} alt="sample" className="object-cover" />
                </div>
              </div>
              <div className={cx(s.imgC, "img-c")}>
                <div className={cx(s.t, "t")}>
                  <Img src={g6} alt="sample" className="object-cover" />
                </div>
              </div>
              <div className={cx(s.imgC, "img-c")}>
                <div className={cx(s.t, "t")}>
                  <Img src={g3} alt="sample" className="object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={cx(s.box, "relative overflow-hidden bg-sky-700 z-50")}>
          <span className={s.index}>4</span>

          <div className={cx(s.cardsC, "cards-c")}>
            <div className={cx(s.textC, "flex items-center justify-center", "text-c")}>
              <h3 className={cx(s.text, "text-lime-300")}>An epic team for every vision</h3>
            </div>
            <div className={cx(s.cards, "cards")}>
              <div className={s.center}>
                <div className={cx(s.card, "card", "bg-lime-100")}>
                  <span>1</span>
                  <div className={cx(s.mediaC)}>
                    <Video src="/vid/sample.mov" />
                  </div>
                </div>
                <div className={cx(s.card, "card", "bg-lime-200")}>
                  <span>2</span>
                  <div className={cx(s.mediaC)}>
                    <Img alt="lol" src={g2} className="object-cover" height={1000} width={1000} />
                  </div>
                </div>
                <div className={cx(s.card, "card", "bg-lime-300")}>
                  <span>3</span>
                  <div className={cx(s.mediaC)}>
                    <Img alt="lol" src={g6} className="object-cover" height={1000} width={1000} />
                  </div>
                </div>
                <div className={cx(s.card, "card", "bg-lime-400")}>
                  <span>4</span>
                  <div className={cx(s.mediaC)}>
                    <Video src="/vid/sample.mov" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={cx(s.box, "relative overflow-hidden bg-sky-800 z-50 w-screen h-screen")}>
          <span className={s.index}>5</span>
        </div>
      </div>
      <Footer />
    </DefaultLayout>
  )
}
