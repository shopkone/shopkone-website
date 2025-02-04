import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { IconCirclePlus } from '@tabler/icons-react'
import { useDebounceFn } from 'ahooks'
import { Button } from 'antd'

import SCard from '@/components/s-card'
import SRender from '@/components/s-render'
import OptionItem, {
  OptionValue
} from '@/pages/mange/product/product/product-change/variant-set/variant-options/option-item'
import { Variant } from '@/pages/mange/product/product/product-change/variants/state'
import { genId } from '@/utils/random'

import * as worker from '../worker'

import styles from './index.module.less'

export interface VariantOptionsProps {
  variants: Variant[]
}

export default function VariantOptions (props: VariantOptionsProps) {
  const { variants } = props
  const { t } = useTranslation('product', { keyPrefix: 'product' })
  const [options, setOptions] = useState<OptionValue[]>([])

  const onChangeHandle = (option: OptionValue) => {
    setOptions(options.map(item => {
      if (item.id === option.id) {
        return option
      }
      return item
    }))
  }

  const onAddHandle = () => {
    setOptions([...options, { label: '', values: [''], id: genId() }])
  }

  const onRemoveHandle = (optionId: number) => {
    setOptions(options.filter(item => item.id !== optionId))
  }

  const toList = useDebounceFn(() => {
    worker.toListWorker.postMessage({ options, variants })
  }, { wait: 500 })

  useEffect(() => {
    setOptions([{ label: '', values: [''], id: genId() }])
  }, [])

  useEffect(() => {
    toList.run()
  }, [options])

  return (
    <SCard title={t('款式选项')} bodyStyle={{ padding: 0 }}>
      {
          options.map((option, index) => (
            <OptionItem
              length={options.length}
              onRemove={() => { onRemoveHandle(option.id) }}
              onChange={onChangeHandle}
              option={option}
              key={option.id}
            />
          ))
        }
      <SRender render={options.length < 3}>
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
