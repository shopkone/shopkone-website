import { VariantName } from '@/pages/mange/product/product/product-change/variant-set/state'
import { OptionValue } from '@/pages/mange/product/product/product-change/variant-set/variant-options/option-item'
import { genVariant } from '@/pages/mange/product/product/product-change/variant-set/worker/gen-variant'
import { genId } from '@/utils/random'

self.onmessage = e => {
  const { options, variants: oldVariants = [] } = e.data
  const result = generateVariants(options)
  let variants = result.map(item => {
    const name: VariantName[] = []
    Object.keys(item).forEach(key => {
      name.push({ label: key, value: ((item as unknown as any)[key])?.value || '', id: genId() })
    })
    return genVariant(name)
  })
  variants = variants.map((item: any) => {
    const oldVariant = oldVariants.find((oldVariant: any) => {
      const oldName = oldVariant.name.map((name: any) => name.value).join('-')
      const newName = item.name.map((name: any) => name.value).join('-')
      return oldName === newName
    })
    if (oldVariant) return oldVariant
    return item
  })
  self.postMessage({ variants, options })
}

function generateVariants (options: Array<{ label: string, values: string[] }>): OptionValue[] {
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
