import { useState } from 'react'

import { AddressType } from '@/api/common/address'
import Address from '@/components/address'
import SModal from '@/components/s-modal'
import { UseOpenType } from '@/hooks/useOpen'

export interface CreateSupplierProps {
  info: UseOpenType<unknown>
}

export default function CreateSupplier (props: CreateSupplierProps) {
  const { info } = props
  const [value, onChange] = useState<AddressType>()

  const onConfirm = async () => {
    console.log(value)
  }

  return (
    <SModal onOk={onConfirm} onCancel={info.close} open={info.open} width={600} title={'Create Supplier'} >
      <div style={{ padding: 16 }}>
        <Address
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
