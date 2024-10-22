import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRequest } from 'ahooks'
import { FormInstance } from 'antd'

import { AddressType } from '@/api/common/address'
import { CreateSupplierApi } from '@/api/product/create-supplier'
import { SupplierListRes } from '@/api/product/supplier-list'
import { SupplierUpdateApi } from '@/api/product/supplier-update'
import Address from '@/components/address'
import { sMessage } from '@/components/s-message'
import SModal from '@/components/s-modal'
import { UseOpenType } from '@/hooks/useOpen'

export interface CreateSupplierProps {
  info: UseOpenType<SupplierListRes>
  onOk: (id: number) => Promise<void>
}

export default function CreateSupplier (props: CreateSupplierProps) {
  const { info, onOk } = props
  const [value, onChange] = useState<AddressType>()
  const create = useRequest(CreateSupplierApi, { manual: true })
  const update = useRequest(SupplierUpdateApi, { manual: true })

  const form = useRef<FormInstance>()
  const { t } = useTranslation('product', { keyPrefix: 'purchase' })

  const onConfirm = async () => {
    await form?.current?.validateFields()
    if (!value) return
    if (!info.data?.id) {
      const ret = await create.runAsync({ address: value })
      sMessage.success(t('供应商创建成功'))
      onOk(ret.id)
    } else {
      await update.runAsync({ address: value, id: info?.data?.id })
      onOk(info?.data?.id)
      sMessage.success(t('供应商信息更新成功'))
    }
    info.close()
  }

  useEffect(() => {
    if (!info.open) return
    onChange(info.data?.address)
  }, [info.open])

  return (
    <SModal
      confirmLoading={create.loading || update.loading}
      onOk={onConfirm}
      onCancel={info.close}
      open={info.open}
      width={600}
      title={info?.data?.id ? t('编辑供应商信息') : t('创建供应商')}
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
          companyNameLabel={t('供应商名称')}
        />
      </div>
    </SModal>
  )
}
