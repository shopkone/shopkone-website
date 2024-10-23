import { useTranslation } from 'react-i18next'
import { Card, Flex, Form, Input } from 'antd'

import Page from '@/components/page'
import SLocation from '@/components/s-location'

export default function Change () {
  const { t } = useTranslation('settings', { keyPrefix: 'shipping' })

  return (
    <Page back={'/settings/shipping'} width={700} title={t('创建运费方案')}>
      <Flex gap={16} vertical>
        <Card title={t('档案名称')}>
          <Form.Item className={'mb0'} extra={t('客户将看不到此项')}>
            <Input />
          </Form.Item>
        </Card>
        <Card title={t('产品')}>asd</Card>
        <Card title={t('履行地点')}>
          <SLocation />
        </Card>
        <Card title={t('运输区域')}>asd</Card>
      </Flex>
    </Page>
  )
}
