import { IconGripVertical, IconPhotoPlus, IconTrash } from '@tabler/icons-react'
import { Button, Flex, Input, Tooltip } from 'antd'

import SRender from '@/components/s-render'
import { Option } from '@/pages/mange/product/product/product-change/variants/state'

import styles from './index.module.less'

type OptionValue = Option['values'][number]

export interface ValueProps {
  value: OptionValue
  onChange: (value: ValueProps['value']) => void
  onRemove?: (id: number) => void
  errors: Array<{ id: number, msg: string }>
}

export default function Value (props: ValueProps) {
  const { value, onChange, onRemove, errors } = props

  const errMsg = errors?.find(item => item.id === value.id)?.msg

  return (
    <Flex align={'center'} gap={8}>
      <Button type={'text'} size={'small'} className={styles.dragBtn}>
        <IconGripVertical size={13} />
      </Button>
      <div style={{ flex: 1 }}>
        <Input
          suffix={
            <SRender render={onRemove}>
              <Button
                onClick={() => {
                  onRemove?.(value.id)
                }}
                type={'text'}
                size={'small'}
                className={styles.trashBtn}
              >
                <IconTrash size={15} />
              </Button>
            </SRender>
          }
          autoComplete={'off'}
          value={value.value}
          onChange={(e) => {
            onChange?.({
              ...value,
              value: e.target.value
            })
          }}
        />
        <div
          className={styles.error}
          style={{
            marginBottom: errMsg ? 4 : 0,
            height: errMsg ? 16 : 0
          }}
        >
          {errMsg}
        </div>
      </div>
      <Tooltip title={'Add image'}>
        <Button
          style={{ marginTop: errors?.find(item => item.id === value.id)?.msg ? -32 : 0 }} type={'text'}
          size={'small'} className={styles.suffixBtn}
        >
          <IconPhotoPlus size={16} />
        </Button>
      </Tooltip>
    </Flex>
  )
}
