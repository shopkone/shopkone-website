import { useEffect } from 'react'
import { Form, Input } from 'antd'

import Address from '@/components/address'
import Page from '@/components/page'
import SCard from '@/components/s-card'
import { useManageState } from '@/pages/mange/state'

export default function Change () {
  const [form] = Form.useForm()

  const manageState = useManageState()
  const address = Form.useWatch('address', form)

  useEffect(() => {
    if (!address?.country) {
      form.setFieldValue('address', { ...address, country: manageState.shopInfo?.country || 'US' })
    }
  }, [manageState.shopInfo])

  return (
    <Page back={'/settings/locations'} width={700} title={'Add location'}>
      <Form layout={'vertical'} form={form}>
        <SCard style={{ marginBottom: 16 }} title={'Name'}>
          <Form.Item name={'name'} className={'mb0'}>
            <Input autoComplete={'off'} />
          </Form.Item>
        </SCard>

        <Form.Item name={'address'} className={'mb0'}>
          <Address loading={!address?.country} hasEmail />
        </Form.Item>
      </Form>
    </Page>
  )
}
