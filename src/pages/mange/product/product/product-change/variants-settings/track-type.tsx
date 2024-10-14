import { useRequest } from 'ahooks'
import { Checkbox, Form } from 'antd'

import { ListByVariantIdsUnApi } from '@/api/inventory/list-by-variantids-un'
import SLoading from '@/components/s-loading'
import { Variant } from '@/pages/mange/product/product/product-change/variants/state'

export interface TrackTypeProps {
  value?: boolean
  onChange?: (value: boolean) => void
}

export default function TrackType (props: TrackTypeProps) {
  const { value, onChange } = props
  const inventories = useRequest(ListByVariantIdsUnApi, { manual: true })
  const form = Form.useFormInstance()

  const onChangeHandle = (checked: boolean) => {
    if (!checked) {
      onChange?.(checked)
      return
    }
    let variants: Variant[] = form.getFieldValue('variants')
    if (!variants?.length) return
    const variantIds = variants.map((v) => v.id)
    inventories.runAsync({ ids: variantIds }).then(res => {
      variants = variants.map(v => {
        const item = res.filter(i => i.variant_id === v.id)
        return { ...v, inventories: item }
      })
      form.setFieldValue('variants', variants)
      onChange?.(checked)
    })
  }

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ position: 'absolute', zIndex: 1, top: 1, left: 0, background: '#fff' }}>
        <SLoading size={18} foreShow loading={inventories.loading} />
      </div>
      <Checkbox disabled={inventories.loading} onChange={e => { onChangeHandle(e.target.checked) }} checked={value}>
        <span style={{ position: 'relative', top: -1 }}>Inventory tracking</span>
      </Checkbox>
    </div>
  )
}
