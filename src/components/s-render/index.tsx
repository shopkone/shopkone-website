export interface SRenderProps {
  children?: React.ReactNode
  render?: any
  style?: React.CSSProperties
  className?: string
  onClick?: () => void
}

export default function SRender (props: SRenderProps) {
  const { render, children, className, style, onClick } = props
  if ((className || style || onClick) && render) {
    return <div onClick={onClick} style={style} className={className}>{children}</div>
  }
  if (render) return children
  return null
}
