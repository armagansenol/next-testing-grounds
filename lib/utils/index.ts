import { type ClassValue, clsx } from "clsx"
import { MouseEvent } from "react"
import { twMerge } from "tailwind-merge"
import { Vector3, Vector4 } from "three"

export const breakpoints = {
  mobile: 800,
  tablet: 1024,
}

export function lineBreak(text: string) {
  return text.replace("<br>", "\n")
}

export function truncateString(str: string, num: number) {
  if (str.length <= num) {
    return str
  }
  return str.slice(0, num) + "..."
}

export function capitalize(sentence: string): string {
  const words: string[] = sentence.split(" ")
  const capitalizedWords: string[] = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
  const result: string = capitalizedWords.join(" ")
  return result
}

export function shareOnSocialMedia(baseUrl: string) {
  const title = document.title
  const text = "Check this out!"
  const url = window.location.href

  const copyContent = async () => {
    try {
      await navigator.clipboard.writeText(`${baseUrl}${location.pathname}`)
      console.log("Content copied to clipboard", `${baseUrl}${location.pathname}`)
    } catch (err) {
      console.error("Failed to copy: ", err)
    }
  }

  if (navigator.share !== undefined) {
    navigator
      .share({
        title,
        text,
        url,
      })
      .then(() => console.log("Shared!"))
      .catch((err) => console.error(err))
  } else {
    // window.location.href = `mailto:?subject=${title}&body=${text}%0A${url}`
    copyContent()
  }
}

export function isEven(num: number) {
  if (num === 0) {
    return true
  }

  if (num % 2 === 0) {
    return true
  }

  return false
}

export function stopPropagation(e: MouseEvent) {
  e.stopPropagation()
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function convertHexToGLSLRGBA(hex: string) {
  var r = parseInt(hex.substring(1, 3), 16) / 255.0
  var g = parseInt(hex.substring(3, 5), 16) / 255.0
  var b = parseInt(hex.substring(5, 7), 16) / 255.0
  return new Vector4(r, g, b, 1)
}

export function convertHexToGLSLRGB(hex: string) {
  var r = parseInt(hex.substring(1, 3), 16) / 255.0
  var g = parseInt(hex.substring(3, 5), 16) / 255.0
  var b = parseInt(hex.substring(5, 7), 16) / 255.0
  return new Vector3(r, g, b)
}
