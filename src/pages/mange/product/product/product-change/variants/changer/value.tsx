import { IconGripVertical, IconPhotoPlus, IconTrash } from '@tabler/icons-react'
import { Button, Flex, Input, Tooltip } from 'antd'
import classNames from 'classnames'

import SRender from '@/components/s-render'
import { Option } from '@/pages/mange/product/product/product-change/variants/state'

import styles from './index.module.less'

type OptionValue = Option['values'][number]

export interface ValueProps {
  value: OptionValue
  onChange: (value: ValueProps['value']) => void
  onRemove?: (id: number) => void
  errors: Array<{ id: number, msg: string }>
  drag?: boolean
}

export default function Value (props: ValueProps) {
  const { value, onChange, onRemove, errors, drag } = props

  const errMsg = errors?.find(item => item.id === value.id)?.msg

  return (
    <Flex align={'center'} gap={4}>
      <SRender render={drag}>
        <Button
          style={{ marginTop: errors?.find(item => item.id === value.id)?.msg ? -22 : 0 }}
          type={'text'}
          size={'small'}
          className={styles.dragBtn}
        >
          <IconGripVertical size={13} />
        </Button>
      </SRender>
      <SRender render={!drag} style={{ width: 24 }} />
      <div style={{ flex: 1 }}>
        <Input
          className={classNames({ [styles.errInput]: errMsg })}
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
      <SRender render={onRemove}>
        <Tooltip title={'Add image'}>
          <Button
            style={{ marginTop: errors?.find(item => item.id === value.id)?.msg ? -24 : 0 }} type={'text'}
            size={'small'} className={styles.suffixBtn}
          >
            <IconPhotoPlus size={16} />
          </Button>
        </Tooltip>
      </SRender>
      <SRender render={!onRemove} style={{ width: 27 }} />
    </Flex>
  )
}
