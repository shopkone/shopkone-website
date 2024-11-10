import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Flex, Radio } from 'antd'

import { useLanguageList } from '@/api/base/languages'
import { LanguageListRes } from '@/api/languages/list'
import SModal from '@/components/s-modal'
import { UseOpenType } from '@/hooks/useOpen'

import styles from './index.module.less'

export interface SelectDefaultModalProps {
  openInfo: UseOpenType<number>
  onConfirm: (id: number) => void
  languages: LanguageListRes[]
}

export default function SelectDefaultModal (props: SelectDefaultModalProps) {
  const { openInfo, onConfirm, languages } = props
  const { t } = useTranslation('settings', { keyPrefix: 'market' })
  const [value, setValue] = useState(0)
  const languageList = useLanguageList()

  const onConfirmClick = () => {
    onConfirm(value)
    openInfo.close()
  }

  useEffect(() => {
    if (openInfo.open && openInfo.data) {
      setValue(openInfo.data)
    }
  }, [openInfo.open])

  return (
    <SModal onOk={onConfirmClick} title={t('选择默认语言')} width={500} open={openInfo.open} onCancel={openInfo.close}>
      <Flex className={styles.verticalRadio}>
        <Radio.Group
          onChange={e => { setValue(e.target.value) }}
          value={value}
          options={languages?.map(i => ({ value: i.id, label: languageList?.data?.find(ii => ii.value === i.language)?.label })) || []}
        />
      </Flex>
    </SModal>
  )
}
