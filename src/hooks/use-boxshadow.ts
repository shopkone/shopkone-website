import { RefObject } from 'react'
import { useInViewport } from 'ahooks'

export default function useBoxShadow (ref: RefObject<HTMLElement | null>) {
  const [inViewport] = useInViewport(ref)

  return { boxShadow: !inViewport ? '0 4px 4px 0 rgba(0, 0, 0, 0.1)' : '' }
}
