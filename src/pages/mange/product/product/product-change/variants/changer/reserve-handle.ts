import { Option } from '@/pages/mange/product/product/product-change/variants/changer/index'
import { Variant } from '@/pages/mange/product/product/product-change/variants/variant-table'
import { genId } from '@/utils/random'

self.onmessage = (e) => {
  const { variants }: { variants: Variant[] } = e.data || {}
  const list: Variant[] = []
  variants.forEach(item => {
    if (item.children) {
      list.push(...item.children)
    } else {
      list.push(item)
    }
  })
  const options: Option[] = []
  list.forEach(item => {
    item.name.forEach(name => {
      let option: Option | undefined = options.find(item => item.name === name.label)
      if (!option) {
        option = { name: name.label, values: [], id: genId(), isDone: false }
        options.push(option)
      }
      option.values.push({ value: name.value, id: genId() })
    })
  })
  const newOptions = options.map(item => ({
    ...item,
    values: [...new Set([...item.values, { id: genId(), value: '' }].map(i => i.value))].map(i => ({ id: genId(), value: i }))
  }))
  self.postMessage(newOptions)
}
