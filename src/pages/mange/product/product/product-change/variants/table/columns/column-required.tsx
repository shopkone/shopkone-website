import { useTranslation } from 'react-i18next'
import { Checkbox, Tooltip } from 'antd'

import SRender from '@/components/s-render'
import { Variant } from '@/pages/mange/product/product/product-change/variants/state'

export interface ColumnPriceProps {
  onChange: (is: boolean) => void
  row: Variant
  type: 'tax_required' | 'shipping_required'
}

export default function ColumnRequired (props: ColumnPriceProps) {
  const { onChange, row, type } = props

  const allChecked = row?.children?.every(i => i?.[type])
  const someChecked = row?.children?.some(i => i?.[type])
  const { t } = useTranslation('product')

  return (
    <div>
      <SRender render={row.children?.length}>
        <Tooltip title={t('同时修改x个款式', { count: row?.children?.length })}>
          <Checkbox indeterminate={!allChecked && someChecked} checked={allChecked} onChange={e => { onChange(e.target.checked) }}>
            {
              type === 'shipping_required' ? t('需要运输发货') : t('收取税费')
            }
          </Checkbox>
        </Tooltip>
      </SRender>
      <SRender render={!row.children?.length}>
        <Checkbox checked={row[type]} onChange={e => { onChange(e.target.checked) }}>
          {
            type === 'shipping_required' ? t('需要运输发货') : t('收取税费')
          }
        </Checkbox>
      </SRender>
    </div>
  )
}
