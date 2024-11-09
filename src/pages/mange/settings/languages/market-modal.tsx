import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRequest } from 'ahooks'
import { Checkbox, Flex, Tooltip } from 'antd'

import { useCountries } from '@/api/base/countries'
import { MarketOptionsRes } from '@/api/market/options'
import { MarketUpdateLangByLangIdApi } from '@/api/market/update-market-lang-by-lang-id'
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
  const updateMarketLang = useRequest(MarketUpdateLangByLangIdApi, { manual: true })
  const [value, setValue] = useState<number[]>([])
  const countries = useCountries()

  const onOk = async () => {
    if (!openInfo.data?.languageId) return
    const language_id = openInfo?.data?.languageId
    if (!language_id) return
    await updateMarketLang.runAsync({ lang_id: language_id, market_ids: value })
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

  const getDisabled = (marketId: number): string => {
    // 如果只有一个语言且当前为启用，则不允许处理，并返回提示
    const item = marketOptions?.find(m => m.value === marketId)
    if (item?.language_ids?.length === 1 && item?.language_ids[0] === openInfo.data?.languageId) {
      return t('市场至少包含一种语言')
    }
    return ''
  }

  const onChange = (id: number) => {
    if (getDisabled(id)) return
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
      confirmLoading={updateMarketLang.loading}
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
                <Tooltip key={i.value} title={getDisabled(i.value)} placement={'topLeft'}>
                  <div
                    onClick={() => {
                      onChange(i.value)
                    }}
                    className={styles.item}
                  >
                    <Checkbox
                      disabled={!!getDisabled(i.value)}
                      onChange={() => {
                        onChange(i.value)
                      }}
                      checked={value.includes(i.value)}
                    >
                      {getName(i.value)}
                    </Checkbox>
                  </div>
                </Tooltip>
              ))
          }
        </Flex>
      </div>
    </SModal>
  )
}
