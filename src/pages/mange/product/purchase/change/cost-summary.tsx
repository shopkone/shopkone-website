import { ReactNode, useMemo } from 'react'
import { Button, Flex, Form } from 'antd'

import { PurchaseItem } from '@/api/purchase/base'
import SCard from '@/components/s-card'
import SRender from '@/components/s-render'
import { getAdjustTypeOptions } from '@/constant/purchase'
import { useI18n } from '@/hooks/use-lang'
import { useOpen } from '@/hooks/useOpen'
import Adjust, { AdjustItem } from '@/pages/mange/product/purchase/change/adjust'
import styles from '@/pages/mange/product/purchase/change/index.module.less'
import { formatPrice, roundPrice } from '@/utils/num'

export interface CostSummaryProps {
  value?: AdjustItem[]
  onChange?: (value: AdjustItem[]) => void
  infoMode: ReactNode
}

export default function CostSummary (props: CostSummaryProps) {
  const { value, onChange, infoMode } = props
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
  }, [items, value])

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

  const AdjustTypeOptions = getAdjustTypeOptions(t)

  return (
    <SCard
      extra={
        infoMode
          ? ''
          : (
            <Button onClick={() => { info.edit(value) }} type={'link'} size={'small'}>
              {t('Edit')}
            </Button>
            )
      }
      title={t('成本汇总')}
      style={{ marginTop: 16 }}
    >
      <Flex gap={6} vertical>
        <div className={styles.detailsTitle}>
          <Flex justify={'space-between'} align={'center'}>
            {t('税费')}
            <div>{formatPrice(summary.taxFee, '$')}</div>
          </Flex>
        </div>
        <div className={styles.detailsTitle}>
          <Flex justify={'space-between'} align={'center'}>
            {t('小计')}
            <div>{formatPrice(summary.total, '$')}</div>
          </Flex>
        </div>
        <div className={'secondary'}>{t('商品数', { count: items?.length || 0 })}</div>
      </Flex>

      <SRender render={value?.length}>
        <Flex style={{ marginTop: 16 }} gap={6} vertical>
          <div className={styles.detailsTitle}>{t('成本调整')}</div>
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
        {t('合计')}
        <div>{formatPrice(total, '$')}</div>
      </Flex>

      <Adjust info={info} onConfirm={(v) => { onChange?.(v) }} />
    </SCard>
  )
}
