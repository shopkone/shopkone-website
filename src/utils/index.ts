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

export const getUrl = (p: string, query?: Record<string, string>) => {
  const params = p[0] === '/' ? p.slice(1) : p
  // 1. 获取当前页面的query对象
  const queryString = window.location.search
  const queryParams = new URLSearchParams(queryString)
  // 2. 添加query
  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      queryParams.set(key, value)
    })
  }
  // 3. 转换为字符串query
  const newQueryString = queryParams.toString()
  // 4. 获取路劲
  const pathArr = window.location.pathname.split('/').filter((_, i) => i < 2)
  return `${pathArr.join('/')}/${params}?${newQueryString}`
}
