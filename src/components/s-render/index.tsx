export interface SRenderProps {
  children?: React.ReactNode
  render?: any
  style?: React.CSSProperties
  className?: string
}

export default function SRender (props: SRenderProps) {
  const { render, children, className, style } = props
  if ((className || style) && render) {
    return <div style={style} className={className}>{children}</div>
  }
  if (render) return children
  return null
}
