import { useEffect, useRef, useState } from 'react'
import { useRequest } from 'ahooks'
import { Form, Input } from 'antd'
import isEqual from 'lodash/isEqual'

import { LocationAddApi } from '@/api/location/add'
import Address from '@/components/address'
import Page from '@/components/page'
import SCard from '@/components/s-card'
import { sMessage } from '@/components/s-message'
import { useModal } from '@/components/s-modal'
import { useManageState } from '@/pages/mange/state'
import { isEqualHandle } from '@/utils/isEqual'

export default function Change () {
  const [form] = Form.useForm()

  const manageState = useManageState()
  const address = Form.useWatch('address', form)
  const add = useRequest(LocationAddApi, { manual: true })
  const [isChange, setIsChange] = useState(false)
  const init = useRef<any>()
  const errMsg = useRef<string>()

  const modal = useModal()

  const onValuesChange = () => {
    const values = form.getFieldsValue()
    if (!init.current?.address?.phone?.country) {
      init.current = values
      return
    }
    if (!init.current?.address?.phone?.country) {
      return
    }
    if (values.name !== init.current?.name) {
      setIsChange(true)
      return
    }
    if (!isEqualHandle(values.address, init.current?.address)) {
      const isAllSame = Object.keys(init.current?.address).every(key => {
        return isEqual(values.address[key], init.current.address[key])
      })
      if (isAllSame) {
        setIsChange(false)
      } else {
        setIsChange(true)
      }
      return
    }
    setIsChange(false)
  }

  const onSubmit = async () => {
    await form.validateFields()
    if (errMsg.current) {
      modal.info({ content: errMsg.current })
      return
    }
    await add.runAsync(form.getFieldsValue())
    sMessage.success('Add success')
  }

  const onCancel = () => {
    form.setFieldsValue(init.current)
    setIsChange(false)
  }

  useEffect(() => {
    if (!address?.country) {
      form.setFieldValue('address', { ...address, country: manageState.shopInfo?.country || 'US' })
      init.current = form.getFieldsValue()
    }
  }, [manageState.shopInfo])

  return (
    <Page
      onOk={onSubmit}
      onCancel={onCancel}
      isChange={isChange}
      back={'/settings/locations'}
      width={700}
      title={'Add location'}
    >
      <Form initialValues={{ name: '' }} onValuesChange={onValuesChange} layout={'vertical'} form={form}>
        <SCard
          tips={'Give this location a short name to make it easy to identify. You will see this name in areas like orders and products.'}
          style={{ marginBottom: 16 }}
          title={'Name'}
        >
          <Form.Item rules={[{ required: true, message: 'Name is required' }]} name={'name'} className={'mb0'}>
            <Input autoComplete={'off'} />
          </Form.Item>
        </SCard>

        <Form.Item name={'address'} className={'mb0'}>
          <Address onMessage={(err) => { errMsg.current = err }} loading={!address?.country} hasEmail />
        </Form.Item>
      </Form>
    </Page>
  )
}
