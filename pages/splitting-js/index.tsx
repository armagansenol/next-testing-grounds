import dynamic from "next/dynamic"

const SplittingJsTest = dynamic(() => import("@/components/splitting-js-test"), { ssr: false })

export interface SplittingJsProps {}

export default function SplittingJs(props: SplittingJsProps) {
  return (
    <div>
      <SplittingJsTest />
    </div>
  )
}
