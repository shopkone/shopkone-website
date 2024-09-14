import { Variant } from '@/pages/product/product/product-change/variants/state'
import { genId } from '@/utils/random'

self.onmessage = (e) => {
  const {
    groupName,
    variants
  }: {
    groupName: string
    variants: Variant[]
  } = e.data || {}
  if (!groupName) {
    self.postMessage(variants)
    return
  }
  if (!groupName || !variants?.length) {
    self.postMessage(variants)
    return
  }
  let result: Variant[] = []
  variants?.forEach(item => {
    // 取出 groupLabel
    const groupLabel = item.name?.find(i => i.label === groupName)
    if (!groupLabel) {
      self.postMessage(variants)
      return
    }
    // 是否存在
    let find = result?.find(i => {
      return i.name[0].value === groupLabel.value && i.name[0].label === groupLabel.label
    })
    if (!find) {
      const newItem: Variant = {
        isParent: true,
        name: [groupLabel],
        price: 0,
        weight_uint: 'g',
        id: genId(),
        children: []
      }
      result.push(newItem)
      find = result?.find(i => {
        return i.name[0].value === groupLabel.value && i.name[0].label === groupLabel.label
      })
    }
    if (find?.children) {
      const noGroupNames = item.name?.filter(i => (i.label !== groupName))
      if (!noGroupNames?.length) {
        self.postMessage(variants)
        return
      }
      const newItem: Variant = {
        ...item,
        isChild: true,
        name: noGroupNames
      }
      find.children.push(newItem)
    }
  })
  result = result.map(item => {
    let id = 0
    item?.children?.forEach(i => {
      id += i.id
    })
    return {
      ...item,
      id: id || item.id
    }
  })
  self.postMessage(result)
}
