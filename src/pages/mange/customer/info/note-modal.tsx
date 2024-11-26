import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRequest } from 'ahooks'
import { Input } from 'antd'

import { CustomerUpdateNoteApi } from '@/api/customer/update-note'
import { sMessage } from '@/components/s-message'
import SModal from '@/components/s-modal'
import { UseOpenType } from '@/hooks/useOpen'

export interface NoteModalProps {
  openInfo: UseOpenType<string>
  onFresh: () => void
  customerId: number
}

export default function NoteModal (props: NoteModalProps) {
  const { openInfo, onFresh, customerId } = props
  const [value, setValue] = useState('')
  const { t } = useTranslation('customers', { keyPrefix: 'info' })
  const update = useRequest(CustomerUpdateNoteApi, { manual: true })
  const ref = useRef<HTMLInputElement>(null)

  const onOk = async () => {
    await update.runAsync({ id: customerId, note: value })
    onFresh()
    openInfo.close()
    sMessage.success(t('更新成功'))
  }

  useEffect(() => {
    if (!openInfo.open) {
      return
    }
    setValue(openInfo.data || '')
  }, [openInfo.open])

  return (
    <SModal
      confirmLoading={update.loading}
      onOk={onOk}
      title={t('编辑备注')}
      open={openInfo.open}
      onCancel={openInfo.close}
    >
      <div style={{ padding: 16, maxHeight: 500, overflowY: 'auto' }}>
        <Input.TextArea
          ref={ref}
          autoSize={{ minRows: 4 }}
          value={value}
          onChange={e => { setValue(e.target.value) }}
        />
      </div>
    </SModal>
  )
}
