import { PurchaseStatus } from '@/api/purchase/info'
import Status from '@/components/status'

export const getPaymentTerms = (t: any) => {
  return [
    { value: 0, label: t('无') },
    { value: 1, label: t('货到付款') },
    { value: 2, label: t('收货付款') },
    { value: 3, label: t('收到发票付款') },
    { value: 4, label: t('预付款') },
    { value: 5, label: t('7天内付款') },
    { value: 6, label: t('15天内付款') },
    { value: 7, label: t('30天内付款') },
    { value: 8, label: t('45天内付款') },
    { value: 9, label: t('60天内付款') }
  ]
}

export const getAdjustTypeOptions = (t: any) => [
  { label: t('关税'), value: 1 },
  { label: t('折扣'), value: 2 },
  { label: t('外汇交易费'), value: 3 },
  { label: t('运费'), value: 4 },
  { label: t('保险费'), value: 5 },
  { label: t('加急费'), value: 6 },
  { label: t('附加费'), value: 7 },
  { label: t('其他'), value: 8 }
]

export const getPurchaseStatus = (t: any, status?: PurchaseStatus, borderless?: boolean) => {
  switch (status) {
    case PurchaseStatus.Closed:
      return <Status borderless={borderless} type={'error'}>{t('已关闭')}</Status>
    case PurchaseStatus.Draft:
      return <Status borderless={borderless} type={'default'}>{t('草稿')}</Status>
    case PurchaseStatus.Ordered:
      return <Status borderless={borderless} type={'info'}>{t('已订购')}</Status>
    case PurchaseStatus.PartialReceived:
      return <Status borderless={borderless} type={'warning'}>{t('部分处理')}</Status>
    case PurchaseStatus.Received:
      return <Status borderless={borderless} type={'success'}>{t('已完成')}</Status>
  }
  return ''
}
