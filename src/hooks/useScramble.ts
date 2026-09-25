import { useEffect, useState } from 'react'

const GLYPHS = '!<>-_\\/[]{}—=+*^?#$%&@01'

/**
 * Decode/scramble reveal: characters cycle through random glyphs and
 * settle left-to-right, like a classified line being decrypted.
 */
export function useScramble(text: string, active = true, speedMs = 26) {
  const [display, setDisplay] = useState(() => (active ? '' : text))

  useEffect(() => {
    if (!active) {
      setDisplay(text)
      return
    }
    let settled = 0
    setDisplay('')
    const id = setInterval(() => {
      settled += 0.6
      const out = text
        .split('')
        .map((ch, i) => {
          if (ch === ' ') return ' '
          if (i < settled) return ch
          return GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
        })
        .join('')
      setDisplay(out)
      if (settled >= text.length) {
        clearInterval(id)
        setDisplay(text)
      }
    }, speedMs)
    return () => clearInterval(id)
  }, [text, active, speedMs])

  return display
}
