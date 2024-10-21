import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDebounce, useRequest } from 'ahooks'
import { Button, Checkbox, Flex, Form, FormInstance, Input } from 'antd'
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
import { useI18n } from '@/hooks/use-lang'
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
  const { id } = useParams()
  const info = useRequest(LocationInfoApi, { manual: true })
  const nav = useNavigate()
  const openInfo = useOpen<{ name: string, id: number }>()

  const existInventory = useRequest(LocationExistInventoryApi, { manual: true })
  const addressForm = useRef<FormInstance>()
  const modal = useModal()
  const t = useI18n()

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
    await addressForm.current?.validateFields()
    await form.validateFields()
    if (id) {
      await update.runAsync({ ...info.data, ...form.getFieldsValue() })
      await info.refreshAsync()
      sMessage.success(t('位置已更新'))
      setIsChange(false)
    } else {
      const ret = await add.runAsync(form.getFieldsValue())
      sMessage.success(t('位置已添加'))
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
          title: `${t('停用')} ${info?.data?.name}?`,
          content: t('您可以随时重新激活此位置。'),
          onOk: async () => {
            if (!info?.data?.id) return
            await update.runAsync({ ...info.data, active: false })
            sMessage.success(t('位置已停用'))
            info.refresh()
          }
        })
      }
    } else {
      if (!info?.data?.id) return
      await update.runAsync({ ...info.data, active: true })
      sMessage.success(t('位置已激活'))
      info.refresh()
    }
  }

  const onRemove = async () => {
    modal.confirm({
      title: `${t('删除')} ${info?.data?.name}?`,
      content: `${t('您确定要删除位置')} ${info?.data?.name}? ${t('这无法撤销。')}`,
      onOk: async () => {
        if (!info?.data?.id) return
        await remove.runAsync({ id: info.data.id })
        sMessage.success(t('位置已删除'))
        nav('/settings/locations')
      },
      okButtonProps: { danger: true },
      okText: t('删除')
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
      title={id ? info?.data?.name || '-' : t('添加位置')}
      header={
        <SRender render={id}>
          <Button onClick={() => { nav(`/products/inventory/${id}`) }} type={'text'}>
            {t('查看库存')}
          </Button>
        </SRender>
      }
      footer={
        <SRender render={renderFooter}>
          <Flex gap={12} align={'center'}>
            <SRender render={!!id && info?.data?.active ? !info?.data?.default : null}>
              <Button loading={update.loading || existInventory.loading} onClick={onChangeActive}>{t('停用位置')}</Button>
            </SRender>
            <SRender render={!!id && !info?.data?.active}>
              <Button loading={update.loading} onClick={onChangeActive}>{t('激活位置')}</Button>
            </SRender>
            <SRender render={!!id && !info?.data?.active}>
              <Button disabled={remove.loading} danger onClick={onRemove} type={'primary'}>{t('删除位置')}</Button>
            </SRender>
          </Flex>
        </SRender>
      }
    >
      <Form initialValues={{ name: '', fulfillment_details: false }} onValuesChange={onValuesChange} layout={'vertical'} form={form}>
        <SCard
          loading={info.loading}
          tips={t('为此位置指定一个简短名称，以便于识别。您将在订单和产品等区域看到此名称。')}
          style={{ marginBottom: 16 }}
          title={t('名称')}
        >
          <Form.Item rules={[{ required: true, message: t('名称是必填项') }]} name={'name'} className={'mb0'}>
            <Input autoComplete={'off'} />
          </Form.Item>
        </SCard>

        <Form.Item name={'address'} className={'mb0'}>
          <Address getFormInstance={form => { addressForm.current = form }} hasName loading={!address?.country || info.loading} hasEmail />
        </Form.Item>

        <SCard style={{ marginTop: 16 }} title={t('履行详情')} loading={info.loading}>
          <Form.Item
            className={'mb0'}
            extra={
              <div style={{ marginLeft: 24, marginTop: -4, opacity: info?.data?.default ? 0.3 : 1 }}>
                {t('此位置的库存可在线销售。')}
              </div>
            }
            name={'fulfillment_details'}
            valuePropName={'checked'}
          >
            <Checkbox disabled={info?.data?.default}>
              {t('从此位置履行在线订单')}
            </Checkbox>
          </Form.Item>
        </SCard>
      </Form>

      <MoveInventory
        info={openInfo}
        onConfirm={async () => {
          if (!info?.data?.id) return
          await update.runAsync({ ...info.data, active: false })
          sMessage.success(t('位置已停用'))
          info.refresh()
        }}
      />
    </Page>
  )
}
