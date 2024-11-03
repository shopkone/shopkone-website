import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { useRequest } from 'ahooks'
import { Checkbox, Flex, Form, Input } from 'antd'
import cloneDeep from 'lodash/cloneDeep'

import { useCountries } from '@/api/base/countries'
import { TaxInfoApi } from '@/api/tax/info'
import { TaxUpdateApi } from '@/api/tax/update'
import Page from '@/components/page'
import SCard from '@/components/s-card'
import SInputNumber from '@/components/s-input-number'
import SRender from '@/components/s-render'
import CustomersTax from '@/pages/mange/settings/taxes/taxes/info/customers-tax'
import ZoneTax from '@/pages/mange/settings/taxes/taxes/info/zone-tax'
import { isEqualHandle } from '@/utils/is-equal-handle'

export default function TaxInfo () {
  const { t } = useTranslation('settings', { keyPrefix: 'tax' })
  const id = Number(useParams().id || 0)
  const info = useRequest(TaxInfoApi, { manual: true })
  const countries = useCountries()
  const [form] = Form.useForm()
  const [isChange, setIsChange] = useState(false)
  const init = useRef<any>()
  const hasNote = Form.useWatch('has_note', form)
  const currentCountry = countries?.data?.find(c => c.code === info?.data?.country_code)
  const update = useRequest(TaxUpdateApi, { manual: true })

  const onValuesChange = (force?: boolean) => {
    const values = form.getFieldsValue()
    if (!init.current || force === true) {
      init.current = cloneDeep(values)
      return
    }
    const isSame = isEqualHandle(values, init.current)
    setIsChange(!isSame)
  }

  const onCancel = () => {
    form.setFieldsValue(init.current)
    setIsChange(false)
  }

  const onOk = async () => {
    await form.validateFields()
    const values = form.getFieldsValue()
    await update.runAsync({ id: Number(id), ...values })
  }

  useEffect(() => {
    if (!id) return
    info.run({ id })
  }, [id])

  useEffect(() => {
    if (info.data) {
      form.setFieldsValue(info.data)
      onValuesChange(true)
    }
  }, [info.data])

  return (
    <Page
      onOk={onOk}
      onCancel={onCancel}
      isChange={isChange}
      title={currentCountry?.name || '--'}
      loading={info.loading || countries.loading}
      width={700}
      back={'/settings/taxes'}
    >
      <Form onValuesChange={onValuesChange} form={form}>
        <Flex vertical gap={16}>
          <SCard title={t('全境税率')}>
            <Form.Item name={'tax_rate'} style={{ width: 300 }}>
              <SInputNumber suffix={'%'} />
            </Form.Item>
            <ZoneTax zones={currentCountry?.zones || []} />
            <div className={'line'} />
            <Form.Item valuePropName={'checked'} name={'has_note'} className={'mb0'}>
              <Checkbox>{t('在结账时允许消费者查看消费税说明')}</Checkbox>
            </Form.Item>
            <SRender render={hasNote}>
              <Form.Item name={'note'} className={'mb0'}>
                <Input.TextArea autoSize={{ minRows: 4 }} />
              </Form.Item>
            </SRender>
          </SCard>
          <CustomersTax country={currentCountry} />
        </Flex>
      </Form>

    </Page>
  )
}
