import { IconGripVertical, IconPhotoPlus, IconTrash } from '@tabler/icons-react'
import { Button, Flex, Input, Tooltip } from 'antd'

import SRender from '@/components/s-render'
import { ItemProps, Options } from '@/pages/mange/product/product/product-change/variants/changer/item'
import { genId } from '@/utils/random'

import styles from './index.module.less'

export interface ItemValuesProps {
  value?: Options['values']
  onChange?: (value: Options['values']) => void
  errors: ItemProps['errors']
}

export default function ItemValues (props: ItemValuesProps) {
  const { value, onChange, errors } = props

  const onRemoveItem = (id: number) => {
    const newValue = value?.filter((item) => item.id !== id)
    onChange?.(newValue || [])
  }

  const onChangeHandler = (id: number, val: string) => {
    let newValue = value?.map((item) => item.id === id ? { ...item, value: val } : item)
    const currentIndex = value?.findIndex((item) => item.id === id) || 0
    const nextValue = newValue?.[currentIndex + 1]
    if (!nextValue) {
      const item = { value: '', id: genId() }
      newValue = [...(newValue || []), item]
    }
    onChange?.(newValue || [])
  }

  return (
    <Flex vertical gap={4}>
      {
        value?.map((item, index) => (
          <Flex key={item.id} align={'center'} gap={4}>
            <Button
              style={{ width: 24, height: 24, position: 'relative', top: -1 }}
              type={'text'}
              size={'small'}
            >
              <IconGripVertical style={{ position: 'relative', left: -4 }} size={14} />
            </Button>
            <div className={'flex1'}>
              <Input
                autoComplete={'off'}
                value={item.value}
                onChange={e => { onChangeHandler(item.id, e.target.value) }}
                suffix={
                  <SRender render={value?.length > 1 && index !== value?.length - 1}>
                    <Button
                      style={{ width: 24, height: 24, position: 'absolute', right: 8 }}
                      type={'text'}
                      size={'small'}
                      onClick={e => {
                        e.stopPropagation()
                        onRemoveItem(item.id)
                      }}
                    >
                      <IconTrash
                        style={{ position: 'relative', left: -4 }} size={15}
                      />
                    </Button>
                  </SRender>
                }
              />
              <SRender render={errors?.find(e => e.id === item.id)}>
                <div className={styles.error} style={{ marginLeft: 0, marginBottom: 4 }}>
                  {errors?.find(e => e.id === item.id)?.msg}
                </div>
              </SRender>
            </div>
            <Tooltip title={'Add option image'}>
              <SRender render={index !== value?.length - 1}>
                <Button
                  style={{ width: 24, height: 24, marginBottom: errors?.find(e => e.id === item.id)?.msg ? 20 : 0 }}
                  type={'text'}
                  size={'small'}
                  onClick={e => {
                    e.stopPropagation()
                  }}
                >
                  <IconPhotoPlus style={{ position: 'relative', left: -4 }} size={15} />
                </Button>
              </SRender>
              <SRender render={index === value?.length - 1}>
                <div style={{ width: 24, height: 24 }} />
              </SRender>
            </Tooltip>
          </Flex>
        ))
      }
    </Flex>
  )
}
