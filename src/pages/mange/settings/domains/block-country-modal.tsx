import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRequest } from 'ahooks'

import { BlockCountryUpdateApi } from '@/api/domain/update-block-country'
import { sMessage } from '@/components/s-message'
import SModal from '@/components/s-modal'
import SelectCountry from '@/components/select-country'
import { UseOpenType } from '@/hooks/useOpen'

export interface BlockCountryModalProps {
  openInfo: UseOpenType<string[]>
  onFresh: () => void
}

export default function BlockCountryModal (props: BlockCountryModalProps) {
  const { openInfo, onFresh } = props
  const { t } = useTranslation('settings', { keyPrefix: 'domains' })
  const [value, setValue] = useState<string[]>([])
  const blockCountry = useRequest(BlockCountryUpdateApi, { manual: true })

  const onOk = async () => {
    await blockCountry.runAsync({ codes: value })
    sMessage.success(t('设置成功'))
    openInfo.close()
    onFresh()
  }

  useEffect(() => {
    if (openInfo.open) {
      setValue(openInfo.data || [])
    }
  }, [openInfo.open])

  return (
    <SModal
      onOk={onOk}
      confirmLoading={blockCountry.loading}
      open={openInfo.open}
      onCancel={openInfo.close}
      title={t('选择屏蔽国家/地区')}
      extra={
      t('已选中x个国家/地区', { x: value.length })
      }
    >
      <SelectCountry
        onlyCountry
        borderless
        height={500}
        value={value}
        onChange={setValue}
      />
    </SModal>
  )
}
