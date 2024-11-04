import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRequest } from 'ahooks'
import { Button, Flex } from 'antd'

import { TaxCreateApi } from '@/api/tax/create'
import { sMessage } from '@/components/s-message'
import SModal from '@/components/s-modal'
import SelectCountry from '@/components/select-country'
import { UseOpenType } from '@/hooks/useOpen'

export interface AddCountryModalProps {
  disabled: string[]
  openInfo: UseOpenType
  onOk: () => void
}

export default function AddCountryModal (props: AddCountryModalProps) {
  const { disabled, openInfo, onOk } = props
  const { t } = useTranslation('settings', { keyPrefix: 'tax' })
  const [value, setValue] = useState<string[]>([])
  const add = useRequest(TaxCreateApi, { manual: true })

  const onAdd = async () => {
    await add.runAsync({
      country_codes: value
    })
    sMessage.success(t('收税地区添加成功'))
    openInfo.close()
    onOk()
  }

  useEffect(() => {
    if (openInfo.open) {
      setValue([])
    }
  }, [openInfo.open])

  return (
    <SModal
      onCancel={() => {
        openInfo.close()
      }}
      footer={
        <Flex align={'center'} justify={'space-between'}>
          <div>{t('已选x个国家/地区', { x: value.length || 0 })}</div>
          <Flex gap={12}>
            <Button onClick={openInfo.close}>{t('取消')}</Button>
            <Button loading={add.loading} onClick={onAdd} type={'primary'}>{t('添加')}</Button>
          </Flex>
        </Flex>
      }
      title={t('添加收税地区')}
      open={openInfo.open}
    >
      <SelectCountry
        value={value}
        onChange={setValue}
        disabled={disabled}
        borderless
        onlyCountry
        height={500}
      />
    </SModal>
  )
}
