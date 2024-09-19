import { useRequest } from 'ahooks'
import cloneDeep from 'lodash/cloneDeep'

import { http } from '@/http/http'

export interface CategoryItem {
  value: number
  label: string
  en_label: string
  pid: number
  deep: number
}
export interface CategoryTree {
  value: number
  label: string
  en_label: string
  children: CategoryTree[]
}

export const formatFlagToTree = (baseArr: CategoryItem[], parentId: number): CategoryTree[] => {
  const map = baseArr.reduce((prev, cur) => {
    // @ts-expect-error
    prev[cur.value] = cur
    return prev
  }, {})
  const result = []
  for (let i = 0; i < baseArr.length; i++) {
    const item = baseArr[i]
    if (item.pid === parentId) {
      result.push(item)
      continue
    }
    // @ts-expect-error
    const parent = map[item.pid]
    if (parent) {
      parent.children = parent.children || []
      parent.children.push(item)
    }
  }
  return result as unknown as CategoryTree[]
}

const fetchCategoryItemsApi = async () => {
  return await http<CategoryItem[]>('/base/categories')
}

export const useCategories = () => {
  const ret = useRequest(fetchCategoryItemsApi, { cacheKey: 'CATEGORY_ITEMS', staleTime: -1 })
  return { ...ret, data: cloneDeep(ret.data) }
}
