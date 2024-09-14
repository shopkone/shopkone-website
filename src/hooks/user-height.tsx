import { RefObject, useEffect, useState } from 'react'

export const useHeight = (ref: RefObject<HTMLElement | null>) => {
  const [height, setHeight] = useState(0)
  useEffect(() => {
    if (!ref.current) return
    const resize = () => {
      if (!ref.current) return
      const top = ref.current.getBoundingClientRect().top
      setHeight(document.body.clientHeight - top)
    }
    resize()
    window.addEventListener('resize', resize)
    return () => {
      window.removeEventListener('resize', resize)
    }
  }, [ref])
  return [height]
}
