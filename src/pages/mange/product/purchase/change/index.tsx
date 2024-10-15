import { useRequest } from 'ahooks'
import { Button, Empty, Flex, Form, Input } from 'antd'

import { useCarriers } from '@/api/base/carriers'
import { useCurrencyList } from '@/api/base/currency-list'
import { LocationListApi } from '@/api/location/list'
import Page from '@/components/page'
import SCard from '@/components/s-card'
import SDatePicker from '@/components/s-date-picker'
import SSelect from '@/components/s-select'
import SelectVariants from '@/components/select-variants'
import { useOpen } from '@/hooks/useOpen'

import styles from './index.module.less'

export default function Change () {
  const openInfo = useOpen<number[]>([])
  const currencyList = useCurrencyList()
  const locations = useRequest(async () => await LocationListApi({ active: true }))
  const carriers = useCarriers()

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

  return (
    <Page
      width={950}
      title={'Create purchase order'}
      back={'/products/purchase_orders'}
    >
      <Form layout={'vertical'}>
        <div className={styles.card}>
          <Flex>
            <div className={styles.item}>
              <div className={styles.title}>Supplier</div>
              <SSelect
                dropdownStyle={{ minWidth: 300 }}
                placeholder={'Select supplier'}
                className={styles.select}
                variant={'borderless'}
              />
            </div>
            <div className={styles.item}>
              <div className={styles.title}>Destination</div>
              <SSelect
                loading={locations.loading}
                placeholder={'Shop location'}
                className={styles.select}
                variant={'borderless'}
                dropdownStyle={{ minWidth: 300 }}
              />
            </div>
          </Flex>
          <div className={'line'} style={{ margin: 0 }} />
          <Flex gap={16} style={{ padding: 16, paddingBottom: 0 }} >
            <Form.Item className={'flex1'} label={'Payment Terms'}>
              <SSelect options={paymentTerms} />
            </Form.Item>
            <Form.Item label={'Supplier currency'} className={'flex1'}>
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

        <SCard style={{ marginBottom: 16 }} title={'Shipping details'}>
          <Flex gap={16}>
            <Form.Item label={'Estimated delivery date'} className={'flex1 mb0'}>
              <SDatePicker rootClassName={'fit-width'} />
            </Form.Item>
            <Form.Item label={'Shipping carrier'} className={'flex1 mb0'}>
              <SSelect
                showSearch
                optionFilterProp={'label'}
                loading={carriers.loading}
                options={carriers.data?.map(item => ({ value: item.id, label: item.name }))}
              />
            </Form.Item>
            <Form.Item label={'Delivery number'} className={'flex1 mb0'}>
              <Input autoComplete={'off'} />
            </Form.Item>
          </Flex>
        </SCard>

        <SCard title={'Products'} className={'fit-width'}>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            style={{ padding: '32px 0' }}
            description={(
              <Flex style={{ marginTop: 16 }} vertical gap={12}>
                <div>
                  Only items with inventory tracking settings can be selected.
                </div>
                <div>
                  <Button onClick={() => {
                    openInfo.edit()
                  }}
                  >
                    Select products
                  </Button>
                </div>
              </Flex>
            )}
          />
        </SCard>

        <Flex gap={16}>
          <SCard className={'flex1'} title={'Cost summary'} style={{ marginTop: 16 }}>
            asd
          </SCard>

          <SCard className={'flex1'} title={'Remarks'} style={{ marginTop: 16 }}>
            asd
          </SCard>
        </Flex>

      </Form>

      <SelectVariants info={openInfo} />
    </Page>
  )
}
