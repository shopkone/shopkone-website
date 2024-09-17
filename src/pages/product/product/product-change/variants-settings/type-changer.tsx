import { App, Form, Radio } from 'antd'

import { useVariantTypeOptions, VariantType } from '@/constant/product'
import { Variant } from '@/pages/product/product/product-change/variants/variant-table'

export interface TypeChangerProps {
  onChange?: (type: VariantType) => void
  value?: VariantType
}

export default function TypeChanger (props: TypeChangerProps) {
  const { value, onChange } = props
  const options = useVariantTypeOptions()
  const { modal } = App.useApp()
  const form = Form.useFormInstance()

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
      title: 'Are you sure to switch?',
      content: 'Switch to a single variant will clear the current variant settings. Are you sure to switch?',
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
      options={options}
    />
  )
}
