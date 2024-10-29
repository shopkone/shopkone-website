import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRequest } from 'ahooks'
import { Radio } from 'antd'

import { LocationListRes } from '@/api/location/list'
import { SetDefaultLocationApi } from '@/api/location/set-default'
import SLocation from '@/components/s-location'
import { sMessage } from '@/components/s-message'
import SModal from '@/components/s-modal'
import { UseOpenType } from '@/hooks/useOpen'

export interface DefaultChangerProps {
  openInfo: UseOpenType<number>
  locations: LocationListRes[]
  onFresh: () => void
}

export default function DefaultChanger (props: DefaultChangerProps) {
  const { openInfo, locations, onFresh } = props
  const { t } = useTranslation('settings', { keyPrefix: 'shipping' })
  const setDefault = useRequest(SetDefaultLocationApi, { manual: true })
  const [selectedId, setSelectedId] = useState<number>()

  const onSelect = (id: number) => {
    setSelectedId(id)
  }

  const onOk = async () => {
    if (!selectedId) return
    await setDefault.runAsync({ id: selectedId })
    sMessage.success(t('默认地点设置成功'))
    onFresh()
    openInfo.close()
  }

  useEffect(() => {
    if (!openInfo.open) return
    setSelectedId(openInfo.data)
  }, [openInfo.open])

  return (
    <SModal
      onOk={onOk}
      onCancel={openInfo.close}
      open={openInfo.open}
      width={700}
      okButtonProps={{ loading: setDefault.loading }}
      title={t('选择默认地点')}
      okText={t('更新')}
    >
      <div
        style={{
          minHeight: 400,
          maxHeight: 600,
          padding: 16,
          overflowY: 'auto',
          overflowX: 'hidden'
        }}
      >
        <SLocation
          hideTag
          value={locations || []}
          extra={item => (
            <div style={{ marginRight: 4, marginLeft: 4 }}>
              <Radio checked={selectedId === item.id} />
            </div>
          )}
          onClick={item => { onSelect(item.id) }}
          style={(item) => ({ background: selectedId === item.id ? '#f8f8f8' : undefined })}
        />
        <div style={{ height: 64 }} />
      </div>
    </SModal>
  )
}
