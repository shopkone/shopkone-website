import { useTranslation } from 'react-i18next'
import { useRequest } from 'ahooks'
import { Button, Flex, Switch, Tooltip } from 'antd'

import { useCountries } from '@/api/base/countries'
import { LanguageListApi, LanguageListRes } from '@/api/languages/list'
import { MarketOptionsApi } from '@/api/market/options'
import Page from '@/components/page'
import SCard from '@/components/s-card'
import SRender from '@/components/s-render'
import STable, { STableProps } from '@/components/s-table'
import Status from '@/components/status'
import { useOpen } from '@/hooks/useOpen'
import AddLanguage from '@/pages/mange/settings/languages/add-language'
import { renderText } from '@/utils/render-text'

export default function Languages () {
  const { t } = useTranslation('settings', { keyPrefix: 'language' })
  const { t: languageT } = useTranslation('language')

  const list = useRequest(LanguageListApi)
  const markets = useRequest(MarketOptionsApi)
  const countries = useCountries()

  const openInfo = useOpen<string[]>([])

  const getName = (marketId: number) => {
    const market = markets?.data?.find(m => m.value === marketId)
    if (!market) return '--'
    if (!market.is_main) return market?.label
    return countries?.data?.find(c => c.code === market?.label)?.name
  }

  const columns: STableProps['columns'] = [
    {
      title: '',
      code: 'id',
      name: 'id',
      render: () => (
        <Tooltip title={t('已启用')}>
          <Switch size={'small'} />
        </Tooltip>
      ),
      width: 45
    },
    {
      title: t('语言'),
      code: 'language',
      name: 'language',
      render: (language: string, row: LanguageListRes) => (
        <Flex align={'center'} gap={12}>
          {languageT(language)}
          <SRender render={row.is_default}>
            <Status type={'info'}>{t('默认')}</Status>
          </SRender>
        </Flex>
      ),
      width: 150
    },
    {
      title: t('对应市场'),
      code: 'market_ids',
      name: 'market_ids',
      render: (market_ids: number[]) => (
        <Flex>
          {
            renderText(
              market_ids?.length
                ? market_ids?.map((market_id) => (
                  getName(market_id)
                ))
                : ''
            )
          }
        </Flex>
      ),
      width: 200
    },
    {
      title: '',
      code: 'id',
      name: 'id',
      render: () => (
        <Flex gap={12} align={'center'}>
          <Button type={'link'} size={'small'}>{t('翻译')}</Button>
          <Button type={'link'} size={'small'}>{t('配置到市场')}</Button>
        </Flex>
      ),
      width: 120
    }
  ]

  return (
    <Page
      header={
        <Button
          onClick={() => { openInfo.edit(list?.data?.map(i => i.language)) }}
          style={{ position: 'relative', top: 2 }}
          type={'primary'}
        >
          {t('添加语言')}
        </Button>
      }
      loading={list.loading || countries.loading || markets.loading}
      title={t('语言')}
      width={700}
    >
      <SCard
        tips={t('语言可配置到市场中，但只有启用后才对用户可见。')}
      >
        <STable borderless className={'table-border'} init data={list?.data || []} columns={columns} />
      </SCard>

      <AddLanguage onFresh={list.refresh} openInfo={openInfo} />
    </Page>
  )
}
