import { IconGripVertical, IconTrash } from '@tabler/icons-react'
import { Flex, Input } from 'antd'

import IconButton from '@/components/icon-button'
import styles from '@/pages/mange/product/product/product-change/variant-set/variant-options/index.module.less'

export interface OptionValue {
  value?: string[]
  onChange?: (values: string[]) => void
}

export default function OptionValues (props: OptionValue) {
  const { value = [], onChange } = props

  const onChangeHandle = (index: number, v: string) => {
    let newValue = value.map((item, i) => {
      return i === index ? v : item
    })
    const lastValue = value[value.length - 1]
    if (lastValue) {
      newValue = [...newValue, '']
    }
    onChange?.(newValue)
  }

  const onRemove = (index: number) => {
    const newValue = value.filter((item, i) => i !== index)
    onChange?.(newValue)
  }

  return (
    <div>
      {
        value?.map((item, index) => (
          <Flex className={styles.value} align={'center'} key={index}>
            <div className={styles.valueDragBtn}>
              <IconButton type={'text'} size={20}>
                <IconGripVertical size={13} />
              </IconButton>
            </div>
            <Input
              onChange={e => { onChangeHandle(index, e.target.value) }}
              value={item}
              suffix={
                <IconButton onClick={() => { onRemove(index) }} disabled={(index + 1) === value.length} size={20} type={'text'}>
                  <IconTrash size={13} />
                </IconButton>
              }
            />
          </Flex>
        ))
      }
    </div>
  )
}
