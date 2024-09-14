import { Options } from '@/pages/product/product/product-change/variants/variant-changer/index'

export interface ErrorResult {
  nameError: Array<{ id: number, message: string }>
  valueError: Array<{ nameId: number, id: number, message: string }>
  noError: boolean
}

export const errorCheck = (options: Options[]): ErrorResult => {
  const result: ErrorResult = { nameError: [], valueError: [], noError: false }
  const allNames = options.map(i => i.name)
  options?.forEach(option => {
    // 验证名称是否重复
    if (allNames.filter(name => option.name === name).length > 1) {
      result.nameError.push({ id: option.id, message: 'Name is duplicated' })
    }
    // 验证名称是否为空
    if (!option.name) {
      result.nameError.push({ id: option.id, message: 'Name is required' })
    }
    // 开始验证值
    const valuesNames = option.values?.map(i => i.value)
    option.values?.forEach((value, index) => {
      // 不验证最后一个
      if (index === option.values.length - 1) return
      // 验证值是否为空
      if (!value.value) {
        result.valueError.push({ nameId: option.id, id: value.id, message: 'Value is required' })
      }
      // 验证值是否重复
      if (valuesNames.filter(name => value.value === name).length > 1) {
        result.valueError.push({ nameId: option.id, id: value.id, message: 'Value is duplicated' })
      }
    })
  })
  result.noError = !result.nameError.length && !result.valueError.length
  return result
}
