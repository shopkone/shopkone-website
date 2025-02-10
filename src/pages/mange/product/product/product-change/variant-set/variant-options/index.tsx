import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { IconCirclePlus } from '@tabler/icons-react'
import { useDebounceFn } from 'ahooks'
import { Button, Form } from 'antd'

import SCard from '@/components/s-card'
import SRender from '@/components/s-render'
import DragWrapper from '@/pages/mange/product/product/product-change/variant-set/variant-options/drag-wrapper'
import {
  ErrorObj,
  getOptionErrors
} from '@/pages/mange/product/product/product-change/variant-set/variant-options/error-handle'
import OptionItem, {
  OptionValue
} from '@/pages/mange/product/product/product-change/variant-set/variant-options/option-item'
import { genId } from '@/utils/random'

import * as worker from '../worker'

import styles from './index.module.less'

export interface VariantOptionsProps {
  value?: OptionValue[]
  onChange?: (value: OptionValue[]) => void
}

export default function VariantOptions (props: VariantOptionsProps) {
  const { value = [], onChange } = props
  const { t } = useTranslation('product', { keyPrefix: 'product' })
  const form = Form.useFormInstance()
  const { id } = useParams()
  const [errs, setErrs] = useState<ErrorObj[]>([])
  const [activeId, setActiveId] = useState(-1)

  const onChangeHandle = (option: OptionValue) => {
    const newValue = value?.map(item => {
      return option.id === item.id ? option : item
    })
    onChange?.(newValue || [])
  }

  const onSwap = (list: OptionValue[]) => {}

  const onAddHandle = () => {
    const newValue = { id: genId(), label: '', values: [{ id: genId(), value: '' }] }
    onChange?.([...value, newValue])
  }

  const toList = useDebounceFn(() => {
    const errors = getOptionErrors(value, t)
    setErrs(errors)
    if (errors?.length) return
    const variants = form.getFieldValue('variants')
    const optionsInput = value.map(item => {
      return { ...item, values: item.values.filter(i => i.value) }
    })
    worker.toListWorker.postMessage({ options: optionsInput, variants })
  }, { wait: 500 })

  useEffect(() => {
    toList.run()
  }, [value])

  useEffect(() => {
    if (!id) {
      onAddHandle()
    }
  }, [id])

  return (
    <SCard title={t('款式选项')} styles={{ body: { padding: 0, paddingTop: 16 } }}>
      <div>
        <DragWrapper<OptionValue>
          onChange={onSwap}
          items={value}
          setActiveId={setActiveId}
          activeId={activeId}
          draggingClassName={styles.labelDraggingWrapper}
        >
          {
            value?.map((item, index) => (
              <OptionItem
                dragging={activeId >= 0}
                index={index}
                errors={errs}
                onChange={onChangeHandle}
                value={item}
                key={item.id}
                length={value?.length || 0} onRemove={() => { }}
              />
            ))
          }
        </DragWrapper>
      </div>

      <SRender render={(value?.length || 0) < 3}>
        <div style={{ paddingLeft: 12, paddingBottom: 12, marginTop: 12 }}>
          <Button className={styles.btn} onClick={onAddHandle}>
            <IconCirclePlus size={14} />
            {t('添加其它选项')}
          </Button>
        </div>
      </SRender>
    </SCard>
  )
}
