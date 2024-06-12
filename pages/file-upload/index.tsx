import s from "./file-upload.module.scss"

import { DefaultLayout } from "@/layouts/default"

import cx from "clsx"

export interface FileUploadProps {}

export default function FileUpload() {
  function onChange(e: Event) {
    const input = e.target as HTMLInputElement

    if (!input.files?.length) {
      return
    }

    console.log(input.files[0])
  }

  return (
    <DefaultLayout
      seo={{
        title: "title",
        description: "description",
      }}
    >
      <div className={cx("m-5 flex items-center justify-center w-screen h-screen")}>
        <div className={cx(s.field, "flex items-center justify-center")}>
          <span className={cx(s.text, "z-10")}>CLICK AND SELECT OR DROP FILES HERE</span>
          <input className={cx(s.input, "z-0")} type="file" onChange={onChange} />
        </div>
      </div>
    </DefaultLayout>
  )
}
