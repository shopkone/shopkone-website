import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { IconGripVertical, IconTrash } from '@tabler/icons-react'
import { Button, Flex, Input } from 'antd'

import IconButton from '@/components/icon-button'
import SRender from '@/components/s-render'
import ItemSortable from '@/components/sortable/sortable-item'
import DragWrapper from '@/pages/mange/product/product/product-change/variant-set/variant-options/drag-wrapper'
import { ErrorObj } from '@/pages/mange/product/product/product-change/variant-set/variant-options/error-handle'
import ErrorItem from '@/pages/mange/product/product/product-change/variant-set/variant-options/error-item'
import OptionItemFinish
  from '@/pages/mange/product/product/product-change/variant-set/variant-options/option-item-finish'
import { genId } from '@/utils/random'

import styles from './index.module.less'

export interface OptionValue {
  label: string
  values: Array<{ id: number, value: string }>
  id: number
}

export interface OptionItemProps {
  onRemove?: () => void
  length: number
  value: OptionValue
  onChange: (value: OptionValue) => void
  errors: ErrorObj[]
  index: number
  dragging: boolean
}

export default function OptionItem (props: OptionItemProps) {
  const { onRemove, length, value, onChange, errors, index, dragging } = props
  const { t } = useTranslation('product', { keyPrefix: 'product' })
  const [isFinish, setIsFinish] = useState(false)
  const [active, setActive] = useState(-1)

  const getNewValue = () => {
    return { id: genId(), value: '' }
  }

  const onChangeValue = (id: number, v: string) => {
    const newValues = value.values.map(item => item.id === id ? { ...item, value: v } : item)
    const lastValue = newValues[newValues.length - 1]
    if (lastValue?.value) {
      newValues.push(getNewValue())
    }
    onChange({ ...value, values: newValues })
  }

  const onChangeValues = (v: OptionValue['values']) => {
    onChange({ ...value, values: v })
  }

  const onRemoveValue = (id: number) => {
    const newValues = value.values.filter(item => item.id !== id)
    onChange({ ...value, values: newValues })
  }

  const isFinishFlag = dragging || isFinish

  return (
    <ItemSortable
      index={index}
      rowKey={value.id}
      className={styles.dragItem}
      draggingClassName={styles.dragging}
      handle={
        <div className={styles.dragBtn} style={{ top: isFinishFlag ? 4 : 0 }}>
          <IconButton type={'text'} size={20}>
            <IconGripVertical size={14} />
          </IconButton>
        </div>
      }
    >
      <div className={styles.item}>
        <div className={styles.label}>
          <SRender render={!isFinishFlag}>
            <div style={{ marginLeft: 44, marginBottom: 4 }}>{t('选项名称')}</div>
          </SRender>
          <Flex align={isFinishFlag ? 'flex-start' : 'center'}>
            <div style={{ width: 44 }} />
            <SRender render={!isFinishFlag}>
              <Input
                placeholder={t('选项名称')}
                onChange={e => { onChange({ ...value, label: e.target.value }) }}
                value={value.label}
                autoComplete={'off'}
              />
            </SRender>
            <SRender render={isFinishFlag}>
              <OptionItemFinish onEdit={() => { setIsFinish(false) }} value={value} />
            </SRender>
          </Flex>
          <SRender render={!isFinishFlag}>
            <ErrorItem errors={errors} id={value.id} isLabel />
          </SRender>
        </div>

        <SRender render={!isFinishFlag}>
          <div style={{ marginRight: 12 }}>
            <div style={{ marginLeft: 45, marginBottom: 4 }}>{t('选项值')}</div>
            <DragWrapper<OptionValue['values'][number]>
              onChange={onChangeValues}
              items={value.values}
              activeId={active}
              setActiveId={setActive}
              draggingClassName={styles.valueDraggingWrapper}
            >
              {
                value.values.map((item, index) => (
                  <div key={item.id}>
                    <ItemSortable
                      disabled={(value.values?.length - 1) === index}
                      handle={
                        <div className={styles.valueDragBtn}>
                          <IconButton disabled={(value.values?.length - 1) === index} type={'text'} size={20}>
                            <IconGripVertical size={14} />
                          </IconButton>
                        </div>
                      }
                      draggingClassName={styles.valueDragging}
                      index={index}
                      rowKey={item.id}
                      key={item.id}
                      className={styles.value}
                    >
                      <Input
                        placeholder={t('选项值')}
                        onChange={e => { onChangeValue(item.id, e.target.value) }}
                        value={item.value}
                        autoComplete={'off'}
                        suffix={
                          <IconButton
                            disabled={(value.values?.length - 1) === index}
                            onClick={() => { onRemoveValue(item.id) }}
                            size={20}
                            type={'text'}
                          >
                            <IconTrash size={14} />
                          </IconButton>
                        }
                      />
                    </ItemSortable>
                    <div style={{ marginBottom: 8, position: 'relative', top: -4 }}>
                      <ErrorItem errors={errors} id={item.id} isLabel={false} />
                    </div>
                  </div>
                ))
              }
            </DragWrapper>
          </div>

          <Flex justify={'space-between'} className={styles.actions}>
            <Button disabled={length === 1} onClick={onRemove} danger>{t('删除')}</Button>
            <Button onClick={() => { setIsFinish(true) }} type={'primary'}>{t('完成')}</Button>
          </Flex>
        </SRender>
      </div>
    </ItemSortable>
  )
}
