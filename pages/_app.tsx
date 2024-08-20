import type { AppProps } from "next/app"
import "../styles/global.css"
import "../styles/global.scss"

import Header from "@/components/header"
import { SmoothLayout } from "@/layouts/smooth"

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SmoothLayout>
      <Header />
      <Component {...pageProps} />
    </SmoothLayout>
  )
}
