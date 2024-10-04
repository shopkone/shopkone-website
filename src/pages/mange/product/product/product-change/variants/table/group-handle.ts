import { Option, Variant } from '@/pages/mange/product/product/product-change/variants/state'
import { genId } from '@/utils/random'

self.onmessage = (e) => {
  const { groupName, variants, options }: { groupName: string, variants: Variant[], options: Option[] } = e.data || {}
  // 如果没有设置分组名称，直接返回
  if (!groupName || !variants?.length || (options?.length < 2)) {
    self.postMessage(variants); return
  }
  // 获取分组的options
  const groupOption = options?.find(i => i.name === groupName)
  // 如果找不到该分组，直接返回
  if (!groupOption) {
    self.postMessage(variants); return
  }
  // 开始设置分组
  const groups: Variant[] = groupOption?.values?.filter(i => i.value)?.map(item => {
    let children = variants?.filter(variant => {
      return variant.name?.find(n => n.label === groupName && n.value === item.value)
    }).map(i => ({ ...i, parentId: 0 }))
    const id = (children?.reduce((acc, cur) => acc + cur.id, 0)) ? (children?.reduce((acc, cur) => acc + cur.id, 0)) + 10 : genId()
    children = children?.map(i => ({ ...i, parentId: id }))
    const hidden = children?.every(i => i.hidden)
    return { id, price: 0, weight_unit: 'g', children, parentId: 0, name: [{ label: groupName, value: item.value, id: 0 }], isParent: true, hidden }
  }).filter(i => i.children?.length) as any
  self.postMessage(groups)
}
