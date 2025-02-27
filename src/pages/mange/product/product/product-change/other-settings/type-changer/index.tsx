import { useTranslation } from 'react-i18next'
import { Form, Radio } from 'antd'

import { useModal } from '@/components/s-modal'
import { useVariantTypeOptions, VariantType } from '@/constant/product'
import { Variant } from '@/pages/mange/product/product/product-change/variant-set/state'

import styles from '../index.module.less'

export interface TypeChangerProps {
  onChange?: (type: VariantType) => void
  value?: VariantType
}

export default function Index (props: TypeChangerProps) {
  const { value, onChange } = props
  const modal = useModal()
  const form = Form.useFormInstance()
  const { t } = useTranslation('product', { keyPrefix: 'product' })

  const options = useVariantTypeOptions(t)

  // 更新选项的标签为翻译内容
  const translatedOptions = options.map(option => ({
    label: option.label, // 使用翻译
    value: option.value
  }))

  const onChangeHandle = (v: number) => {
    const variants = form.getFieldValue('variants') || []
    const opt = form.getFieldValue('options') || []
    const hasValue = variants?.some((i: Variant) => {
      if (i.name?.length) {
        return true
      }
      return (i.barcode || i.sku || i.price || i.compare_at_price || i.cost_per_item || i.weight)
    })
    if (!hasValue && !opt?.length) {
      onChange?.(v)
      return
    }
    modal.confirm({
      title: t('确认要切换吗？'), // 使用翻译
      content: t('切换到单一款式模式将清除当前款式设置'), // 使用翻译
      onOk: () => {
        onChange?.(v)
      },
      centered: true
    })
  }

  return (
    <div className={styles.inner}>
      <Radio.Group
        onChange={(v) => { onChangeHandle(v.target.value) }}
        value={value}
        options={translatedOptions}
      />
    </div>
  )
}
