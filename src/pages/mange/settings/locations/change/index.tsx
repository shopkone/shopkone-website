import { useEffect, useRef, useState } from 'react'
import { useRequest } from 'ahooks'
import { Form, Input } from 'antd'

import { LocationAddApi } from '@/api/location/add'
import Address from '@/components/address'
import Page from '@/components/page'
import SCard from '@/components/s-card'
import { useManageState } from '@/pages/mange/state'

export default function Change () {
  const [form] = Form.useForm()

  const manageState = useManageState()
  const address = Form.useWatch('address', form)
  const add = useRequest(LocationAddApi, { manual: true })
  const [isChange, setIsChange] = useState(false)
  const init = useRef()

  const onValuesChange = () => {
    console.log(form.getFieldsValue())
  }

  useEffect(() => {
    if (!address?.country) {
      form.setFieldValue('address', { ...address, country: manageState.shopInfo?.country || 'US' })
    }
    setTimeout(() => {
      init.current = form.getFieldsValue()
      console.log(init.current)
    }, 1000)
  }, [manageState.shopInfo])

  return (
    <Page
      isChange={isChange} back={'/settings/locations'}
      width={700}
      title={'Add location'}
    >
      <Form onValuesChange={onValuesChange} layout={'vertical'} form={form}>
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
