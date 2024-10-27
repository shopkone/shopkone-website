import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { useRequest } from 'ahooks'
import { Flex, Form, Input } from 'antd'
import cloneDeep from 'lodash/cloneDeep'

import { LocationListApi } from '@/api/location/list'
import { BaseCode, BaseShippingZone, ShippingType } from '@/api/shipping/base'
import { CreateShippingApi } from '@/api/shipping/create'
import { ShippingInfoApi } from '@/api/shipping/info'
import Page from '@/components/page'
import SCard from '@/components/s-card'
import SRender from '@/components/s-render'
import Locations from '@/pages/mange/settings/shipping/courier-service/change/locations'
import Products from '@/pages/mange/settings/shipping/courier-service/change/products'
import Zones from '@/pages/mange/settings/shipping/courier-service/change/zones'
import { isEqualHandle } from '@/utils/is-equal-handle'

export default function Change () {
  const { t } = useTranslation('settings', { keyPrefix: 'shipping' })
  const locations = useRequest(async () => await LocationListApi({ active: true }))
  const [form] = Form.useForm()
  const create = useRequest(CreateShippingApi, { manual: true })
  const info = useRequest(ShippingInfoApi, { manual: true })
  const { id } = useParams()
  const type: ShippingType = Number(new URLSearchParams(window.location.search).get('type') || 0)
  const [isChange, setIsChange] = useState(false)
  const init = useRef<any>()

  const onOk = async () => {
    await form.validateFields()
    const values = form.getFieldsValue()
    if (!values.zones?.length) return
    values.zones = values.zones.map((item: BaseShippingZone) => {
      const codes: BaseCode[] = []
      item.codes.forEach(code => {
        if (code.includes('_____')) {
          const [countryCode, zoneCode] = code.split('_____') || ['', '']
          const find = codes.find(c => c.country_code === countryCode)
          if (find) {
            find.zone_codes.push(zoneCode)
          } else {
            codes.push({ country_code: countryCode, zone_codes: [zoneCode] })
          }
        } else {
          codes.push({ country_code: code, zone_codes: [] })
        }
      })
      return { ...item, codes }
    })
    await create.runAsync({ ...values, type })
  }

  const onCancel = () => {
    form.setFieldsValue(init.current)
    setIsChange(false)
  }

  const onValuesChange = () => {
    const values = form.getFieldsValue()
    if (!init.current) {
      init.current = cloneDeep(values)
      return
    }
    const isSame = isEqualHandle(values, init.current)
    console.log({ isSame, values, init: init.current })
    setIsChange(!isSame)
  }

  const title = useMemo(() => {
    if (type === ShippingType.GeneralExpressDelivery) {
      if (id) {
        return t('编辑通用运费方案')
      } else {
        return t('添加通用运费方案')
      }
    }
    if (id) {
      return t('编辑自定义运费方案')
    }
    return t('添加自定义运费方案')
  }, [type, id])

  const loading = locations.loading || info.loading

  useEffect(() => {
    if (id) {
      info.runAsync({ id: Number(id) }).then(res => {
        const zones = res.zones.map((item: BaseShippingZone) => {
          const codes: string[] = []

          item.codes.forEach((code: any) => {
            if (code.zone_codes.length > 0) {
              code.zone_codes.reverse().forEach((zoneCode: any) => { // 反转 zone_codes 数组
                codes.push(`${code.country_code}_____${zoneCode}`)
              })
            } else {
              codes.push(code.country_code)
            }
          })

          return { ...item, codes }
        })
        form.setFieldsValue({ ...res, zones })
        onValuesChange()
      })
    } else {
      onValuesChange()
    }
  }, [id])

  return (
    <Page
      onCancel={onCancel}
      onOk={onOk}
      isChange={isChange}
      bottom={64}
      back={'/settings/shipping'}
      width={700}
      title={title}
      loading={loading}
    >
      <Form onValuesChange={onValuesChange} form={form}>
        <Flex gap={16} vertical>
          <SRender render={type === ShippingType.CustomerExpressDelivery}>
            <SCard title={t('方案名称')}>
              <Form.Item name={'name'} className={'mb0'} extra={t('该名称不会展示给客户查看')}>
                <Input autoComplete={'off'} />
              </Form.Item>
            </SCard>
          </SRender>

          <Form.Item className={'mb0'} name={'product_ids'}>
            <Products />
          </Form.Item>

          <Form.Item className={'mb0'} name={'location_ids'}>
            <Locations locations={locations.data || []} />
          </Form.Item>

          <Form.Item className={'mb0'} name={'zones'}>
            <Zones />
          </Form.Item>
        </Flex>
      </Form>
    </Page>
  )
}
