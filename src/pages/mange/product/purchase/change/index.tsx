import { useEffect, useState } from 'react'
import { useRequest } from 'ahooks'
import { Button, Flex, Form, Input } from 'antd'

import { useCarriers } from '@/api/base/carriers'
import { useCurrencyList } from '@/api/base/currency-list'
import { LocationListApi } from '@/api/location/list'
import Page from '@/components/page'
import SCard from '@/components/s-card'
import SDatePicker from '@/components/s-date-picker'
import SSelect from '@/components/s-select'
import { useI18n } from '@/hooks/use-lang'
import { useOpen } from '@/hooks/useOpen'
import CreateSupplier from '@/pages/mange/product/purchase/change/create-supplier'
import Products from '@/pages/mange/product/purchase/change/products'

import styles from './index.module.less'

export default function Change () {
  const currencyList = useCurrencyList()
  const locations = useRequest(async () => await LocationListApi({ active: true }))
  const carriers = useCarriers()
  const [form] = Form.useForm()
  const carrier_id = Form.useWatch('carrier_id', form)
  const carrierItem = carriers.data?.find(item => item.id === carrier_id)
  const t = useI18n()
  const [openSelect, setOpenSelect] = useState(false)

  const supplierInfo = useOpen()

  const paymentTerms = [
    { value: 0, label: 'None' },
    { value: 2, label: 'Cash on delivery' },
    { value: 3, label: 'Cash on receipt' },
    { value: 4, label: 'Payment on receipt' },
    { value: 5, label: 'Payment in advance' },
    { value: 6, label: 'Net 7' },
    { value: 7, label: 'Net 15' },
    { value: 7, label: 'Net 30' },
    { value: 8, label: 'Net 45' },
    { value: 8, label: 'Net 60' }
  ]

  useEffect(() => {
    if (!locations.data || form.getFieldValue('destination_id')) return
    form.setFieldsValue({ destination_id: locations.data[0].id })
  }, [locations.data])

  return (
    <Page
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
              <SSelect
                open={openSelect}
                onDropdownVisibleChange={setOpenSelect}
                dropdownStyle={{ minWidth: 300 }}
                placeholder={t('Select supplier')}
                className={styles.select}
                variant={'borderless'}
                dropdownRender={node => (
                  <Flex vertical>
                    {node}
                    <div className={'line'} />
                    <div style={{ marginBottom: 6, marginLeft: 8, marginTop: -4 }}>
                      <Button
                        onClick={() => {
                          setOpenSelect(false)
                          supplierInfo.edit()
                        }}
                        size={'small'}
                        type={'text'}
                        className={'primary-text'}
                      >
                        Create new supplier
                      </Button>
                    </div>
                  </Flex>
                )}
              />
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
            <Form.Item name={'estimated_delivery_date'} label={t('Estimated delivery date')} className={'flex1 mb0'}>
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
              rules={[{ pattern: new RegExp(carrierItem?.pattern || '', carrierItem?.pattern_options), message: 'asd' }]}
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
          <SCard
            extra={
              <Button type={'text'} className={'primary-text'}>{t('Edit')}</Button>
            }
            className={'flex1'}
            title={t('Cost summary')}
            style={{ marginTop: 16 }}
          >
            <Flex gap={6} vertical>
              <div className={styles.detailsTitle}>
                {t('Tax fee')}
              </div>
              <div className={styles.detailsTitle}>
                {t('Subtotal')}
              </div>
              <div className={'secondary'}>{t('0 items')}</div>
            </Flex>

            <Flex style={{ marginTop: 16 }} gap={6} vertical>
              <div className={styles.detailsTitle}>{t('Cost adjustment')}</div>
              <div>{t('Overseas transaction fee')}</div>
            </Flex>

            <div className={'line'} />

            <div className={styles.detailsTitle}>
              {t('Total')}
            </div>

          </SCard>

          <SCard className={'flex1'} title={t('Remarks')} style={{ marginTop: 16 }}>
            <Input.TextArea autoSize={{ minRows: 7 }} />
          </SCard>
        </Flex>
      </Form>

      <CreateSupplier info={supplierInfo} />
    </Page>
  )
}
