import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRequest } from 'ahooks'
import { Form } from 'antd'

import { AddressType } from '@/api/common/address'
import { AddAddressApi } from '@/api/customer/add-address'
import { UpdateAddressApi } from '@/api/customer/update-address'
import Address from '@/components/address'
import SModal from '@/components/s-modal'
import SRender from '@/components/s-render'
import SSelect from '@/components/s-select'
import { UseOpenType } from '@/hooks/useOpen'
import { formatPhone } from '@/utils/format'

export interface AddressSelectProps {
  address?: AddressType[]
  openInfo: UseOpenType<number>
  customerId: number
  onFresh: () => void
}

export default function AddressSelect (props: AddressSelectProps) {
  const { address, openInfo, customerId, onFresh } = props
  const [value, setValue] = useState<AddressType>()
  const { t } = useTranslation('orders', { keyPrefix: 'drafts' })
  const form = Form.useFormInstance()
  const update = useRequest(UpdateAddressApi, { manual: true })
  const create = useRequest(AddAddressApi, { manual: true })

  const addressOptions = useMemo(() => {
    return address?.map(i => {
      const { first_name, last_name, phone } = i
      const name = [[first_name, last_name].filter(Boolean).join(' '), formatPhone(phone)].filter(Boolean).join(', ')
      const { city, zone, country } = i
      const addr = [formatPhone(phone), city, zone, country].filter(Boolean).join(', ')
      return {
        label: name || addr,
        value: i.id
      }
    }) || []
  }, [address])

  const onOk = async () => {
    const find = addressOptions?.find(i => i.value === value?.id)
    if (!find && value) {
      const ret = await create.runAsync({ customer_id: customerId, address: value })
      form.setFieldValue('address_id', ret?.id)
    } else if (value) {
      await update.runAsync({ address: value, customer_id: customerId, is_default: false })
      form.setFieldValue('address_id', value?.id)
    }
    onFresh()
    openInfo.close()
  }

  const onSelect = (value: number) => {
    setValue(address?.find(i => i.id === value))
  }

  useEffect(() => {
    if (!openInfo.open) return
    const addr = address?.find(i => i.id === openInfo.data)
    setValue(addr)
  }, [openInfo.open])

  return (
    <SModal
      title={t('编辑收货地址')}
      onOk={onOk}
      onCancel={openInfo.close}
      open={openInfo.open}
      confirmLoading={update.loading || create.loading}
    >
      <SRender render={addressOptions?.length}>
        <div style={{ padding: '16px 16px 4px 16px' }}>
          <div style={{ marginBottom: 6 }}>{t('选择地址')}</div>
          <SSelect
            value={value?.id ? value?.id : -1}
            onSelect={onSelect}
            className={'fit-width'}
            options={[{ value: -1, label: t('使用新地址') }, ...addressOptions]}
          />
        </div>
        <div className={'line'} />
      </SRender>
      <Address
        key={value?.id}
        firstName
        value={value}
        onChange={setValue}
        borderless
        companyNotFirst
        hasName
        hiddenTitle
        companyNameLabel={t('公司')}
      />
    </SModal>
  )
}
