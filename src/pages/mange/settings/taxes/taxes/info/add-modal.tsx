import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useRequest } from 'ahooks'
import { Flex, Form, Input, Radio } from 'antd'

import { CountriesRes } from '@/api/base/countries'
import { CollectionOptionsApi } from '@/api/collection/options'
import { BaseCustomerTax, CustomerTaxType } from '@/api/tax/info'
import SInputNumber from '@/components/s-input-number'
import SModal from '@/components/s-modal'
import SRender from '@/components/s-render'
import SSelect from '@/components/s-select'
import { UseOpenType } from '@/hooks/useOpen'

export interface AddModalProps {
  openInfo: UseOpenType<BaseCustomerTax>
  country?: CountriesRes
}

export default function AddModal (props: AddModalProps) {
  const { openInfo, country } = props
  const { t } = useTranslation('settings', { keyPrefix: 'tax' })
  const [form] = Form.useForm()
  const collectionOptions = useRequest(CollectionOptionsApi)

  const type: CustomerTaxType = Form.useWatch('type', form)

  const options = [
    { label: t('商品系列'), value: CustomerTaxType.CustomerTaxTypeCollection },
    { label: t('运费'), value: CustomerTaxType.CustomerTaxTypeDelivery }
  ]

  const countryOptions = useMemo(() => {
    if (!country?.name) return []
    const zones = country?.zones?.map(zone => ({ label: zone.name, value: zone.code }))
    return [{ label: country.name, value: country.code }, ...zones]
  }, [country])

  useEffect(() => {
    if (!openInfo.open) return
    if (openInfo.data) {
      form.setFieldsValue(openInfo.data)
    } else {
      form.setFieldsValue({
        type: CustomerTaxType.CustomerTaxTypeCollection,
        area_code: countryOptions?.[0]?.value,
        name: 'VAT'
      })
    }
  }, [openInfo.open])

  return (
    <SModal onCancel={openInfo.close} title={t('添加自定义税费')} width={500} open={openInfo.open}>
      <Form form={form} style={{ padding: 16, minHeight: 400 }} layout={'vertical'}>
        <Form.Item name={'type'} label={t('适用内容')}>
          <Radio.Group options={options} />
        </Form.Item>
        <SRender render={type === CustomerTaxType.CustomerTaxTypeCollection}>
          <Form.Item
            rules={[{ required: true, message: t('请选择商品系列') }]}
            name={'collection_id'}
            label={t('商品系列')}
            required={false}
          >
            <SSelect optionFilterProp={'label'} showSearch options={collectionOptions.data} />
          </Form.Item>
        </SRender>
        <Form.Item name={'area_code'} label={t('适用地区')}>
          <SSelect showSearch options={countryOptions} optionFilterProp={'label'} />
        </Form.Item>
        <Flex gap={16}>
          <Form.Item
            required={false}
            rules={[{ required: true, message: t('请输入税名') }]}
            name={'name'}
            label={t('税名')} className={'flex1'}
          >
            <Input autoComplete={'off'} />
          </Form.Item>
          <Form.Item name={'tax_rate'} label={t('税率')} className={'flex1'}>
            <SInputNumber suffix={'%'} precision={4} required min={0} />
          </Form.Item>
        </Flex>
      </Form>
    </SModal>
  )
}
