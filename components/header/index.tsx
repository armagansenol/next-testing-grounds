import s from "./header.module.scss"

import cx from "clsx"

import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Link } from "@/components/utility/link"

export default function Header() {
  const links = [
    { value: "/", label: "home" },
    { value: "/form-test", label: "form test" },
    { value: "/matter-js", label: "matter.js" },
    { value: "/matter-js-2", label: "matter.js 2" },
    { value: "/matter-js-4", label: "matter.js 4" },
    { value: "/splitting-js", label: "splitting.js" },
    { value: "/react-split-text", label: "react split text" },
    { value: "/tiptap-test", label: "tiptap" },
    { value: "/gltfjsx-model-test", label: "gltfjsx" },
    { value: "/model-pop", label: "model pop" },
    { value: "/three-slider", label: "three slider" },
    { value: "/shader-transitions", label: "shader transitions" },
    { value: "/transmission-effect", label: "transmission effect" },
    { value: "/pop-slider", label: "pop slider" },
    { value: "/uniform-lerp", label: "uniform lerp" },
  ]

  return (
    <header className={cx(s.header, "fixed bottom-5 left-5")}>
      <Popover>
        <PopoverTrigger className={cx("dark", s.popoverTrigger)} asChild>
          <Button className="dark" variant="secondary">
            <span>DEMOS</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className={cx("dark", s.popoverContent)}>
          <div className="flex flex-col">
            {links.map((item, i) => {
              return (
                <Link className="p-2" href={item.value} key={i}>
                  {item.label}
                </Link>
              )
            })}
          </div>
        </PopoverContent>
      </Popover>
    </header>
  )
}
