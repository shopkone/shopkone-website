export const getPaymentTerms = (t: any) => {
  return [
    { value: 0, label: t('None') },
    { value: 1, label: t('Cash on delivery') },
    { value: 2, label: t('Cash on receipt') },
    { value: 3, label: t('Payment on receipt') },
    { value: 4, label: t('Payment in advance') },
    { value: 5, label: t('Net 7') },
    { value: 6, label: t('Net 15') },
    { value: 7, label: t('Net 30') },
    { value: 8, label: t('Net 45') },
    { value: 9, label: t('Net 60') }
  ]
}

export const getAdjustTypeOptions = (t: any) => [
  { label: t('Customs duties'), value: 1 }, // 税
  { label: t('Discount'), value: 2 }, // 折扣
  { label: t('Foreign transaction fee'), value: 3 }, // 国外交易费
  { label: t('Freight fee'), value: 4 }, // 运费
  { label: t('Insurance'), value: 5 }, // 保险
  { label: t('Rush fee'), value: 6 }, // 加急费
  { label: t('Surcharge'), value: 7 }, // 附加费
  { label: t('Others'), value: 8 } // 其他
]
