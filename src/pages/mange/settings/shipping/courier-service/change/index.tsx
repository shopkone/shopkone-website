import { useTranslation } from 'react-i18next'
import { useRequest } from 'ahooks'
import { Card, Flex, Form, Input } from 'antd'

import { LocationListApi } from '@/api/location/list'
import Page from '@/components/page'
import Locations from '@/pages/mange/settings/shipping/courier-service/change/locations'
import Products from '@/pages/mange/settings/shipping/courier-service/change/products'
import Zones from '@/pages/mange/settings/shipping/courier-service/change/zones'

export default function Change () {
  const { t } = useTranslation('settings', { keyPrefix: 'shipping' })
  const locations = useRequest(async () => await LocationListApi({ active: true }))
  const [form] = Form.useForm()

  return (
    <Page
      loading={locations.loading}
      bottom={64}
      back={'/settings/shipping'}
      width={700}
      title={t('添加自定义运费方案')}
    >
      <Form form={form}>
        <Flex gap={16} vertical>
          <Card title={t('方案名称')}>
            <Form.Item name={'name'} className={'mb0'} extra={t('该名称不会展示给客户查看')}>
              <Input autoComplete={'off'} />
            </Form.Item>
          </Card>

          <Form.Item className={'mb0'} name={'product_ids'}>
            <Products />
          </Form.Item>

          <Form.Item className={'mb0'} name={'location_ids'}>
            <Locations locations={locations.data || []} />
          </Form.Item>

          <Form.Item className={'mb0'} name={'zones'}>
            <Zones />
          </Form.Item>
        </Flex>
      </Form>
    </Page>
  )
}
