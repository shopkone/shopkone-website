import { useTranslation } from 'react-i18next'
import { IconTax } from '@tabler/icons-react'
import { Button, Checkbox, Empty, Flex, Form, Input } from 'antd'

import Page from '@/components/page'
import SCard from '@/components/s-card'
import SInputNumber from '@/components/s-input-number'

export default function TaxInfo () {
  const { t } = useTranslation('settings', { keyPrefix: 'tax' })
  return (
    <Page width={700} back={'/settings/taxes'}>
      <Flex vertical gap={16}>
        <SCard title={t('全境税率')}>
          <Form.Item style={{ width: 300 }}>
            <SInputNumber suffix={'%'} />
          </Form.Item>
          <div className={'line'} />
          <Form.Item className={'mb0'}>
            <Checkbox>{t('在结账时允许消费者查看消费税说明')}</Checkbox>
          </Form.Item>
          <Form.Item className={'mb0'}>
            <Input.TextArea autoSize={{ minRows: 4 }} />
          </Form.Item>
        </SCard>
        <SCard
          tips={t('发货到指定区域时，为特定产品系列自定义基于区域的税率或运费。')}
          title={t('自定义税费')}
        >
          <Empty
            image={
              <div style={{ paddingTop: 24 }}>
                <IconTax size={64} color={'#ddd'} />
              </div>
            }
            description={(
              <div className={'secondary'}>
                {t('发货到指定区域时，为特定产品系列自定义基于区域的税率或运费。')}
              </div>
            )}
            style={{ paddingBottom: 32, marginTop: -12 }}
          >
            <Button>
              {t('添加自定义税费')}
            </Button>
          </Empty>
        </SCard>
      </Flex>
    </Page>
  )
}
