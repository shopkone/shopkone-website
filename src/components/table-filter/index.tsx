import { MouseEventHandler, useMemo, useState } from 'react'
import { CloseOutlined } from '@ant-design/icons'
import { Down } from '@icon-park/react'
import { Button, Checkbox, Flex, Popover } from 'antd'
import { CheckboxGroupProps } from 'antd/es/checkbox'

import FilterNumberRange, { FilterNumberRangeProps } from '@/components/table-filter/filter-number-range'
import FilterRadio, { RadioGroup } from '@/components/table-filter/filter-radio'

import styles from './index.module.less'

interface CheckboxGroup extends Omit<CheckboxGroupProps, 'options'> {
  options: Array<{ label: string, value: string | number }>
}

export interface TableFilterProps {
  children?: React.ReactNode
  radio?: RadioGroup
  checkbox?: CheckboxGroup
  numberRange?: FilterNumberRangeProps
}

export default function TableFilter (props: TableFilterProps) {
  const { children, radio, checkbox, numberRange } = props
  const [open, setOpen] = useState(false)

  const label = useMemo(() => {
    if (radio) {
      setOpen(false)
      return radio?.options?.find((item) => {
        return item?.value === radio?.value
      })?.label
    }
    if (checkbox) {
      return checkbox?.value?.map((key) => checkbox?.options?.find((item) => {
        return item?.value === key
      })?.label).join(', ')
    }
    if (numberRange) {
      const min = numberRange?.value?.[0]
      const max = numberRange?.value?.[1]
      if (min && !max) return `Greater than ${min} ${numberRange.unit}`
      if (max && !min) return `Less than ${max} ${numberRange.unit}`
      if (min && max) return `${min} ${numberRange.unit}-${max} ${numberRange.unit}`
    }
  }, [radio, checkbox, numberRange])

  const onClear: MouseEventHandler = (e) => {
    e.stopPropagation()
    if (radio) {
      radio?.onChange?.(undefined)
    }
    if (numberRange) {
      numberRange?.onChange?.([undefined, undefined])
    }
    if (checkbox) {
      checkbox?.onChange?.([])
    }
    setOpen(false)
  }

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      trigger={'click'}
      content={
        <div className={styles.content}>
          {radio ? <FilterRadio{...radio} /> : null}
          {checkbox ? <Checkbox.Group {...checkbox} /> : null}
          {numberRange ? <FilterNumberRange {...numberRange} /> : null}
          <div
            onClick={onClear}
            style={{
              marginLeft: -8,
              height: 20,
              fontWeight: 400,
              marginTop: 8,
              marginBottom: 4
            }}
          >
            <Button disabled={!label} type={'link'} size={'small'}>Clear</Button>
          </div>
        </div>
      }
      placement={'bottomLeft'}
      arrow={false}
    >
      <Button style={{ background: '#fff' }} type={label ? undefined : 'dashed'} size={'small'}>
        <Flex gap={2} align={'center'}>
          <div style={{ fontWeight: label ? 550 : 400 }}>
            <span style={{ color: '#666' }}>{children}</span>{label ? ':' : ''} {label}
          </div>
          {
            label
              ? (
                <div className={styles.close} onClick={onClear}>
                  <CloseOutlined className={styles.closeIcon} />
                </div>
                )
              : (
                <Down style={{ position: 'relative', top: 3 }} size={13} strokeWidth={3} />
                )
          }
        </Flex>
      </Button>
    </Popover>
  )
}
