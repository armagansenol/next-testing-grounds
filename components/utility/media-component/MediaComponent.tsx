import { Img } from "@/components/utility/img"
import { Video } from "@/components/utility/video"
import { Media } from "@/types"

interface MediaComponentProps {
  media: Media
  priority?: boolean
}

export default function MediaComponent(props: MediaComponentProps) {
  const { media, priority = false } = props

  const mediaComponents = {
    image: (
      <Img
        alt="Slider Content Visual"
        className="object-cover"
        src={media.src}
        priority={priority}
        height={media.height ?? 1000}
        width={media.width ?? 1000}
      />
    ),
    video: <Video className="object-cover" src={media.src} />,
  }

  return mediaComponents[media.type]
}
