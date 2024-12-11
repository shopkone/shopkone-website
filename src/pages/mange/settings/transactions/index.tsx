import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRequest } from 'ahooks'
import { Flex, Form, Radio, Switch } from 'antd'
import cloneDeep from 'lodash/cloneDeep'

import { TransactionInfoApi, TransactionReduceTime, TransactionTargetType } from '@/api/shop/transaction-info'
import { UpdateTransactionApi } from '@/api/shop/update-transaction'
import Page from '@/components/page'
import SCard from '@/components/s-card'
import SInputNumber from '@/components/s-input-number'
import { sMessage } from '@/components/s-message'
import SRender from '@/components/s-render'
import CardItem from '@/pages/mange/settings/transactions/card-item'
import { isEqualHandle } from '@/utils/is-equal-handle'

import styles from './index.module.less'

export default function Transactions () {
  const { t } = useTranslation('settings', { keyPrefix: 'transactions' })
  const info = useRequest(TransactionInfoApi)
  const update = useRequest(UpdateTransactionApi, { manual: true })
  const [form] = Form.useForm()
  const order_auto_cancel = Form.useWatch('order_auto_cancel', form)
  const [isChange, setIsChange] = useState(false)
  const init = useRef()

  const onValuesChange = (force?: boolean) => {
    const values = form.getFieldsValue()
    if (!init.current || force === true) {
      init.current = cloneDeep(values)
      return
    }
    const isSame = isEqualHandle(values, init.current)
    setIsChange(!isSame)
  }

  const onReset = () => {
    form.setFieldsValue(init.current)
    setIsChange(false)
  }

  const onOk = async () => {
    await update.runAsync(form.getFieldsValue())
    info.refresh()
    sMessage.success(t('交易设置更新成功'))
    setIsChange(false)
  }

  const timeOptions = [
    { label: t('30 分钟'), value: 30 },
    { label: t('24 小时'), value: 60 * 24 },
    { label: t('48 小时'), value: 60 * 48 },
    { label: t('不限时长'), value: 0 },
    {
      label: (
        <Flex align={'center'} gap={16}>
          {t('自定义')}
          <SRender render={order_auto_cancel === -1}>
            <Form.Item name={'order_auto_cancel_customer_hour'} className={'mb0'}>
              <SInputNumber precision={2} style={{ width: 120 }} suffix={t('小时')} />
            </Form.Item>
          </SRender>
        </Flex>
      ),
      value: -1
    }
  ]

  useEffect(() => {
    if (!info.data) return
    form.setFieldsValue(info.data)
    onValuesChange(true)
  }, [info.data])

  return (
    <Page
      onOk={onOk}
      onCancel={onReset}
      isChange={isChange}
      loading={info.loading}
      width={750}
      title={t('交易设置')}
    >
      <Form onValuesChange={onValuesChange} form={form}>
        <SCard>
          <div className={styles.title}>{t('订单取消功能')}</div>
          <div className={'tips'}>{t('选择顾客是否需要注册登录后才可结账')}</div>

          <Form.Item name={'target_type'}>
            <CardItem
              options={
                [{ title: t('游客或登录客户均可结账'), desc: t('所有顾客均可结账'), value: TransactionTargetType.All },
                  { title: t('仅限登录客户结账'), desc: t('店铺只支持登录客户结账'), value: TransactionTargetType.Login }]
              }
            />
          </Form.Item>

          <div className={styles.title}>{t('发起结账时扣减库存')}</div>
          <div className={'tips'}>{t('选择扣减库存时机')}</div>
          <Form.Item name={'reduce_time'}>
            <CardItem
              options={
                [{ title: t('发起结账时扣减库存'), desc: t('有效保证商品不会被超卖'), value: TransactionReduceTime.Pay },
                  { title: t('成功下单时扣减库存'), desc: t('可以有效避免产品库存被占用的问题'), value: TransactionReduceTime.Order }]
              }
            />
          </Form.Item>

          <div className={styles.title}>{t('商品状态检验')}</div>
          <Form.Item name={'is_force_check_product'}>
            <CardItem
              options={
                [{ title: t('商品状态不校验'), desc: t('创建订单后完成下单之前，存在商品下架情况客户也可以完成下单'), value: false },
                  { title: t('商品状态强校验'), desc: t('在付款之前，只要存在商品下架情况就会取消订单，提示客户重新下单'), value: true }]
              }
            />
          </Form.Item>

          <div className={styles.title}>{t('自动收货')}</div>
          <Flex align={'center'} style={{ marginTop: 12, marginLeft: -4 }} gap={8}>
            <Form.Item style={{ margin: 0 }} valuePropName={'checked'} name={'is_auto_finish'}>
              <Switch />
            </Form.Item>
            {t('未启用自动收货，订单需手动确认收货')}
          </Flex>
        </SCard>

        <SCard style={{ marginTop: 16 }}>
          <div className={styles.title}>{t('订单取消功能')}</div>
          <div className={'tips'}>{t('在一定时间内未付款就取消订单并释放库存的功能配置')}</div>

          <div style={{ marginTop: 8 }}>
            <div>{t('待付款订单取消时间设置')}</div>
            <Form.Item name={'order_auto_cancel'}>
              <Radio.Group className={styles.radio} options={timeOptions} />
            </Form.Item>
          </div>
        </SCard>
      </Form>
    </Page>
  )
}
