import { memo, useEffect, useMemo, useState } from 'react'
import { useMemoizedFn } from 'ahooks'
import { Input, InputProps } from 'antd'

import { useCurrencyList } from '@/api/base/currency-list'
import { useManageState } from '@/pages/mange/state'
import { roundPrice } from '@/utils/num'

export interface SInputNumberProps extends Omit<InputProps, 'onChange' | 'value'> {
  value?: number
  onChange?: (value?: number) => void

  // 对数字进行控制
  max?: number
  min?: number
  debounce?: boolean
  money?: boolean
  uint?: boolean// 是否正整数
  precision?: number // 小数精度
  required?: boolean
}

function SInputNumber (props: SInputNumberProps) {
  const {
    value,
    onChange,
    max = 9999999999,
    min = 0,
    uint,
    money,
    precision = money ? 2 : 10,
    required,
    ...rest
  } = props
  const store_currency_code = useManageState(state => state.shopInfo?.store_currency)
  const currencies = useCurrencyList()
  const currency = currencies?.data?.find(c => c.code === store_currency_code)
  const [focus, setFocus] = useState(false)

  const [num, setNum] = useState<string>()

  const formatNum = (num?: number) => {
    if (typeof num !== 'number') return num
    if (!money) return num
    return num * 100
  }

  const formatStr = (str?: string) => {
    if (typeof str === 'undefined') return str
    if (!/^-?\d+(\.\d+)?$/.test(str)) return str
    if (!money) return str
    return (Number(str) * 100).toString()
  }

  const onChangeHandle: InputProps['onChange'] = useMemoizedFn((e) => {
    let str = e.target.value
    const reg = new RegExp(`^[0-9]+(\\.[0-9]{0,${precision}})?$`)
    if (str && !reg.test(str)) {
      if (!reg.test(str[0])) {
        setNum('')
      }
      return
    }
    const num = str ? roundPrice(Number(str)) : undefined
    if (uint && str?.includes('.')) return
    if (num && typeof num !== 'undefined') {
      if (num < min) return
      if (num > max) return
    }
    if (str?.[0] === '0' && str?.[1] !== '.' && str.length > 1) {
      str = str.slice(1)
    }
    setNum(formatStr(str))
    if (str?.[str.length - 1] === '.') {
      return
    }
    onChange?.(formatNum(num))
  })

  useEffect(() => {
    setNum(typeof value === 'number' ? value.toString() : undefined)
  }, [value])

  const renderValue = useMemo(() => {
    if (typeof num === 'undefined') return num
    if (!/^-?\d+(\.\d+)?$/.test(num)) return num
    if (!money) return num
    return (Number(num) / 100).toString()
  }, [num, money])

  return (
    <Input
      onFocus={(min || required) ? () => { setFocus(true) } : undefined}
      onBlur={(min || required) ? () => { setFocus(false) } : undefined}
      value={renderValue}
      style={{ width: '100%' }}
      autoComplete={'off'}
      onChange={onChangeHandle}
      prefix={money ? currency?.symbol : props.prefix}
      {...rest}
    />
  )
}

export default memo(SInputNumber)
