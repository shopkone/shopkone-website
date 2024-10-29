import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Checkbox } from 'antd'

import { LocationListRes } from '@/api/location/list'
import SLocation from '@/components/s-location'
import SModal from '@/components/s-modal'
import { UseOpenType } from '@/hooks/useOpen'

export interface LocationModalProps {
  openInfo: UseOpenType<number[]>
  onConfirm?: (value: number[]) => void
  locations: LocationListRes[]
}

export default function LocationModal (props: LocationModalProps) {
  const { openInfo, onConfirm, locations } = props
  const { t } = useTranslation('settings', { keyPrefix: 'shipping' })

  const [selectedIds, setSelectedIds] = useState<number[]>([])

  const onSelect = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds?.(selectedIds.filter(item => item !== id))
    } else {
      setSelectedIds?.([...selectedIds, id])
    }
  }

  const onOk = () => {
    onConfirm?.(selectedIds || [])
    openInfo.close()
  }

  useEffect(() => {
    if (!openInfo.open) return
    setSelectedIds(openInfo.data || [])
  }, [openInfo.open])

  return (
    <SModal onOk={onOk} onCancel={openInfo.close} open={openInfo.open} width={700} title={t('选择地点')}>
      <div style={{
        minHeight: 400,
        maxHeight: 600,
        padding: 16,
        overflowY: 'auto',
        overflowX: 'hidden'
      }}
      >
        <SLocation
          value={locations || []}
          extra={item => (
            <div style={{
              marginRight: 4,
              marginLeft: 4
            }}
            >
              <Checkbox checked={selectedIds.includes(item.id)} />
            </div>
          )}
          onClick={item => {
            onSelect(item.id)
          }}
          style={(item) => ({ background: selectedIds.includes(item.id) ? '#f8f8f8' : undefined })}
        />
        <div style={{ height: 64 }} />
      </div>
    </SModal>
  )
}
