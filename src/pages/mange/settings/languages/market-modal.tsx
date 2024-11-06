import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRequest } from 'ahooks'
import { Checkbox, Flex } from 'antd'

import { useCountries } from '@/api/base/countries'
import { LanguageBindItem, MarketBindLangApi } from '@/api/market/bing-lang'
import { MarketOptionsRes } from '@/api/market/options'
import { sMessage } from '@/components/s-message'
import SModal from '@/components/s-modal'
import { UseOpenType } from '@/hooks/useOpen'
import styles from '@/pages/mange/settings/languages/index.module.less'

export interface MarketModalProps {
  openInfo: UseOpenType<{ marketIds: number[], languageId: number }>
  marketOptions: MarketOptionsRes[]
  onFresh: () => void
}

export default function MarketModal (props: MarketModalProps) {
  const { openInfo, marketOptions, onFresh } = props
  const { t } = useTranslation('settings', { keyPrefix: 'language' })
  const bindApi = useRequest(MarketBindLangApi, { manual: true })
  const [value, setValue] = useState<number[]>([])
  const countries = useCountries()

  const onOk = async () => {
    if (!openInfo.data?.languageId) return
    const oldMarketIds = openInfo.data?.marketIds
    const bind: LanguageBindItem[] = value.filter(i => !oldMarketIds?.includes(i)).map(i => {
      return { market_id: i, language_id: openInfo.data?.languageId || 0 }
    })
    const unBind: LanguageBindItem[] = oldMarketIds?.filter(i => !value.includes(i))?.map(i => {
      return { market_id: i, language_id: openInfo.data?.languageId || 0 }
    })
    await bindApi.runAsync({ bind, un_bind: unBind })
    sMessage.success(t('配置成功'))
    onFresh()
    openInfo.close()
  }

  const getName = (marketId: number) => {
    const market = marketOptions?.find(m => m.value === marketId)
    if (!market) return '--'
    if (!market.is_main) return market?.label
    return countries?.data?.find(c => c.code === market?.label)?.name
  }

  const onChange = (id: number) => {
    setValue(value => {
      if (value.includes(id)) return value.filter(i => i !== id)
      return [...value, id]
    })
  }

  useEffect(() => {
    if (!openInfo.open) return
    setValue(openInfo?.data?.marketIds || [])
  }, [openInfo.open])

  return (
    <SModal
      width={500}
      onOk={onOk}
      title={t('配置到市场')}
      open={openInfo.open}
      onCancel={openInfo.close}
      confirmLoading={bindApi.loading}
    >
      <div
        style={{
          overflowY: 'auto',
          height: 500,
          padding: '12px 0'
        }}
      >
        <Flex vertical>
          {
              marketOptions?.map(i => (
                <div onClick={() => { onChange(i.value) }} className={styles.item} key={i.value}>
                  <Checkbox onChange={() => { onChange(i.value) }} checked={value.includes(i.value)}>
                    {getName(i.value)}
                  </Checkbox>
                </div>
              ))
            }
        </Flex>
      </div>
    </SModal>
  )
}
