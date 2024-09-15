import { memo, useEffect, useRef, useState } from 'react'
import { useMemoizedFn } from 'ahooks'
import { Input, InputProps, InputRef } from 'antd'

import { formatPrice, roundPrice } from '@/utils/num'

export interface SInputNumberProps extends Omit<InputProps, 'onChange' | 'value'> {
  value?: number
  onChange?: (value?: number) => void

  // 对数字进行控制
  max?: number
  min?: number
  debounce?: boolean
  money?: boolean
  uint?: boolean// 是否正整数
}

function SInputNumber (props: SInputNumberProps) {
  const {
    value,
    onChange,
    max = 9999999999,
    min = 0,
    uint,
    money,
    ...rest
  } = props

  const ref = useRef<InputRef>(null)
  const [isFocus, setIsFocus] = useState(false)
  const [num, setNum] = useState<string>()

  const onChangeHandle: InputProps['onChange'] = useMemoizedFn((e) => {
    let str = e.target.value
    const reg = /^[0-9]+(\.[0-9]{0,2})?$/
    if (str && !reg.test(str)) {
      if (!reg.test(str[0])) {
        setNum('')
      }
      return
    }
    const num = str ? roundPrice(Number(str)) : undefined
    if (uint && str?.includes('.')) return
    if (typeof num !== 'undefined') {
      if (num < min) return
      if (num > max) return
    }
    if (str?.[0] === '0' && str?.[1] !== '.' && str.length > 1) {
      str = str.slice(1)
    }
    setNum(str)
    onChange?.(num)
  })

  const select = useMemoizedFn(() => {
    ref.current?.select()
  })

  useEffect(() => {
    setNum(typeof value === 'number' ? value.toString() : undefined)
  }, [value])

  return (
    <Input
      onClick={select}
      onFocus={() => {
        setIsFocus(true)
      }}
      onBlur={() => {
        setIsFocus(false)
      }}
      ref={ref}
      value={(money && !isFocus) ? formatPrice(num) : num}
      style={{ width: '100%' }}
      autoComplete={'off'}
      onChange={onChangeHandle}
      prefix={money ? '$' : props.prefix}
      {...rest}
    />
  )
}

export default memo(SInputNumber)
