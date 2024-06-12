import s from "./slider.module.scss"

import MainSlider from "@/components/main-slider"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/utility/accordion/Accordion"

export default function Slider() {
  const items = [
    {
      trigger: <>Trigger</>,
      content: <>Content</>,
    },
    {
      trigger: <>Trigger-2</>,
      content: <>Content-2</>,
    },
  ]

  return (
    <div>
      <MainSlider />
      <div className={s.accordionC}>
        <Accordion className={s.accordion} type="multiple" defaultValue={[`${0}`]}>
          {items.map((item, i) => {
            return (
              <AccordionItem className={s.accordionItem} value={`${i}`} key={i}>
                <AccordionTrigger className={s.accordionTrigger}>{item.trigger}</AccordionTrigger>
                <AccordionContent className={s.accordionContent}>{item.content}</AccordionContent>
              </AccordionItem>
            )
          })}
        </Accordion>
      </div>
    </div>
  )
}
