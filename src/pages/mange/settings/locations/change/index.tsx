import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDebounce, useRequest } from 'ahooks'
import { Button, Checkbox, Flex, Form, Input } from 'antd'
import isEqual from 'lodash/isEqual'

import { LocationAddApi } from '@/api/location/add'
import { LocationInfoApi } from '@/api/location/info'
import Address from '@/components/address'
import Page from '@/components/page'
import SCard from '@/components/s-card'
import { sMessage } from '@/components/s-message'
import { useModal } from '@/components/s-modal'
import SRender from '@/components/s-render'
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
  const { id } = useParams()
  const info = useRequest(LocationInfoApi, { manual: true })

  const modal = useModal()

  const renderFooter = useDebounce(!!id && info?.data, { wait: 100 })

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
    if (!address?.country && !id) {
      form.setFieldValue('address', { ...address, country: manageState.shopInfo?.country || 'US' })
      init.current = form.getFieldsValue()
    } else if (id) {
      info.runAsync({ id: Number(id) }).then(res => {
        form.setFieldsValue(res)
        init.current = form.getFieldsValue()
      })
    }
  }, [manageState.shopInfo, id])

  return (
    <Page
      onOk={onSubmit}
      onCancel={onCancel}
      isChange={isChange}
      back={'/settings/locations'}
      width={700}
      title={id ? info?.data?.name || '-' : 'Add location'}
      header={
        <SRender render={id}>
          <Button type={'text'}>View inventory</Button>
        </SRender>
      }
      footer={
        <SRender render={renderFooter}>
          <Flex gap={12} align={'center'}>
            <SRender render={!!id && info?.data?.active ? !info?.data?.default : null}>
              <Button>Deactivate location</Button>
            </SRender>
            <SRender render={!!id && !info?.data?.active}>
              <Button>Activate location</Button>
            </SRender>
            <SRender render={!!id && !info?.data?.active}>
              <Button danger type={'primary'}>Delete location</Button>
            </SRender>
          </Flex>
        </SRender>
      }
    >
      <Form initialValues={{ name: '' }} onValuesChange={onValuesChange} layout={'vertical'} form={form}>
        <SCard
          loading={info.loading}
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

        <SCard style={{ marginTop: 16 }} title={'Fulfillment details'} loading={info.loading}>
          <Form.Item
            extra={
              <div style={{ marginLeft: 24, marginTop: -4, opacity: info?.data?.default ? 0.3 : 1 }}>
                Inventory at this location is available for sale online.
              </div>
            }
          >
            <Checkbox disabled={info?.data?.default}>
              Fulfill online orders from this location
            </Checkbox>
          </Form.Item>
        </SCard>
      </Form>
    </Page>
  )
}
