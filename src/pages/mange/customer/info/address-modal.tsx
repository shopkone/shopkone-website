import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRequest } from 'ahooks'

import { AddressType } from '@/api/common/address'
import { AddAddressApi } from '@/api/customer/add-address'
import { UpdateAddressApi } from '@/api/customer/update-address'
import Address from '@/components/address'
import { sMessage } from '@/components/s-message'
import SModal from '@/components/s-modal'
import { UseOpenType } from '@/hooks/useOpen'
import { useManageState } from '@/pages/mange/state'

export interface AddressModalProps {
  onFresh: () => void
  openInfo: UseOpenType<AddressType>
  customerId: number
}

export default function AddressModal (props: AddressModalProps) {
  const { openInfo, customerId, onFresh } = props
  const { t } = useTranslation('customers', { keyPrefix: 'change' })
  const [value, setValue] = useState<AddressType>()
  const storeCountry = useManageState(state => state.shopInfo?.country)
  const add = useRequest(AddAddressApi, { manual: true })
  const update = useRequest(UpdateAddressApi, { manual: true })

  const onOk = async () => {
    if (!value) return
    if (openInfo?.data?.country) {
      await update.runAsync({
        customer_id: customerId,
        address: value,
        is_default: false
      })
      sMessage.success(t('地址编辑成功'))
    } else {
      await add.runAsync({
        address: value,
        customer_id: customerId
      })
      sMessage.success(t('地址添加成功'))
    }
    onFresh()
    openInfo.close()
  }

  useEffect(() => {
    if (!openInfo.open && storeCountry) {
      return
    }
    if (!openInfo?.data && storeCountry) {
      // @ts-expect-error
      setValue({ country: storeCountry })
      return
    }
    setValue(openInfo.data)
  }, [openInfo.open])

  return (
    <SModal
      onOk={onOk}
      confirmLoading={add.loading || update.loading}
      open={openInfo.open}
      onCancel={openInfo.close}
      title={openInfo?.data ? t('编辑地址') : t('添加地址')}
    >
      <Address
        firstName
        value={value}
        onChange={setValue}
        borderless
        companyNotFirst
        hasName
        hiddenTitle
        companyNameLabel={t('公司名称')}
      />
    </SModal>
  )
}
