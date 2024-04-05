import { CursorType, Media } from "@/types"
import { create } from "zustand"

interface State {
  type: CursorType
  visible: boolean
  toggleVisibility: () => void
  setCursor: (type: CursorType) => void
  events: any
  media: Media | null
  setMedia: (type: Media | null) => void
  reset: () => void
}

const useStore = create<State>((set, get) => ({
  type: CursorType.default,
  visible: false,
  media: null,
  setMedia: (media) => set({ media }),
  toggleVisibility: () => set({ visible: !get().visible }),
  setCursor: (type) => set({ type }),
  reset: () => {
    get().setCursor(CursorType.default)
    if (get().media !== null) get().setMedia(null)
  },
  events: {
    cursorClick: {
      onMouseEnter: () => get().setCursor(CursorType.media),
      onMouseLeave: () => get().reset(),
    },
    cursorHide: {
      onMouseEnter: () => get().setCursor(CursorType.hide),
      onMouseLeave: () => get().reset(),
    },
    cursorMedia: (media: Media) => {
      return {
        onMouseMove: () => {
          if (get().type === "media") {
            return
          }

          get().setMedia(media)
          get().setCursor(CursorType.media)
        },
        onMouseOut: () => {
          get().reset()
        },
      }
    },
  },
}))

export const useCursorStore = useStore
