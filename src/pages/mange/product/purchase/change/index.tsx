import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useRequest } from 'ahooks'
import { Flex, Form, Input } from 'antd'
import dayjs, { Dayjs } from 'dayjs'

import { useCarriers } from '@/api/base/carriers'
import { useCurrencyList } from '@/api/base/currency-list'
import { LocationListApi } from '@/api/location/list'
import { PurchaseCreateApi } from '@/api/purchase/create'
import { PurchaseInfoApi } from '@/api/purchase/info'
import Page from '@/components/page'
import SCard from '@/components/s-card'
import SDatePicker from '@/components/s-date-picker'
import { sMessage } from '@/components/s-message'
import SSelect from '@/components/s-select'
import { useI18n } from '@/hooks/use-lang'
import CostSummary from '@/pages/mange/product/purchase/change/cost-summary'
import Products from '@/pages/mange/product/purchase/change/products'
import Supplier from '@/pages/mange/product/purchase/change/supplier'

import styles from './index.module.less'

export default function Change () {
  const currencyList = useCurrencyList()
  const locations = useRequest(async () => await LocationListApi({ active: true }))
  const carriers = useCarriers()
  const [form] = Form.useForm()
  const t = useI18n()
  const create = useRequest(PurchaseCreateApi, { manual: true })
  const info = useRequest(PurchaseInfoApi, { manual: true })
  const { id } = useParams()

  const paymentTerms = [
    { value: 0, label: 'None' },
    { value: 1, label: 'Cash on delivery' },
    { value: 2, label: 'Cash on receipt' },
    { value: 3, label: 'Payment on receipt' },
    { value: 4, label: 'Payment in advance' },
    { value: 5, label: 'Net 7' },
    { value: 6, label: 'Net 15' },
    { value: 7, label: 'Net 30' },
    { value: 8, label: 'Net 45' },
    { value: 9, label: 'Net 60' }
  ]

  const onOk = async () => {
    await form.validateFields()
    const { estimated_arrival, ...rest } = form.getFieldsValue()
    const values = {
      ...rest,
      estimated_arrival: estimated_arrival ? (estimated_arrival as Dayjs).unix() : undefined
    }
    if (!values?.purchase_items) {
      sMessage.warning('Please select items')
      return
    }
    if (!values.supplier_id) {
      sMessage.warning('Please select supplier')
      return
    }
    await create.runAsync(values)
  }

  useEffect(() => {
    if (id) return
    if (!locations.data || form.getFieldValue('destination_id')) return
    form.setFieldsValue({ destination_id: locations.data[0].id })
  }, [locations.data])

  useEffect(() => {
    if (id) return
    if (!currencyList.data?.length) return
    form.setFieldsValue({ currency_code: currencyList.data[0].code })
  }, [currencyList.data])

  useEffect(() => {
    if (id) return
    form.setFieldValue('payment_terms', 0)
  }, [])

  useEffect(() => {
    if (!id) return
    info.runAsync({ id: Number(id) }).then(res => {
      const { estimated_arrival, ...rest } = res
      form.setFieldsValue({
        ...rest,
        estimated_arrival: estimated_arrival ? dayjs(estimated_arrival * 1000) : undefined
      })
    })
  }, [id])

  return (
    <Page
      loading={locations.loading || carriers.loading || currencyList.loading || info.loading}
      onOk={onOk}
      isChange={true}
      bottom={64}
      type={'product'}
      width={950}
      title={t('Create purchase order')}
      back={'/products/purchase_orders'}
    >
      <Form form={form} layout={'vertical'}>
        <div className={styles.card}>
          <Flex>
            <div className={styles.item}>
              <div className={styles.title}>{t('Supplier')}</div>
              <Form.Item style={{ margin: 0 }} name={'supplier_id'}>
                <Supplier />
              </Form.Item>
            </div>
            <div className={styles.item}>
              <div className={styles.title}>{t('Destination')}</div>
              <Form.Item style={{ margin: 0, padding: 0 }} name={'destination_id'}>
                <SSelect
                  options={locations.data?.map(item => ({ value: item.id, label: item.name }))}
                  loading={locations.loading}
                  placeholder={t('Select location')}
                  className={styles.select}
                  variant={'borderless'}
                  dropdownStyle={{ minWidth: 300 }}
                />
              </Form.Item>
            </div>
          </Flex>
          <div className={'line'} style={{ margin: 0 }} />
          <Flex gap={16} style={{ padding: 16, paddingBottom: 0 }} >
            <Form.Item name={'payment_terms'} className={'flex1'} label={t('Payment Terms')}>
              <SSelect options={paymentTerms} />
            </Form.Item>
            <Form.Item name={'currency_code'} label={t('Supplier currency')} className={'flex1'}>
              <SSelect
                loading={currencyList.loading}
                listHeight={400}
                showSearch
                optionFilterProp={'label'}
                options={currencyList.data?.map(item => ({ value: item.code, label: item.title }))}
              />
            </Form.Item>
          </Flex>
        </div>

        <SCard style={{ marginBottom: 16 }} title={t('Shipping details')}>
          <Flex gap={16}>
            <Form.Item name={'estimated_arrival'} label={t('Estimated Arrival')} className={'flex1 mb0'}>
              <SDatePicker allowClear rootClassName={'fit-width'} />
            </Form.Item>
            <Form.Item name={'carrier_id'} label={t('Shipping carrier')} className={'flex1 mb0'}>
              <SSelect
                allowClear
                showSearch
                optionFilterProp={'label'}
                loading={carriers.loading}
                options={carriers.data?.map(item => ({ value: item.id, label: item.name }))}
              />
            </Form.Item>
            <Form.Item
              name={'delivery_number'}
              label={t('Delivery number')}
              className={'flex1 mb0'}
            >
              <Input autoComplete={'off'} />
            </Form.Item>
          </Flex>
        </SCard>

        <Form.Item name={'purchase_items'}>
          <Products />
        </Form.Item>

        <Flex gap={16}>
          <Form.Item className={'mb0 flex1'} name={'adjust'}>
            <CostSummary />
          </Form.Item>

          <SCard className={'flex1'} title={t('Remarks')} style={{ marginTop: 16 }}>
            <Form.Item className={'mb0'} name={'remarks'}>
              <Input.TextArea autoSize={{ minRows: 4 }} />
            </Form.Item>
          </SCard>
        </Flex>
      </Form>

    </Page>
  )
}
