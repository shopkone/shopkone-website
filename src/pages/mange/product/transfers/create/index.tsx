import { useNavigate } from 'react-router-dom'
import { useRequest } from 'ahooks'
import { Flex, Form } from 'antd'

import { LocationListApi } from '@/api/location/list'
import Page from '@/components/page'
import SCard from '@/components/s-card'
import SSelect from '@/components/s-select'
import { useI18n } from '@/hooks/use-lang'
import styles from '@/pages/mange/product/purchase/change/index.module.less'
import LocationItem from '@/pages/mange/product/transfers/create/location-item'
import Products from '@/pages/mange/product/transfers/create/products'

export default function Create () {
  const locations = useRequest(async () => await LocationListApi({ active: true }))
  const nav = useNavigate()
  const t = useI18n()
  const [form] = Form.useForm()

  return (
    <Page
      loading={locations.loading}
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
                <LocationItem locations={locations?.data} infoMode={false} onValuesChange={() => {}} />
              </Form.Item>
            </div>
            <div className={styles.item}>
              <div className={styles.title}>{t('目的地')}</div>
              <Form.Item className={'p0 m0'} name={'destination_id'}>
                <LocationItem locations={locations?.data} infoMode={false} onValuesChange={() => {}} />
              </Form.Item>
            </div>
          </Flex>
        </div>

        <Form.Item className={'mb0'} name={'variants'}>
          <Products />
        </Form.Item>

        <SCard title={'配送信息'} style={{ marginTop: 16 }}>
          <div style={{ maxWidth: 420 }}>
            <Form.Item label={'预计配送日期'}>
              <SSelect />
            </Form.Item>
            <Form.Item label={'运单号'}>
              <SSelect />
            </Form.Item>
            <Form.Item label={'运单承运商'}>
              <SSelect />
            </Form.Item>
          </div>
        </SCard>
      </Form>

    </Page>
  )
}
