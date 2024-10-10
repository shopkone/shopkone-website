import { ReactNode } from 'react'

export const renderText = (text?: ReactNode) => {
  if (text) return text
  return <span style={{ color: '#aaa' }}>--</span>
}
