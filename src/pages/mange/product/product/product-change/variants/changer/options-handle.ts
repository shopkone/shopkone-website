import isEqual from 'lodash/isEqual'

import { Variant } from '@/pages/mange/product/product/product-change/variants/variant-table/index'
import { genId } from '@/utils/random'

interface Options {
  name: string
  values: Array<{ value: string, id: number }>
  id: number
}

interface Result {
  label: string
  value: string
  id: number
}

const combineOptions = function (options: Options[]): Result[][] {
  const chunks = options.map(option =>
    option.values.map(value => ({
      label: option.name,
      value: value.value,
      id: value.id
    }))
  )

  const res: Result[][] = []

  const helper = function (chunkIndex: number, prev: Result[]): void {
    if (chunkIndex >= chunks.length) return // 确保 chunkIndex 不越界
    const chunk = chunks[chunkIndex] // 获取当前的 chunk 数组
    const isLast = chunkIndex === chunks.length - 1

    for (const val of chunk) {
      const cur = prev.concat(val)
      if (isLast) {
        res.push(cur)
      } else {
        helper(chunkIndex + 1, cur) // 递归处理下一个 chunk
      }
    }
  }

  helper(0, [])
  return res
}

self.onmessage = (e) => {
  const { options, variants }: { options: Options[], variants: Variant[] } = e.data || {}
  const v: Variant[] = []
  variants.forEach(item => {
    if (item.children) {
      v.push(...item.children)
    } else {
      v.push(item)
    }
  })
  let data = options?.filter(item => item.name)
  data = data.map(item => ({ ...item, values: item.values.filter(item => item.value) }))
  const list = combineOptions(data).filter(item => item.length)
  let result: Variant[] = list?.map(variant => {
    return { name: variant, id: genId(), weight_uint: 'g', price: 0, parentId: 0, isParent: false, inventories: [] }
  })
  result = result.map(item => {
    const temp = v.find(variant => {
      const itemNames = item.name.map(i => ({ ...i, id: 0 }))
      const variantNames = variant.name.map(i => ({ ...i, id: 0 }))
      return isEqual(itemNames, variantNames)
    })
    if (temp) return temp
    return item
  })
  self.postMessage(result)
}
