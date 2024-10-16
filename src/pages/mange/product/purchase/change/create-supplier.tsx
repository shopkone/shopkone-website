import { useRef, useState } from 'react'
import { useRequest } from 'ahooks'
import { FormInstance } from 'antd'

import { AddressType } from '@/api/common/address'
import { CreateSupplierApi } from '@/api/product/create-supplier'
import Address from '@/components/address'
import SModal from '@/components/s-modal'
import { UseOpenType } from '@/hooks/useOpen'

export interface CreateSupplierProps {
  info: UseOpenType<unknown>
}

export default function CreateSupplier (props: CreateSupplierProps) {
  const { info } = props
  const [value, onChange] = useState<AddressType>()
  const create = useRequest(CreateSupplierApi, { manual: true })

  const form = useRef<FormInstance>()

  const onConfirm = async () => {
    await form?.current?.validateFields()
    if (!value) return
    await create.runAsync({ address: value })
  }

  return (
    <SModal onOk={onConfirm} onCancel={info.close} open={info.open} width={600} title={'Create Supplier'} >
      <div style={{ padding: 16 }}>
        <Address
          getFormInstance={(f) => { form.current = f }}
          requiredName
          hasName
          value={value}
          onChange={onChange}
          hiddenTitle
          hasEmail
          companyNameLabel={'Supplier name'}
          onMessage={msg => { console.log(msg) }}
        />
      </div>
    </SModal>
  )
}
