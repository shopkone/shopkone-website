import { useRequest } from 'ahooks'

import { api } from '@/api/api'

interface TreeItem {
  label: string
  value: number
  pid: number
  children?: TreeItem[]
}

export interface CategoriesRes {
  label: string
  value: number
  deep: number
  pid: number
}

function convertToTree (categories: CategoriesRes[]): TreeItem[] {
  const map: Record<number, TreeItem> = {}
  const tree: TreeItem[] = []

  // 创建一个映射，以便快速访问每个项目
  categories.forEach(category => {
    map[category.value] = { label: category.label, value: category.value, pid: category.pid, children: [] }
  })

  // 构建树形结构
  categories.forEach(category => {
    if (category.pid === 0) {
      // 如果是根节点，添加到树中
      tree.push(map[category.value])
    } else {
      // 否则，将其添加到其父节点的 children 中
      const parent = map[category.pid]
      if (parent) {
        // 确保 children 属性存在
        if (!parent.children) {
          parent.children = [] // 初始化 children
        }
        parent.children.push(map[category.value])
      }
    }
  })

  return tree
}

const CategoriesApi = async () => await api<CategoriesRes[]>('/base/category-list')

export const useCategories = () => {
  const { data } = useRequest(CategoriesApi, { staleTime: -1, cacheKey: 'CATEGORIES' })
  return { data: data || [] }
}
