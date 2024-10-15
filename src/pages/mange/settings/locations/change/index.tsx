import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDebounce, useRequest } from 'ahooks'
import { Button, Checkbox, Flex, Form, Input } from 'antd'
import isEqual from 'lodash/isEqual'

import { LocationAddApi } from '@/api/location/add'
import { LocationExistInventoryApi } from '@/api/location/exist-inventory'
import { LocationInfoApi } from '@/api/location/info'
import { RemoveLocationApi } from '@/api/location/remove'
import { UpdateLocationApi } from '@/api/location/update'
import Address from '@/components/address'
import Page from '@/components/page'
import SCard from '@/components/s-card'
import { sMessage } from '@/components/s-message'
import { useModal } from '@/components/s-modal'
import SRender from '@/components/s-render'
import { useOpen } from '@/hooks/useOpen'
import MoveInventory from '@/pages/mange/settings/locations/change/move-inventory'
import { useManageState } from '@/pages/mange/state'

export default function Change () {
  const [form] = Form.useForm()

  const manageState = useManageState()
  const address = Form.useWatch('address', form)
  const add = useRequest(LocationAddApi, { manual: true })
  const update = useRequest(UpdateLocationApi, { manual: true })
  const remove = useRequest(RemoveLocationApi, { manual: true })
  const [isChange, setIsChange] = useState(false)
  const init = useRef<any>()
  const errMsg = useRef<string>()
  const { id } = useParams()
  const info = useRequest(LocationInfoApi, { manual: true })
  const nav = useNavigate()
  const openInfo = useOpen<{ name: string, id: number }>()
  const existInventory = useRequest(LocationExistInventoryApi, { manual: true })

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
    if (info?.data?.fulfillment_details !== values.fulfillment_details) {
      setIsChange(true)
      return
    }
    if (!isEqual(values.address, init.current?.address)) {
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
    if (id) {
      await update.runAsync({ ...info.data, ...form.getFieldsValue() })
      await info.refreshAsync()
      sMessage.success('Location updated')
      setIsChange(false)
    } else {
      const ret = await add.runAsync(form.getFieldsValue())
      sMessage.success('Location added')
      nav(`${ret.id}`)
      setIsChange(false)
    }
  }

  const onCancel = () => {
    form.setFieldsValue(init.current)
    setIsChange(false)
  }

  const onChangeActive = async () => {
    if (info?.data?.active) {
      if (!info?.data?.id) return
      const { exist } = await existInventory.runAsync({ id: info?.data?.id })
      if (exist) {
        openInfo.edit({ id: info.data.id, name: info?.data?.name })
      } else {
        modal.confirm({
          title: `Deactivate ${info?.data?.name}?`,
          content: 'You can reactivate this location at any time.',
          onOk: async () => {
            if (!info?.data?.id) return
            await update.runAsync({ ...info.data, active: false })
            sMessage.success('Location deactivated')
            info.refresh()
          }
        })
      }
    } else {
      if (!info?.data?.id) return
      await update.runAsync({ ...info.data, active: true })
      sMessage.success('Location activated')
      info.refresh()
    }
  }

  const onRemove = async () => {
    modal.confirm({
      title: `Delete ${info?.data?.name}?`,
      content: `Are you sure you want to delete the location ${info?.data?.name}? This can’t be undone.`,
      onOk: async () => {
        if (!info?.data?.id) return
        await remove.runAsync({ id: info.data.id })
        sMessage.success('Location deleted')
        nav('/settings/locations')
      },
      okButtonProps: { danger: true },
      okText: 'Delete'
    })
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
      type={'settings'}
      onOk={onSubmit}
      onCancel={onCancel}
      isChange={isChange}
      back={'/settings/locations'}
      width={700}
      title={id ? info?.data?.name || '-' : 'Add location'}
      header={
        <SRender render={id}>
          <Button onClick={() => { nav(`/products/inventory/${id}`) }} type={'text'}>
            View inventory
          </Button>
        </SRender>
      }
      footer={
        <SRender render={renderFooter}>
          <Flex gap={12} align={'center'}>
            <SRender render={!!id && info?.data?.active ? !info?.data?.default : null}>
              <Button loading={update.loading || existInventory.loading} onClick={onChangeActive}>Deactivate location</Button>
            </SRender>
            <SRender render={!!id && !info?.data?.active}>
              <Button loading={update.loading} onClick={onChangeActive}>Activate location</Button>
            </SRender>
            <SRender render={!!id && !info?.data?.active}>
              <Button disabled={remove.loading} danger onClick={onRemove} type={'primary'}>Delete location</Button>
            </SRender>
          </Flex>
        </SRender>
      }
    >
      <Form initialValues={{ name: '', fulfillment_details: false }} onValuesChange={onValuesChange} layout={'vertical'} form={form}>
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
          <Address hasName onMessage={(err) => { errMsg.current = err }} loading={!address?.country || info.loading} hasEmail />
        </Form.Item>

        <SCard style={{ marginTop: 16 }} title={'Fulfillment details'} loading={info.loading}>
          <Form.Item
            className={'mb0'}
            extra={
              <div style={{ marginLeft: 24, marginTop: -4, opacity: info?.data?.default ? 0.3 : 1 }}>
                Inventory at this location is available for sale online.
              </div>
            }
            name={'fulfillment_details'}
            valuePropName={'checked'}
          >
            <Checkbox disabled={info?.data?.default}>
              Fulfill online orders from this location
            </Checkbox>
          </Form.Item>
        </SCard>
      </Form>

      <MoveInventory
        info={openInfo}
        onConfirm={async () => {
          if (!info?.data?.id) return
          await update.runAsync({ ...info.data, active: false })
          sMessage.success('Location deactivated')
          info.refresh()
        }}
      />
    </Page>
  )
}
