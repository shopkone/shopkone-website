import { useTranslation } from 'react-i18next'
import { IconGripVertical, IconTrash } from '@tabler/icons-react'
import { useThrottleFn } from 'ahooks'
import { Button, Flex, Form, Input } from 'antd'

import IconButton from '@/components/icon-button'

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

  return (
    <div className={styles.item}>
      <Flex className={styles.label}>
        <div className={styles.dragBtn}>
          <IconButton type={'text'} size={20}>
            <IconGripVertical size={14} />
          </IconButton>
        </div>
        <Form.Item label={t('选项名称')} name={[name, 'label']} className={'flex1 mb0'}>
          <Input autoComplete={'off'} />
        </Form.Item>
      </Flex>

      <Form.List name={[name, 'values']}>
        {
          (fields, { remove, add }) => (
            <div className={styles.values}>
              <div className={styles.valueLabel}>{t('款式值')}</div>
              {
                fields.map((field, index) => (
                  <Flex align={'center'} key={field.name} className={styles.value}>
                    <div style={{ width: 24 }}>
                      <IconButton type={'text'} size={20}>
                        <IconGripVertical size={14} />
                      </IconButton>
                    </div>
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
                        onChange={() => {
                          onChangeHandle(add)
                        }}
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
                ))
              }
            </div>
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
