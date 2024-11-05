import { useTranslation } from 'react-i18next'
import { useRequest } from 'ahooks'
import { Button, Flex, Switch } from 'antd'

import { useCountries } from '@/api/base/countries'
import { useLanguageList } from '@/api/base/languages'
import { LanguageListApi, LanguageListRes } from '@/api/languages/list'
import { MarketOptionsApi } from '@/api/market/options'
import Page from '@/components/page'
import SCard from '@/components/s-card'
import SRender from '@/components/s-render'
import STable, { STableProps } from '@/components/s-table'
import Status from '@/components/status'

export default function Languages () {
  const { t } = useTranslation('settings', { keyPrefix: 'language' })
  const { t: languageT } = useTranslation('language')

  const list = useRequest(LanguageListApi)
  const markets = useRequest(MarketOptionsApi)
  const countries = useCountries()
  const languages = useLanguageList()

  const getName = (marketId: number) => {
    const market = markets?.data?.find(m => m.value === marketId)
    if (!market) return '--'
    if (!market.is_main) return market?.label
    return countries?.data?.find(c => c.code === market?.label)?.name
  }

  const columns: STableProps['columns'] = [
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
      )
    },
    {
      title: t('对应市场'),
      code: 'market_ids',
      name: 'market_ids',
      render: (market_ids: number[]) => (
        <Flex>
          {
            market_ids?.map((market_id) => (
              getName(market_id)
            ))
          }
        </Flex>
      )
    },
    {
      title: '',
      code: 'id',
      name: 'id',
      render: () => (
        <Flex>
          <Button>asd</Button>
          <Button>asd</Button>
          <Switch />
        </Flex>
      )
    }
  ]

  return (
    <Page
      loading={list.loading || countries.loading || markets.loading || languages.loading}
      title={t('语言')}
      width={700}
    >
      <SCard
        tips={t('语言可配置到市场中，但只有启用后才对用户可见。')}
      >
        <STable borderless className={'table-border'} init data={list?.data || []} columns={columns} />
      </SCard>
    </Page>
  )
}
