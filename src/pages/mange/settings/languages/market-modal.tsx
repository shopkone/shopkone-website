import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRequest } from 'ahooks'
import { Checkbox, Flex, Tooltip } from 'antd'
import classNames from 'classnames'

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
    const item = marketOptions?.find(m => m.value === marketId)
    // 如果是主域名，但不是是此次，不想可以处理
    if (!item?.is_main && item?.domain_type === 1) {
      return t('使用主域名时，默认使用主市场的语言设置')
    }
    // 如果只有一个语言且当前为启用，则不允许处理，并返回提示
    if (item?.language_ids?.length === 1 && item?.language_ids[0] === openInfo.data?.languageId) {
      return t('市场至少包含一种语言')
    }
    return ''
  }

  const onChange = (id: number) => {
    if (getDisabled(id)) return
    console.log(123)
    let newValue = value?.includes(id) ? value.filter(i => i !== id) : [...value, id]
    const item = marketOptions?.find(m => m.value === id)
    if (item?.is_main) {
      const mainDomainButNoMainMarketId = marketOptions?.filter(m => !m.is_main && m.domain_type === 1)?.map(i => i.value)
      if (newValue?.includes(id)) {
        newValue = [...newValue, ...mainDomainButNoMainMarketId]
      } else {
        newValue = newValue.filter(i => !mainDomainButNoMainMarketId?.includes(i)) || []
      }
    }
    setValue([...new Set(newValue)])
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
                <Tooltip key={i.value} title={getDisabled(i.value)}>
                  <Flex
                    gap={8}
                    align={'center'}
                    onClick={() => {
                      onChange(i.value)
                    }}
                    className={classNames(styles.item, { [styles.itemDisabled]: getDisabled(i.value) })}
                  >
                    <Checkbox
                      onChange={() => { onChange(i.value) }}
                      disabled={!!getDisabled(i.value)}
                      checked={value.includes(i.value)}
                    />
                    {getName(i.value)}
                  </Flex>
                </Tooltip>
              ))
          }
        </Flex>
      </div>
    </SModal>
  )
}
