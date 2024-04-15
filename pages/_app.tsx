import type { AppProps } from "next/app"
import "../styles/global.scss"

import { SmoothLayout } from "@/layouts/smooth"
import { ClientOnly } from "@/components/utility/isomorphic"
import Cursor from "@/components/cursor/Cursor"
import Header from "@/components/header"

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SmoothLayout>
      <Header />
      <Component {...pageProps} />
      <ClientOnly>
        <Cursor />
      </ClientOnly>
    </SmoothLayout>
  )
}
