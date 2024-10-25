export const sum = (...args: Array<number | undefined>) => {
  return args.reduce((pre, cur) => (pre || 0) + (cur || 0), 0)
}

export const reduce = (...args: Array<number | undefined>) => {
  const count = args.reduce((pre, cur) => (pre || 0) - (cur || 0), Number(args?.[0] || 0))
  return Number(count) + Number(args?.[0] || 0)
}

export function getTextWidth (text: string, fontSize: number): number {
  // 创建一个隐藏的 canvas 元素
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')

  if (context) {
    // 设置固定的字体样式
    context.font = `${fontSize}px Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'`
    // 测量文本的宽度
    const metrics = context.measureText(text)
    return metrics.width
  }

  return 0 // 如果无法创建 context，则返回 0
}
