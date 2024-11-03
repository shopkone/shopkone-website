import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Flex, Form, Input, Radio } from 'antd'

import { CollectionOptionsRes } from '@/api/collection/options'
import { BaseCustomerTax, CustomerTaxType } from '@/api/tax/info'
import SInputNumber from '@/components/s-input-number'
import SModal from '@/components/s-modal'
import SRender from '@/components/s-render'
import SSelect from '@/components/s-select'
import { UseOpenType } from '@/hooks/useOpen'
import { genId } from '@/utils/random'

export interface AddModalData {
  id: number
  type: CustomerTaxType
  collection_id?: number
  area_code: string
  name: string
  tax_rate: number
  zone_id: number
}

export interface AddModalProps {
  openInfo: UseOpenType<AddModalData>
  onConfirm: (tax: AddModalData) => void
  collections: CollectionOptionsRes[]
  countryOptions: Array<{ label: string, value: string }>
}

export default function AddModal (props: AddModalProps) {
  const { openInfo, onConfirm, collections, countryOptions } = props
  const { t } = useTranslation('settings', { keyPrefix: 'tax' })
  const [form] = Form.useForm()
  const warpForm = Form.useFormInstance()
  const getCustomers = (): BaseCustomerTax[] | undefined => warpForm.getFieldValue('customers')
  const existCollectionIds = getCustomers()?.map(i => {
    if (i.type === CustomerTaxType.CustomerTaxTypeCollection) {
      return i.collection_id
    }
    return 0
  }).filter(Boolean)

  const collectionOptions = collections?.map(i => {
    if (existCollectionIds?.includes(i.value)) {
      return { ...i, disabled: true }
    }
    return i
  })

  const hasShipping = !!getCustomers()?.find(i => i.type === CustomerTaxType.CustomerTaxTypeDelivery)

  const type: CustomerTaxType = Form.useWatch('type', form)

  const options = [
    { label: t('商品系列'), value: CustomerTaxType.CustomerTaxTypeCollection },
    { label: t('运费'), value: CustomerTaxType.CustomerTaxTypeDelivery, disabled: hasShipping }
  ]

  const onOk = async () => {
    await form.validateFields()
    const values = form.getFieldsValue(true)
    onConfirm(values)
    openInfo.close()
  }

  useEffect(() => {
    if (!openInfo.open) return

    if (openInfo.data) {
      form.setFieldsValue(openInfo.data)
    } else {
      const item: AddModalData = {
        type: CustomerTaxType.CustomerTaxTypeCollection,
        area_code: countryOptions?.[0]?.value,
        name: 'VAT',
        id: genId(),
        tax_rate: 0,
        zone_id: genId(),
        collection_id: undefined
      }
      form.setFieldsValue(item)
    }
  }, [openInfo.open])

  return (
    <SModal onOk={onOk} onCancel={openInfo.close} title={t('添加自定义税费')} width={500} open={openInfo.open}>
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
            <SSelect optionFilterProp={'label'} showSearch options={collectionOptions} />
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
