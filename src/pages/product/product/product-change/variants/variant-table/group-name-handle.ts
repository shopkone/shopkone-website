import { Options } from '@/pages/product/product/product-change/variants/variant-changer'
import { Variant } from '@/pages/product/product/product-change/variants/variant-table/index'
import { genId } from '@/utils/random'

self.onmessage = (e) => {
  const { groupName, variants, options }: { groupName: string, variants: Variant[], options: Options[] } = e.data || {}
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
    const children = variants?.filter(variant => {
      return variant.name?.find(n => n.label === groupName && n.value === item.value)
    }).map(item => ({ ...item, parentId: item.id }))
    return { id: genId(), price: 0, weight_uint: 'g', children, parentId: item.id, name: [{ label: groupName, value: item.value, id: 0 }], isParent: true }
  }).filter(i => i.children?.length) as any
  self.postMessage(groups)
}
