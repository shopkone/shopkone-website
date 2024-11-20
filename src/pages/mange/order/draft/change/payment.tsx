import { useTranslation } from 'react-i18next'
import { useMemoizedFn } from 'ahooks'
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
  const products = Form.useWatch('variants', form)

  const RenderPrice = useMemoizedFn((p: { value?: string }) => {
    return p?.value || 0
  })

  return (
    <SCard title={t('收款')}>
      <Flex vertical className={'fit-width'} gap={0}>
        <Flex className={styles.payment} justify={'space-between'} align={'center'}>
          <div className={styles.paymentLabel}>
            {t('成本价')}
          </div>
          <Flex className={styles.paymentValue} align={'center'}>
            {storeCurrency?.code} {storeCurrency?.symbol}
            <Form.Item style={{ height: 18, position: 'relative', top: -7 }} className={'mb0'} name={'cost'}>
              <RenderPrice />
            </Form.Item>
          </Flex>
        </Flex>
        <Flex style={{ fontWeight: 'bolder' }} className={styles.payment} justify={'space-between'} align={'center'}>
          <div className={styles.paymentLabel}>
            {t('小计')}
          </div>
          <Flex className={styles.paymentValue} align={'center'}>
            {currency?.code} {currency?.symbol}
            <Form.Item style={{ height: 18, position: 'relative', top: -7 }} className={'mb0'} name={'cost'}>
              <RenderPrice />
            </Form.Item>
          </Flex>
        </Flex>
        <Flex className={styles.payment} justify={'space-between'} align={'center'}>
          <div className={styles.paymentLabel}>
            {t('折扣')}
          </div>
          <Flex className={styles.paymentValue} align={'center'}>
            - {currency?.code} {currency?.symbol}
            <Form.Item style={{ height: 18, position: 'relative', top: -7 }} className={'mb0'} name={'cost'}>
              <RenderPrice />
            </Form.Item>
          </Flex>
        </Flex>
        <Flex className={styles.payment} justify={'space-between'} align={'center'}>
          <div className={styles.paymentLabel}>
            {t('运费')}
          </div>
          <Flex className={styles.paymentValue}>
            {currency?.code} {currency?.symbol}
            123
          </Flex>
        </Flex>
        <Flex
          style={{ borderBottom: 'none', marginBottom: 0 }}
          className={styles.payment}
          justify={'space-between'}
          align={'center'}
        >
          <div className={styles.paymentLabel}>
            {t('税费')}
          </div>
          <Flex className={styles.paymentValue}>
            {currency?.code} {currency?.symbol}
            <div>{123}</div>
          </Flex>
        </Flex>

        <div className={styles.line} />

        <Flex
          style={{ marginTop: -8, marginBottom: -8, fontWeight: 'bolder' }}
          className={styles.payment}
          justify={'space-between'}
          align={'center'}
        >
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
