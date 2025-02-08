import { useTranslation } from 'react-i18next'
import { IconGripVertical, IconTrash } from '@tabler/icons-react'
import { useThrottleFn } from 'ahooks'
import { Button, Flex, Form, Input } from 'antd'

import IconButton from '@/components/icon-button'
import ItemSortable from '@/components/sortable/sortable-item'
import DragWrapper from '@/pages/mange/product/product/product-change/variant-set/variant-options/drag-wrapper'

import styles from './index.module.less'

export interface OptionValue {
  label: string
  values: string[]
  id: number
}

export interface OptionItemProps {
  name: number
  onRemove?: () => void
  length: number
}

export default function OptionItem (props: OptionItemProps) {
  const { name, onRemove, length } = props
  const { t } = useTranslation('product', { keyPrefix: 'product' })
  const form = Form.useFormInstance()

  const onChangeHandle = useThrottleFn((add: any) => {
    const values = form.getFieldValue(['product_options', name, 'values'])
    const lastValue = values[values.length - 1]
    if (lastValue) {
      add('')
    }
  }, { wait: 300 }).run

  const onSwap = () => {}

  return (
    <div className={styles.item}>
      <Flex className={styles.label}>
        <div className={styles.dragBtn}>
          <IconButton type={'text'} size={20}>
            <IconGripVertical size={14} />
          </IconButton>
        </div>
        <Form.Item
          rules={[{
            validator: async (rule, value) => {
              if (!value) {
                throw new Error(t('请输入选项名称'))
              }
              const options = form.getFieldValue(['product_options'])
              // 名称不能重复
              const list = options.filter((item: any) => item.label === value)
              if (list.length > 1) {
                throw new Error(t('选项名称不能重复'))
              }
              await Promise.resolve()
            }
          }]}
          label={t('选项名称')}
          name={[name, 'label']}
          className={'flex1 mb0'}
        >
          <Input autoComplete={'off'} />
        </Form.Item>
      </Flex>

      <Form.List name={[name, 'values']}>
        {
            (fields, { remove, add }) => (
              <DragWrapper onChange={onSwap} items={fields.map(item => ({ ...item, name: item.name + 1 }))}>
                <div className={styles.values}>
                  <div className={styles.valueLabel}>{t('款式值')}</div>
                  {
                      fields.map((field, index) => (
                        <ItemSortable
                          disabled={fields.length - 1 === index}
                          handle={
                            <div className={styles.valueDragBtn}>
                              <IconButton disabled={fields.length - 1 === index} type={'text'} size={20}>
                                <IconGripVertical size={14} />
                              </IconButton>
                            </div>
                          }
                          draggingClassName={styles.dragging}
                          rowKey={field.name + 1}
                          index={index}
                          key={field.name + 1}
                        >
                          <Flex align={'center'} key={field.name} className={styles.value}>
                            <Form.Item
                              rules={[{
                                validator: async (rule, value) => {
                                  const values = form.getFieldValue(['product_options', name, 'values'])
                                  if (index !== (fields.length - 1) && !value) {
                                    await Promise.reject(t('请输入款式值'))
                                  }
                                  if (values.indexOf(value) !== values.lastIndexOf(value)) {
                                    throw new Error(t('款式值不能重复'))
                                  }
                                  await Promise.resolve()
                                }
                              }]}
                              className={styles.valueInput}
                              name={field.name}
                            >
                              <Input
                                onChange={() => { onChangeHandle(add) }}
                                placeholder={t('款式值')}
                                autoComplete={'off'}
                                suffix={
                                  <IconButton
                                    disabled={fields.length - 1 === index}
                                    onClick={() => {
                                      remove(field.name)
                                      form.validateFields()
                                    }}
                                    type={'text'}
                                    size={20}
                                  >
                                    <IconTrash size={13} />
                                  </IconButton>
                                }
                              />
                            </Form.Item>
                          </Flex>
                        </ItemSortable>
                      ))
                    }
                </div>
              </DragWrapper>
            )
          }
      </Form.List>

      <Flex justify={'space-between'} className={styles.actions}>
        <Button disabled={length === 1} onClick={onRemove} danger>{t('删除')}</Button>
        <Button type={'primary'}>{t('完成')}</Button>
      </Flex>
    </div>
  )
}
