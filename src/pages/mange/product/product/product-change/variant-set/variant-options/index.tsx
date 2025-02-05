import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { IconCirclePlus } from '@tabler/icons-react'
import { useDebounceFn } from 'ahooks'
import { Button, Form } from 'antd'

import SCard from '@/components/s-card'
import SRender from '@/components/s-render'
import OptionItem, {
  OptionValue
} from '@/pages/mange/product/product/product-change/variant-set/variant-options/option-item'
import { genId } from '@/utils/random'

import * as worker from '../worker'

import styles from './index.module.less'

export interface VariantOptionsProps {
  value?: OptionValue[]
  onChange?: (options: OptionValue[]) => void
}

export default function VariantOptions (props: VariantOptionsProps) {
  const { value = [], onChange } = props
  const { t } = useTranslation('product', { keyPrefix: 'product' })
  const form = Form.useFormInstance()

  const onChangeHandle = (option: OptionValue) => {
    onChange?.(value.map(item => {
      if (item.id === option.id) {
        return option
      }
      return item
    }))
  }

  const onAddHandle = () => {
    onChange?.([...value, { label: '', values: [''], id: genId() }])
  }

  const onRemoveHandle = (optionId: number) => {
    onChange?.(value.filter(item => item.id !== optionId))
  }

  const toList = useDebounceFn(() => {
    const variants = form.getFieldValue('variants')
    worker.toListWorker.postMessage({ options: value, variants })
  }, { wait: 500 })

  useEffect(() => {
    onChange?.([{ label: '', values: [''], id: genId() }])
  }, [])

  useEffect(() => {
    toList.run()
  }, [value])

  return (
    <SCard title={t('款式选项')} bodyStyle={{ padding: 0 }}>
      {
          value.map((option, index) => (
            <OptionItem
              length={value.length}
              onRemove={() => { onRemoveHandle(option.id) }}
              onChange={onChangeHandle}
              option={option}
              key={option.id}
            />
          ))
        }
      <SRender render={value.length < 3}>
        <div style={{ padding: 8 }}>
          <Button className={styles.btn} onClick={onAddHandle}>
            <IconCirclePlus size={14} />
            {t('添加其它选项')}
          </Button>
        </div>
      </SRender>
    </SCard>
  )
}
