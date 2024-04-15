import s from "./dropdown.module.scss"

import cx from "clsx"
import { useRef, useState } from "react"
import { useOnClickOutside } from "usehooks-ts"

import { truncateString } from "@/lib/utils"

interface Option {
  id?: string
  title: string
}

interface Props {
  options: Option[]
  defaultValue: Option
  onChange: any
  label?: string
  selectedOption?: Option | null
}

const Dropdown = ({ options, onChange, label, defaultValue, selectedOption = defaultValue }: Props) => {
  const ref = useRef(null)
  const optionsRef = useRef(null)

  const [isOpen, setOpen] = useState(false)

  const handleClickOutside = () => {
    if (isOpen) setOpen(false)
  }

  useOnClickOutside(ref, handleClickOutside)

  return (
    <div className={s.select} onClick={() => setOpen(!isOpen)} ref={ref}>
      {label ||
        (defaultValue && (
          <div className={cx(s.selectTrigger, "flex items-center justify-start cursor-pointer")}>
            {truncateString(`${selectedOption ? selectedOption.title.replace("<br> ", "") : label}`, 26)}
          </div>
        ))}
      {isOpen && (
        <ul className={cx(s.options, "cursor-pointer", { [s.option]: isOpen })} ref={optionsRef}>
          <li
            className={cx(s.option)}
            key={defaultValue.id}
            onClick={() => {
              setOpen(false)
              onChange(defaultValue.id)
            }}
          >
            {defaultValue.title}
          </li>
          {options.map((option: Option) => (
            <li
              className={cx(s.option)}
              key={option.id}
              onClick={() => {
                setOpen(false)
                onChange(option.id)
              }}
            >
              {option.title.replace("<br> ", "")}
            </li>
          ))}
        </ul>
      )}
      <div className={s.iconC}></div>
    </div>
  )
}

export default Dropdown
