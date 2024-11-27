import { useTranslation } from 'react-i18next'
import { Button, Flex, Form, Typography } from 'antd'

import { CurrencyListRes, useCurrencyList } from '@/api/base/currency-list'
import { OrderCalPreRes, OrderPreBaseDiscount } from '@/api/order/pre-cal-order'
import SCard from '@/components/s-card'
import { useOpen } from '@/hooks/useOpen'
import DiscountTotalModal from '@/pages/mange/order/draft/change/discount-total-modal'
import { useManageState } from '@/pages/mange/state'

import styles from './index.module.less'

export interface PaymentProps {
  currency?: CurrencyListRes
  info?: OrderCalPreRes
  loading?: boolean
}

export default function Payment (props: PaymentProps) {
  const { currency, info, loading } = props
  const { t } = useTranslation('orders', { keyPrefix: 'drafts' })
  const storeCurrencyCode = useManageState(state => state.shopInfo?.store_currency)
  const currencies = useCurrencyList()
  const storeCurrency = currencies?.data?.find(currency => currency.code === storeCurrencyCode)
  const form = Form.useFormInstance()
  const products = Form.useWatch('variants', form)
  const discount = Form.useWatch('discount', form)
  const discountOpen = useOpen<OrderPreBaseDiscount>()

  return (
    <SCard title={t('收款')}>
      <Flex vertical className={'fit-width'} gap={0}>
        <Flex className={styles.payment} justify={'space-between'} align={'center'}>
          <div className={styles.paymentLabel}>
            {t('成本价')}
          </div>
          <Flex className={styles.paymentValue} align={'center'}>
            {storeCurrency?.code} {storeCurrency?.symbol}
            {info?.cost_price}
          </Flex>
        </Flex>
        <Flex className={styles.payment} justify={'space-between'} align={'center'}>
          <div className={styles.paymentLabel}>
            {t('小计')}
          </div>
          <Flex className={styles.paymentValue} align={'center'}>
            {currency?.code} {currency?.symbol}
            {info?.sum_price}
          </Flex>
        </Flex>
        <Flex className={styles.payment} justify={'space-between'} align={'center'}>
          <div className={styles.paymentLabel}>
            <Button
              onClick={() => {
                discountOpen.edit(form.getFieldValue('discount'))
              }}
              disabled={!products?.length}
              type={'link'}
              style={{
                padding: 0,
                fontSize: 13,
                height: 16,
                marginLeft: -1
              }}
            >
              {!products?.length ? t('折扣') : t('设置折扣')}
            </Button>
            <div style={{ position: 'absolute', left: 150 }}>
              <Typography.Text ellipsis={{ tooltip: true }} style={{ width: 200 }}>
                {discount?.price ? (discount?.note || '--') : undefined}
              </Typography.Text>
            </div>
          </div>
          <Flex className={styles.paymentValue} align={'center'}>
            - {currency?.code} {currency?.symbol}
            <Form.Item
              style={{
                height: 18,
                position: 'relative',
                top: -7
              }} className={'mb0'} name={'discount'}
            >
              <DiscountTotalModal price={info?.sum_price || 0} openInfo={discountOpen} />
            </Form.Item>
          </Flex>
        </Flex>
        <Flex className={styles.payment} justify={'space-between'} align={'center'}>
          <div className={styles.paymentLabel}>
            <Button
              disabled={!products?.length}
              type={'link'}
              style={{
                padding: 0,
                fontSize: 13,
                height: 16,
                marginLeft: -1
              }}
            >
              {!products?.length ? t('运费') : t('设置运费')}
            </Button>
            <div style={{ position: 'absolute', left: 150 }}>
              <Typography.Text ellipsis={{ tooltip: true }} style={{ width: 200 }}>
                {info?.taxes?.map((item) => `${item.name || 'TAX'} ${item.rate}%`).join('; ')}
              </Typography.Text>
            </div>
          </div>
          <Flex className={styles.paymentValue}>
            {currency?.code} {currency?.symbol}
            123
          </Flex>
        </Flex>
        <Flex
          style={{
            borderBottom: 'none',
            marginBottom: 0
          }}
          className={styles.payment}
          justify={'space-between'}
          align={'center'}
        >
          <Flex style={{ position: 'relative' }} align={'center'} className={styles.paymentLabel}>
            {t('税费')}
            <div style={{ position: 'absolute', left: 150 }}>
              <Typography.Text ellipsis={{ tooltip: true }} style={{ width: 200 }}>
                {info?.taxes?.map((item) => `${item.name || 'TAX'} ${item.rate}%`).join('; ')}
              </Typography.Text>
            </div>
          </Flex>
          <Flex className={styles.paymentValue}>
            {currency?.code} {currency?.symbol}
            <div>
              {info?.taxes?.reduce((pre, cur) => pre + cur.price, 0)}
            </div>
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
            {t('合计')}
          </div>
          <Flex className={styles.paymentValue}>
            {currency?.code} {currency?.symbol}
            <div>{info?.total}</div>
          </Flex>
        </Flex>
      </Flex>

    </SCard>
  )
}
