import { useEffect, useRef, useState } from 'react'
import { useRequest } from 'ahooks'
import { FormInstance } from 'antd'

import { AddressType } from '@/api/common/address'
import { CreateSupplierApi } from '@/api/product/create-supplier'
import Address from '@/components/address'
import { sMessage } from '@/components/s-message'
import SModal from '@/components/s-modal'
import { UseOpenType } from '@/hooks/useOpen'

export interface CreateSupplierProps {
  info: UseOpenType<unknown>
  onOk: (id: number) => Promise<void>
}

export default function CreateSupplier (props: CreateSupplierProps) {
  const { info, onOk } = props
  const [value, onChange] = useState<AddressType>()
  const create = useRequest(CreateSupplierApi, { manual: true })

  const form = useRef<FormInstance>()

  const onConfirm = async () => {
    await form?.current?.validateFields()
    if (!value) return
    const ret = await create.runAsync({ address: value })
    info.close()
    onOk(ret.id)
    sMessage.success('Supplier created!')
  }

  useEffect(() => {
    if (!info.open) return
    onChange(undefined)
  }, [info.open])

  return (
    <SModal

      confirmLoading={create.loading}
      onOk={onConfirm}
      onCancel={info.close}
      open={info.open}
      width={600}
      title={'Create Supplier'}
    >
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
        />
      </div>
    </SModal>
  )
}
