import { useNavigate } from 'react-router-dom'
import { useRequest } from 'ahooks'
import { Flex, Form, Input } from 'antd'

import { useCarriers } from '@/api/base/carriers'
import { LocationListApi } from '@/api/location/list'
import Page from '@/components/page'
import SCard from '@/components/s-card'
import SDatePicker from '@/components/s-date-picker'
import SSelect from '@/components/s-select'
import { useI18n } from '@/hooks/use-lang'
import styles from '@/pages/mange/product/purchase/change/index.module.less'
import LocationItem from '@/pages/mange/product/transfers/create/location-item'
import Products from '@/pages/mange/product/transfers/create/products'

export default function Create () {
  const locations = useRequest(async () => await LocationListApi({ active: true }))
  const carriers = useCarriers()
  const nav = useNavigate()
  const t = useI18n()
  const [form] = Form.useForm()

  const originId = Form.useWatch('origin_id', form)
  const destinationId = Form.useWatch('destination_id', form)

  return (
    <Page
      bottom={64}
      loading={locations.loading || carriers.loading}
      back={'/products/transfers'}
      width={950}
      title={'创建转移'}
      type={'product'}
    >
      <Form layout={'vertical'} form={form}>
        <div className={styles.card}>
          <Flex>
            <div className={styles.item}>
              <div className={styles.title}>{t('发货地')}</div>
              <Form.Item className={'p0 m0'} name={'origin_id'}>
                <LocationItem
                  disabledId={destinationId}
                  placeHolder={t('选择发货地')}
                  locations={locations?.data}
                  infoMode={false}
                  onValuesChange={() => {}}
                />
              </Form.Item>
            </div>
            <div className={styles.item}>
              <div className={styles.title}>{t('目的地')}</div>
              <Form.Item className={'p0 m0'} name={'destination_id'}>
                <LocationItem
                  disabledId={originId}
                  placeHolder={t('选择目的地')}
                  locations={locations?.data}
                  infoMode={false}
                  onValuesChange={() => {}}
                />
              </Form.Item>
            </div>
          </Flex>
        </div>

        <Form.Item className={'mb0'} name={'variants'}>
          <Products />
        </Form.Item>

        <SCard title={'配送信息'} style={{ marginTop: 16 }}>
          <div style={{ maxWidth: 420 }}>
            <div>
              <Form.Item name={'estimated_arrival'} label={t('预计配送日期')}>
                <SDatePicker allowClear />
              </Form.Item>
            </div>
            <Form.Item label={'物流提供商'}>
              <SSelect
                allowClear
                showSearch
                optionFilterProp={'label'}
                options={carriers.data?.map(item => ({ value: item.id, label: item.name }))}
              />
            </Form.Item>
            <Form.Item
              name={'delivery_number'}
              label={t('物流单号')}
            >
              <Input autoComplete={'off'} />
            </Form.Item>
          </div>
        </SCard>
      </Form>

    </Page>
  )
}
