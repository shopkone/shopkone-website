import { useTranslation } from 'react-i18next'
import { IconGripVertical, IconTrash } from '@tabler/icons-react'
import { Button, Flex, Input } from 'antd'

import IconButton from '@/components/icon-button'

import styles from './index.module.less'

export interface OptionValue {
  label: string
  values: string[]
  id: number
}

export interface OptionItemProps {
  option: OptionValue
  onChange?: (option: OptionValue) => void
  onRemove?: () => void
  length: number
}

export default function OptionItem (props: OptionItemProps) {
  const { t } = useTranslation('product', { keyPrefix: 'product' })

  const { option, length } = props

  const onChangeValue = (i: number, value: string) => {
    let newValues = option.values.map((item, index) => i === index ? value : item)
    const last = newValues[newValues.length - 1]
    if (last) {
      newValues = [...newValues, '']
    }
    props.onChange?.({ ...option, values: newValues })
  }

  const onRemove = (index: number) => {
    if (option.values.length > 1) {
      const newValues = option.values.filter((_, i) => i !== index)
      props.onChange?.({ ...option, values: newValues })
    }
  }

  return (
    <div className={styles.item}>
      <div className={styles.title}>
        <div className={styles.label}>{t('选项名称')}</div>
        <Flex align={'center'}>
          <div className={styles.icon}>
            <IconButton style={{ border: 'none' }} size={24}>
              <IconGripVertical size={14} />
            </IconButton>
          </div>
          <Input
            value={option.label}
            placeholder={t('选项名称')}
            onChange={e => { props.onChange?.({ ...option, label: e.target.value }) }}
          />
        </Flex>
      </div>
      <div className={styles.values}>
        <div className={styles.label}>
          {t('选项值')}
        </div>
        {
          option.values.map((value, index) => (
            <Flex style={{ marginBottom: 6 }} key={index} align={'center'}>
              <div className={styles.icon} />
              <Input
                onChange={(e) => { onChangeValue(index, e.target.value) }}
                value={value}
                placeholder={t('选项值')}
                suffix={
                  <IconButton
                    disabled={option.values.length <= 1 || index === option.values.length - 1}
                    onClick={e => {
                      e.stopPropagation()
                      onRemove(index)
                    }}
                    type={'text'}
                    size={20}
                  >
                    <IconTrash size={14} />
                  </IconButton>
                }
              />
            </Flex>
          ))
        }
      </div>

      <Flex justify={'space-between'} className={styles.actions}>
        <Button
          disabled={length <= 1}
          onClick={props.onRemove}
          danger
        >
          {t('删除')}
        </Button>
        <Button type={'primary'}>{t('完成')}</Button>
      </Flex>
    </div>
  )
}
