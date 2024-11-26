import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { IconExclamationCircle } from '@tabler/icons-react'
import { useRequest } from 'ahooks'
import { Flex, Form, FormInstance } from 'antd'

import { AddressType } from '@/api/common/address'
import { AddAddressApi } from '@/api/customer/add-address'
import { UpdateAddressApi } from '@/api/customer/update-address'
import Address from '@/components/address'
import { sMessage } from '@/components/s-message'
import SModal from '@/components/s-modal'
import SRender from '@/components/s-render'
import SSelect from '@/components/s-select'
import { UseOpenType } from '@/hooks/useOpen'
import { formatPhone } from '@/utils/format'
import { genId } from '@/utils/random'

export interface AddressSelectProps {
  address?: AddressType[]
  openInfo: UseOpenType<AddressType>
  onFresh: (address?: AddressType) => void
}

export default function AddressSelect (props: AddressSelectProps) {
  const { address, openInfo, onFresh } = props
  const [value, setValue] = useState<AddressType>()
  const { t } = useTranslation('orders', { keyPrefix: 'drafts' })
  const form = Form.useFormInstance()
  const update = useRequest(UpdateAddressApi, { manual: true })
  const create = useRequest(AddAddressApi, { manual: true })
  const addrForm = useRef<FormInstance>()

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

  console.log({ address })

  const onOk = async () => {
    await addrForm.current?.validateFields().catch(err => {
      const msg = err.errorFields?.[0]?.errors?.[0]
      if (msg) {
        sMessage.warning(msg)
      }
      throw new Error(err)
    })
    if (!value) return
    const addr = value?.id > 0 ? value : { ...value, id: genId() }
    form.setFieldValue('address', addr)
    onFresh(addr)
    openInfo.close()
  }

  const onSelect = (value: number) => {
    setValue(address?.find(i => i.id === value))
  }

  useEffect(() => {
    if (!openInfo.open) return
    setValue(openInfo.data)
  }, [openInfo.open])

  return (
    <SModal
      title={t('编辑收货地址')}
      onOk={onOk}
      onCancel={openInfo.close}
      open={openInfo.open}
      confirmLoading={update.loading || create.loading}
      extra={
        <Flex gap={4} align={'center'} className={'secondary'}>
          <IconExclamationCircle size={15} />
          {t('修改仅对当前订单生效')}
        </Flex>
      }
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
        getFormInstance={f => { addrForm.current = f }}
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
