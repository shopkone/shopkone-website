import { useTranslation } from 'react-i18next'
import { IconGripVertical } from '@tabler/icons-react'
import { Flex, Form, Input } from 'antd'

import IconButton from '@/components/icon-button'
import OptionValues from '@/pages/mange/product/product/product-change/variant-set/variant-options/option-values'

import styles from './index.module.less'

export interface OptionValue {
  label: string
  values: string[]
  id: number
}

export interface OptionItemProps {
  name: number
}

export default function OptionItem (props: OptionItemProps) {
  const { name } = props
  const { t } = useTranslation('product', { keyPrefix: 'product' })

  return (
    <div className={styles.item}>
      <Flex className={styles.label}>
        <div className={styles.dragBtn}>
          <IconButton type={'text'} size={20}>
            <IconGripVertical size={13} />
          </IconButton>
        </div>
        <Form.Item
          label={t('选项名称')}
          name={[name, 'label']}
          className={'flex1 mb0'}
        >
          <Input />
        </Form.Item>
      </Flex>

      <Form.Item
        className={styles.values}
        label={t('款式值')}
        name={[name, 'values']}
      >
        <OptionValues />
      </Form.Item>
    </div>
  )
}
