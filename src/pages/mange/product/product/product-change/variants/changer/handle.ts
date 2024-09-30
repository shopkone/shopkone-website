import { Option, Variant } from '@/pages/mange/product/product/product-change/variants/state'
import { genId } from '@/utils/random'

interface Result {
  label: string
  value: string
  id: number
}

const combineOptions = function (options: Option[]): Result[][] {
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
  const { options, variants }: { options: Option[], variants: Variant[] } = e.data || {}
  let data = options?.filter(item => item.name)
  data = data.map(item => ({ ...item, values: item.values.filter(item => item.value) }))
  const list = combineOptions(data).filter(item => item.length)
  let result: Variant[] = list?.map(variant => {
    return { name: variant, id: genId(), weight_uint: 'g', price: 0, parentId: 0, isParent: false, inventories: [] }
  })
  result = result.map(item => {
    const variant = variants.find(v => {
      const vName = v.name.map(i => `${i.label}_${i.value}`).join('_')
      const iName = item.name.map(i => `${i.label}_${i.value}`).join('_')
      return vName === iName
    })
    if (variant) return { ...variant, name: item.name }
    return item
  })
  self.postMessage(result)
}
