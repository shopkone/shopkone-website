import { useTranslation } from 'react-i18next'
import { Form, Radio } from 'antd'

import { useModal } from '@/components/s-modal'
import { useVariantTypeOptions, VariantType } from '@/constant/product'
import { Variant } from '@/pages/mange/product/product/product-change/variants/state'

export interface TypeChangerProps {
  onChange?: (type: VariantType) => void
  value?: VariantType
}

export default function TypeChanger (props: TypeChangerProps) {
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
    <Radio.Group
      value={value}
      onChange={e => {
        onChangeHandle(e.target.value)
      }}
      options={translatedOptions}
    />
  )
}
