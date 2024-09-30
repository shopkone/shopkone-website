import { IconGripVertical } from '@tabler/icons-react'
import { Button, Flex, Input } from 'antd'
import classNames from 'classnames'

import SRender from '@/components/s-render'
import { Option } from '@/pages/mange/product/product/product-change/variants/state'
import { genId } from '@/utils/random'

import styles from './index.module.less'
import Value, { ValueProps } from './value'

export interface ItemProps {
  value: Option
  onChange: (value: ItemProps['value']) => void
  onRemove?: (id: number) => void
  name: string
  errors: Array<{ id: number, msg: string }>
}

export default function Item (props: ItemProps) {
  const { value, onChange, name, onRemove, errors } = props

  const onRemoveValue = (id: number) => {
    onChange({ ...value, values: value.values.filter(item => item.id !== id) })
  }

  const onChangeValue = (val: ValueProps['value'], index: number) => {
    let values = value.values.map((item) => {
      return val.id === item.id ? val : item
    })
    const nextValue = values[index + 1]
    if (!nextValue) {
      values = [...values, { id: genId(), value: '' }]
    }
    onChange({ ...value, values })
  }

  const errMsg = errors?.find(item => item.id === value.id)?.msg

  return (
    <div className={styles.item}>
      <Flex className={styles.title} align={'center'} justify={'space-between'}>
        <Flex align={'center'} gap={8}>
          <Button type={'text'} size={'small'} className={styles.dragBtn}>
            <IconGripVertical size={13} />
          </Button>
          <div>{name}</div>
        </Flex>
        <Flex align={'center'} gap={4}>
          <SRender render={onRemove}>
            <Button onClick={() => { onRemove?.(value.id) }} type={'text'} size={'small'} danger>
              Delete
            </Button>
          </SRender>
          <Button type={'text'} size={'small'} className={'primary-text'}>Done</Button>
        </Flex>
      </Flex>

      <div className={styles.inner}>
        <div className={styles.values}>
          <div className={styles.label}>Option name</div>
          <Input
            value={value.name}
            onChange={(e) => { onChange({ ...value, name: e.target.value }) }}
            className={classNames({ [styles.errInput]: errMsg }, styles.input)}
          />
          <div className={styles.error} style={{ marginLeft: 32, marginBottom: errMsg ? 4 : 0, height: errMsg ? 16 : 0 }}>
            {errMsg}
          </div>
        </div>

        <div className={styles.values}>
          <div className={styles.label}>Option value</div>
          <Flex vertical gap={4}>
            {
              value?.values.map((item, index) => (
                <Value
                  drag={value?.values?.length > 1 && index !== value?.values?.length - 1}
                  errors={errors}
                  value={item}
                  key={item.id}
                  onRemove={(value?.values?.length > 1 && index !== value?.values?.length - 1) ? onRemoveValue : undefined}
                  onChange={(v) => { onChangeValue(v, index) }}
                />
              ))
            }
          </Flex>
        </div>
      </div>
    </div>
  )
}
