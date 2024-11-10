import { NavigateOptions, useLocation, useNavigate } from 'react-router-dom'

export interface NavOptions extends NavigateOptions {
  title?: string
}

export const useNav = () => {
  const path = useLocation().pathname
  const nav = useNavigate()

  return (to: string, options?: NavOptions) => {
    const { title, ...rest } = options || {}

    if (title) {
      // 创建查询参数
      const query = new URLSearchParams({
        pageBack: JSON.stringify({ title, url: path })
      })
      // 确保 `to` 中原本的查询参数不会丢失
      const [basePath, existingQuery] = to.split('?')
      const combinedQuery = new URLSearchParams(existingQuery)
      query.forEach((value, key) => { combinedQuery.set(key, value) })
      // 重新组装路径
      to = `${basePath}?${combinedQuery.toString()}`
    }
    nav(to, rest)
  }
}
