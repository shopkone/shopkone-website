import { useMemo } from 'react'
import { Button, Flex, Form } from 'antd'

import { PurchaseItem } from '@/api/purchase/create'
import SCard from '@/components/s-card'
import SRender from '@/components/s-render'
import { useI18n } from '@/hooks/use-lang'
import { useOpen } from '@/hooks/useOpen'
import Adjust, { AdjustItem } from '@/pages/mange/product/purchase/change/adjust'
import styles from '@/pages/mange/product/purchase/change/index.module.less'
import { formatPrice, roundPrice } from '@/utils/num'

export interface CostSummaryProps {
  value?: AdjustItem[]
  onChange?: (value: AdjustItem[]) => void
}

export default function CostSummary (props: CostSummaryProps) {
  const { value, onChange } = props
  const form = Form.useFormInstance()
  const items: PurchaseItem[] = Form.useWatch('purchase_items', form)
  const t = useI18n()
  const info = useOpen<AdjustItem[]>()

  const summary = useMemo(() => {
    if (!items?.length) return { total: 0, taxFee: 0 }
    let total = 0
    let taxFee = 0
    items.forEach(it => {
      total += (it.total || 0)
      taxFee += ((it.cost * it.purchasing * it.tax_rate * 0.01) || 0)
    })
    return { total: roundPrice(total), taxFee: roundPrice(taxFee) }
  }, [items])

  const total = roundPrice(useMemo(() => {
    if (!value?.length) return summary.total || 0
    return summary.total + value.reduce((pre, cur) => {
      if (cur.type === 2) {
        return pre - cur.price
      } else {
        return pre + cur.price
      }
    }, 0)
  }, [summary]))

  console.log(total)

  const AdjustTypeOptions = [
    { label: 'Customs duties', value: 1 }, // 税
    { label: 'Discount', value: 2 }, // 折扣
    { label: 'Foreign transaction fee', value: 3 }, // 国外交易费
    { label: 'Freight fee', value: 4 }, // 运费
    { label: 'Insurance', value: 5 }, // 保险
    { label: 'Rush fee', value: 6 }, // 保险
    { label: 'Surcharge', value: 7 }, // 加急费
    { label: 'Others', value: 8 } // 其他
  ]

  return (
    <SCard
      extra={
        <Button onClick={() => { info.edit(value) }} type={'link'} size={'small'}>
          {t('Edit')}
        </Button>
      }
      title={t('Cost summary')}
      style={{ marginTop: 16 }}
    >
      <Flex gap={6} vertical>
        <div className={styles.detailsTitle}>
          <Flex justify={'space-between'} align={'center'}>
            {t('Tax fee')}
            <div>{formatPrice(summary.taxFee, '$')}</div>
          </Flex>
        </div>
        <div className={styles.detailsTitle}>
          <Flex justify={'space-between'} align={'center'}>
            {t('Subtotal')}
            <div>{formatPrice(summary.total, '$')}</div>
          </Flex>
        </div>
        <div className={'secondary'}>{t(`${items?.length || 0} items`)}</div>
      </Flex>

      <SRender render={value?.length}>
        <Flex style={{ marginTop: 16 }} gap={6} vertical>
          <div className={styles.detailsTitle}>{t('Cost adjustment')}</div>
          {
            value?.map(i => (
              <Flex key={i.id} align={'center'} justify={'space-between'}>
                <div>{AdjustTypeOptions.find(ii => ii.value === i.type)?.label}</div>
                <div>{formatPrice(i.price, '$')}</div>
              </Flex>
            ))
          }
        </Flex>
      </SRender>

      <div className={'line'} />

      <Flex align={'center'} justify={'space-between'} className={styles.detailsTitle}>
        {t('Total')}
        <div>{formatPrice(total, '$')}</div>
      </Flex>

      <Adjust info={info} onConfirm={(v) => { onChange?.(v) }} />
    </SCard>
  )
}
