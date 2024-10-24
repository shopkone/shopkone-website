import { useTranslation } from 'react-i18next'
import { IconMapPin, IconTag, IconWorld } from '@tabler/icons-react'
import { Button, Card, Empty, Flex, Form, Input } from 'antd'

import Page from '@/components/page'
import { useShippingState } from '@/pages/mange/settings/shipping/state'

export default function Change () {
  const { t } = useTranslation('settings', { keyPrefix: 'shipping' })
  const locations = useShippingState().locations
  return (
    <Page bottom={64} back={'/settings/shipping'} width={700} title={t('添加自定义运费方案')}>
      <Flex gap={16} vertical>
        <Card title={t('方案名称')}>
          <Form.Item className={'mb0'} extra={t('该名称不会展示给客户查看')}>
            <Input />
          </Form.Item>
        </Card>
        <Card title={t('适用商品')}>
          <Empty
            image={<IconTag size={64} color={'#eee'} />}
            description={t('暂无数据')}
            style={{ paddingBottom: 24 }}
          >
            <Button type={'primary'}>
              {t('选择商品')}
            </Button>
          </Empty>
        </Card>
        <Card title={t('发货地点')}>
          <Empty
            image={<IconMapPin size={64} color={'#eee'} />}
            description={t('暂无数据')}
            style={{ paddingBottom: 24 }}
          >
            <Button type={'primary'}>
              {t('选择地点')}
            </Button>
          </Empty>
        </Card>
        <Card title={t('收货地点')}>
          <Empty
            image={<IconWorld size={64} color={'#eee'} />}
            description={t('暂无数据')}
            style={{ paddingBottom: 24 }}
          >
            <Button type={'primary'}>
              {t('选择国家/地区')}
            </Button>
          </Empty>
        </Card>
      </Flex>
    </Page>
  )
}
