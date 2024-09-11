import { useMemo, useState } from 'react'
import { Down } from '@icon-park/react'
import { Button, Checkbox, Flex, Popover } from 'antd'
import { CheckboxGroupProps } from 'antd/es/checkbox'

import FilterRadio, { RadioGroup } from '@/components/table-filter/filter-radio'

import styles from './index.module.less'

interface CheckboxGroup extends Omit<CheckboxGroupProps, 'options'> {
  options: Array<{ label: string, value: string | number }>
}

export interface TableFilterProps {
  children?: React.ReactNode
  radio?: RadioGroup
  checkbox?: CheckboxGroup
}

export default function Index (props: TableFilterProps) {
  const { children, radio, checkbox } = props
  const [open, setOpen] = useState(false)

  const label = useMemo(() => {
    if (radio) {
      return radio?.options?.find((item) => {
        return item?.value === radio?.value
      })?.label
    }
    if (checkbox) {
      return checkbox?.value?.map((key) => checkbox?.options?.find((item) => {
        return item?.value === key
      })?.label)
    }
  }, [radio, checkbox])

  const onClear = () => {
    setOpen(false)
    if (radio) {
      radio?.onChange?.(undefined)
    }
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
          <div onClick={onClear} style={{ marginLeft: -8, height: 20, fontWeight: 400, marginTop: 8, marginBottom: 4 }}>
            <Button type={'link'} size={'small'}>Clear</Button>
          </div>
        </div>
      }
      placement={'bottomLeft'}
      arrow={false}
    >
      <Button type={label ? undefined : 'dashed'} size={'small'}>
        <Flex gap={2} align={'center'} style={{ fontWeight: 400 }}>
          <div>
            {children}{label ? ':' : ''} {label}
          </div>
          <Down style={{ position: 'relative', top: 3 }} size={13} strokeWidth={3} />
        </Flex>
      </Button>
    </Popover>
  )
}
