import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Flex, Input } from 'antd'

import { BaseShippingZone } from '@/api/shipping/base'
import SModal from '@/components/s-modal'
import SelectCountry from '@/components/select-country'
import { UseOpenType } from '@/hooks/useOpen'

export interface ZoneModalProps {
  openInfo: UseOpenType<BaseShippingZone>
  confirm?: (value: BaseShippingZone) => void
}

export default function ZoneModal (props: ZoneModalProps) {
  const { openInfo, confirm } = props
  const { t } = useTranslation('settings', { keyPrefix: 'shipping' })
  const [selectedZoneIds, setSelectedZoneIds] = useState<string[]>([])
  const [name, setName] = useState('')

  const onOk = () => {
    if (openInfo.data) {
      confirm?.({ ...openInfo.data, name, codes: selectedZoneIds })
    } else {
      confirm?.({ codes: selectedZoneIds, name, fees: [] })
    }
    openInfo.close()
  }

  useEffect(() => {
    if (!openInfo.open) return
    setSelectedZoneIds(openInfo.data?.codes || [])
    setName(openInfo.data?.name || '')
  }, [openInfo])

  return (
    <SModal
      onCancel={() => {
        openInfo.close()
      }}
      title={t('添加区域')}
      open={openInfo.open}
      width={600}
      footer={
        <Flex align={'center'} justify={'space-between'}>
          <div>{t('已选国家', { x: selectedZoneIds.length })}</div>
          <Flex align={'center'} gap={8}>
            <Button
              onClick={openInfo.close}
            >
              {t('取消')}
            </Button>
            <Button
              onClick={onOk}
              type={'primary'}
            >
              {t('确定')}
            </Button>
          </Flex>
        </Flex>
      }
    >
      <Flex vertical style={{ height: 600, overflowY: 'hidden', padding: 16 }}>
        <div style={{ marginBottom: 4 }}>{t('区域名称')}</div>

        <Input />

        <div style={{ marginBottom: 4, marginTop: 16 }}>
          {t('国家/地区')}
        </div>

        <SelectCountry height={400} value={selectedZoneIds} onChange={setSelectedZoneIds} />
      </Flex>
    </SModal>
  )
}
