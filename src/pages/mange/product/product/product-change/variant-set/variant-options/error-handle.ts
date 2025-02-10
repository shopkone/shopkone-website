import { TFunction } from 'i18next'

import { OptionValue } from '@/pages/mange/product/product/product-change/variant-set/variant-options/option-item'

export interface ErrorObj {
  id: number
  msg: string
  isLabel: boolean
}

export const getOptionErrors = (options: OptionValue[], t: TFunction<string, string>) => {
  const errList: ErrorObj[] = []

  options.forEach(option => {
    // 1. 校验 label 名称是否为空
    if (!option.label) {
      const err = { id: option.id, msg: t('请输入选项名称'), isLabel: true }
      errList.push(err)
    }

    // 2. 校验 label 名称是否重复
    if (repeat(options.map(i => i.label), option.label)) {
      const err = { id: option.id, msg: t('选项名称不能重复'), isLabel: true }
      errList.push(err)
    }

    option.values.forEach((value, index) => {
      const lastValue = option.values[index - 1]
      if (lastValue) return

      // 3. 校验 value 是否为空，最后一个不需要监测
      if (!value.value) {
        const err = { id: value.id, msg: t('请输入选项值'), isLabel: false }
        errList.push(err)
      }

      // 4. 校验 value 是否重复
      if (repeat(option.values.map(i => i.value), value.value)) {
        const err = { id: value.id, msg: t('选项值不能重复'), isLabel: false }
        errList.push(err)
      }
    })
  })

  return errList
}

export const repeat = (arr: string[], repeatStr: string): boolean => {
  let count = 0
  for (const str of arr) {
    if (str === repeatStr) {
      count++
      if (count > 1) {
        return true
      }
    }
  }
  return false
}
