import { cloneElement, isValidElement, ReactElement, ReactNode } from 'react'

import { renderText } from '@/utils/render-text'

interface FormRenderProps {
  children?: ReactElement // 子元素应该是一个有效的 React 元素
  render?: (props: any) => ReactNode // render 函数返回任意 React 节点
  infoMode?: ReactNode
  [key: string]: any // 其他任何额外传递的 props
}

export default function FormRender (props: FormRenderProps) {
  const { children, infoMode, render, ...rest } = props

  // 优先使用 render prop 渲染
  if (infoMode && render) return renderText(render(rest?.value))

  // 如果 children 是一个有效的 React 元素，则进行克隆
  if (isValidElement(children)) {
    return cloneElement(children, rest)
  }

  // 如果 children 不是有效的 React 元素，返回 null 或者可以加个 fallback
  return null
}
