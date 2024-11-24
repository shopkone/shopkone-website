import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Input } from 'antd'

import SModal from '@/components/s-modal'
import { UseOpenType } from '@/hooks/useOpen'

export interface NoteModalProps {
  openInfo: UseOpenType<string>
  onFresh: () => void
}

export default function NoteModal (props: NoteModalProps) {
  const { openInfo, onFresh } = props
  const [value, setValue] = useState('')
  const { t } = useTranslation('customers', { keyPrefix: 'info' })

  useEffect(() => {
    if (!openInfo.open) {
      return
    }
    setValue(openInfo.data || '')
  }, [openInfo.open])

  return (
    <SModal
      title={t('编辑备注')}
      open={openInfo.open}
      onCancel={openInfo.close}
    >
      <div style={{ padding: 16 }}>
        <Input.TextArea
          autoSize={{ minRows: 4 }}
          value={value}
          onChange={e => { setValue(e.target.value) }}
        />
      </div>
    </SModal>
  )
}
