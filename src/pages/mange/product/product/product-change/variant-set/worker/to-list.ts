import { genVariant } from '@/pages/mange/product/product/product-change/variant-set/worker/gen-variant'
import { VariantName } from '@/pages/mange/product/product/product-change/variants/state'
import { genId } from '@/utils/random'

self.onmessage = e => {
  const data = e.data
  const result = generateVariants(data)
  const variants = result.map(item => {
    const name: VariantName[] = []
    Object.keys(item).forEach(key => {
      name.push({ label: key, value: item[key], id: genId() })
    })
    return genVariant(name)
  })
  self.postMessage({ variants, options: data })
}

function generateVariants (options: Array<{ label: string, values: string[] }>): any[] {
  const filteredOptions = options.map(opt => ({
    label: opt.label,
    values: opt.values.filter(value => value !== '')
  }))

  const combinations: any[] = []

  function combine (current: any, index: number) {
    if (index === filteredOptions.length) {
      combinations.push({ ...current })
      return
    }
    for (const value of filteredOptions[index].values) {
      current[filteredOptions[index].label] = value
      combine(current, index + 1)
    }
  }
  combine({}, 0)
  return combinations
}
