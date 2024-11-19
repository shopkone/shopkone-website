import { useTranslation } from 'react-i18next'
import { Flex, Form } from 'antd'

import { CurrencyListRes, useCurrencyList } from '@/api/base/currency-list'
import SCard from '@/components/s-card'
import { useManageState } from '@/pages/mange/state'

import styles from './index.module.less'

export interface PaymentProps {
  currency?: CurrencyListRes
}

export default function Payment (props: PaymentProps) {
  const { currency } = props
  const { t } = useTranslation('orders', { keyPrefix: 'drafts' })
  const form = Form.useFormInstance()
  const storeCurrencyCode = useManageState(state => state.shopInfo?.store_currency)
  const currencies = useCurrencyList()
  const storeCurrency = currencies?.data?.find(currency => currency.code === storeCurrencyCode)

  return (
    <SCard title={t('收款')}>
      <Flex vertical className={'fit-width'} gap={12}>
        <Flex className={styles.payment} justify={'space-between'} align={'center'}>
          <div className={styles.paymentLabel}>
            {t('成本价')}
          </div>
          <Flex className={styles.paymentValue}>
            {storeCurrency?.code} {storeCurrency?.symbol}
            <div>{123}</div>
          </Flex>
        </Flex>
        <Flex className={styles.payment} justify={'space-between'} align={'center'}>
          <div className={styles.paymentLabel}>
            {t('小计')}
          </div>
          <Flex className={styles.paymentValue}>
            {currency?.code} {currency?.symbol}
            <div>{123}</div>
          </Flex>
        </Flex>
        <Flex className={styles.payment} justify={'space-between'} align={'center'}>
          <div className={styles.paymentLabel}>
            {t('折扣')}
          </div>
          <Flex className={styles.paymentValue}>
            - {currency?.code} {currency?.symbol}
            <div>{123}</div>
          </Flex>
        </Flex>
        <Flex className={styles.payment} justify={'space-between'} align={'center'}>
          <div className={styles.paymentLabel}>
            {t('运费')}
          </div>
          <Flex className={styles.paymentValue}>
            {currency?.code} {currency?.symbol}
            <div>{123}</div>
          </Flex>
        </Flex>
        <Flex className={styles.payment} justify={'space-between'} align={'center'}>
          <div className={styles.paymentLabel}>
            {t('税费')}
          </div>
          <Flex className={styles.paymentValue}>
            {currency?.code} {currency?.symbol}
            <div>{123}</div>
          </Flex>
        </Flex>
      </Flex>
    </SCard>
  )
}
