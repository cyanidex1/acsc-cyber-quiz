import { useEffect, useState } from 'react'

/**
 * Types text character-by-character with a mechanical steps() cadence,
 * like a terminal printing a status line. Returns the visible slice and
 * whether typing has finished.
 */
export function useTypewriter(text: string, speedMs = 34, startDelay = 250) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    setCount(0)
    let interval: ReturnType<typeof setInterval> | null = null
    const boot = setTimeout(() => {
      interval = setInterval(() => {
        setCount((c) => {
          if (c >= text.length) {
            if (interval) clearInterval(interval)
            return c
          }
          return c + 1
        })
      }, speedMs)
    }, startDelay)
    return () => {
      clearTimeout(boot)
      if (interval) clearInterval(interval)
    }
  }, [text, speedMs, startDelay])

  return { typed: text.slice(0, count), done: count >= text.length }
}
