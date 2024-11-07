import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { IconCircleCheckFilled } from '@tabler/icons-react'
import { useRequest } from 'ahooks'
import { Alert, Button, Flex, Form, Input, StepProps, Steps } from 'antd'

import { DomainConnectCheckApi } from '@/api/domain/connect-check'
import { DomainPreCheckApi } from '@/api/domain/pre-check'
import SCard from '@/components/s-card'
import SModal from '@/components/s-modal'
import SRender from '@/components/s-render'
import STable, { STableProps } from '@/components/s-table'
import { UseOpenType } from '@/hooks/useOpen'

export interface ConnectDomainProps {
  openInfo: UseOpenType<string>
  onFresh: () => void
}

export default function ConnectDomain (props: ConnectDomainProps) {
  const { openInfo, onFresh } = props
  const { t } = useTranslation('settings', { keyPrefix: 'domains' })
  const preCheck = useRequest(DomainPreCheckApi, { manual: true })
  const connectCheck = useRequest(DomainConnectCheckApi, { manual: true })
  const [current, setCurrent] = useState(0)
  const [form] = Form.useForm()
  const domain = Form.useWatch('domain', form)
  const onNext = async () => {
    if (current === 0) {
      await form.validateFields()
      const { domain } = form.getFieldsValue()
      await preCheck.runAsync({ domain })
    }
    if (current === 1) {
      await connectCheck.runAsync({ domain })
    }
    setCurrent(current + 1)
  }

  const onPrev = () => {
    setCurrent(current - 1)
  }

  const steps: StepProps[] = [
    {
      title: t('输入域名')
    },
    {
      title: t('设置域名')
    },
    {
      title: t('验证连接')
    }
  ]

  const recordColumns: STableProps['columns'] = [
    {
      title: t('类型（Type）'),
      code: 'type',
      name: 'type'
    },
    {
      title: t('主机记录（Host Record）'),
      code: 'host',
      name: 'host'
    },
    {
      title: t('记录值（Record Value）'),
      code: 'value',
      name: 'value'
    }
  ]

  useEffect(() => {
    if (openInfo.open) {
      if (openInfo.data) {
      } else {
        form.setFieldsValue({ domain: '' })
        setCurrent(0)
      }
    }
  }, [openInfo.open])

  return (
    <SModal onCancel={openInfo.close} footer={null} width={700} title={t('连接已有域名')} open={openInfo.open}>
      <Flex vertical gap={16} style={{ height: 600, padding: 16, background: '#fafafa', overflowY: 'auto' }}>
        <SCard>
          <Steps current={current} size={'small'} items={steps} />
        </SCard>

        <SCard title={t('域名')}>
          <Form form={form}>
            <Form.Item
              validateTrigger={'onBlur'}
              rules={[
                { required: true, message: t('请输入域名') },
                {
                  pattern: /^[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$/,
                  message: t('该域名格式错误，请重新输入')
                }
              ]}
              name={'domain'}
              className={'mb0'}
              extra={t('输入你想要连接的域名')}
              style={{ display: current ? 'none' : undefined }}
            >
              <Input placeholder={t('例如 shopkone.com')} autoComplete={'off'} />
            </Form.Item>
            <SRender render={current}>
              {domain}
            </SRender>
          </Form>
        </SCard>

        <SRender render={[1, 2].includes(current)}>
          <SCard>
            <SRender render={!(current === 2 && connectCheck.data?.is_connect)}>
              <div style={{ marginBottom: 8 }}>{t('域名提示')}</div>
            </SRender>

            <SRender style={{ marginBottom: 8 }} render={current === 2 && connectCheck.data?.is_connect}>
              <Alert
                showIcon
                icon={<IconCircleCheckFilled color={'#2e7d32'} size={18} />}
                message={t('域名已连接成功', { x: domain })}
                type={'success'}
              />
            </SRender>

            <STable
              borderless
              className={'table-border'}
              rowKey={'type'}
              data={preCheck.data || []}
              columns={recordColumns}
            />
          </SCard>
        </SRender>

        <Flex justify={'flex-end'}>
          <Flex gap={16} align={'center'}>
            <SRender render={current > 0 && !(current === 2 && connectCheck.data?.is_connect)}>
              <Button onClick={onPrev}>{t('上一步')}</Button>
            </SRender>
            <SRender render={current < 2}>
              <Button loading={preCheck.loading || connectCheck.loading} onClick={onNext} type={'primary'}>
                {current === 0 ? t('下一步') : t('验证连接')}
              </Button>
            </SRender>
            <SRender render={current === 2 && connectCheck.data?.is_connect}>
              <Button onClick={onFresh} type={'primary'}>{t('完成')}</Button>
            </SRender>
          </Flex>
        </Flex>
      </Flex>
    </SModal>
  )
}
