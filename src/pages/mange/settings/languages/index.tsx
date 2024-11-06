import { useTranslation } from 'react-i18next'
import { IconLanguage, IconTrash, IconWorld } from '@tabler/icons-react'
import { useRequest } from 'ahooks'
import { Button, Flex, Switch, Tooltip, Typography } from 'antd'

import { useCountries } from '@/api/base/countries'
import { LanguageListApi, LanguageListRes } from '@/api/languages/list'
import { MarketOptionsApi } from '@/api/market/options'
import IconButton from '@/components/icon-button'
import Page from '@/components/page'
import SCard from '@/components/s-card'
import { useModal } from '@/components/s-modal'
import SRender from '@/components/s-render'
import STable, { STableProps } from '@/components/s-table'
import Status from '@/components/status'
import { useOpen } from '@/hooks/useOpen'
import AddLanguage from '@/pages/mange/settings/languages/add-language'
import MarketModal from '@/pages/mange/settings/languages/market-modal'
import { renderText } from '@/utils/render-text'

export default function Languages () {
  const { t } = useTranslation('settings', { keyPrefix: 'language' })
  const { t: languageT } = useTranslation('language')

  const list = useRequest(LanguageListApi)
  const markets = useRequest(MarketOptionsApi)
  const countries = useCountries()
  const modal = useModal()

  const openInfo = useOpen<string[]>([])
  const marketInfo = useOpen<{ marketIds: number[], languageId: number }>()

  const getName = (marketId: number) => {
    const market = markets?.data?.find(m => m.value === marketId)
    if (!market) return '--'
    if (!market.is_main) return market?.label
    return countries?.data?.find(c => c.code === market?.label)?.name
  }

  const onRemove = async (id: number) => {
    modal.confirm({
      title: t('确定删除吗？'),
      content: t('删除后，语言将不再显示在列表中，但已配置的翻译语料依旧保留。'),
      onOk: async () => {
        list.refresh()
      },
      okButtonProps: { danger: true },
      okText: t('删除')
    })
  }

  const columns: STableProps['columns'] = [
    {
      title: '',
      code: 'is_active',
      name: 'is_active',
      render: (is_active: boolean) => (
        <Tooltip title={t('已启用')}>
          <Switch checked={is_active} size={'small'} />
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
        <Typography.Text ellipsis={{ tooltip: true }}>
          {
            renderText(
              market_ids?.length
                ? market_ids?.map((market_id) => (
                  getName(market_id)
                )).join('、')
                : ''
            )
          }
        </Typography.Text>
      ),
      width: 200
    },
    {
      title: '',
      code: 'id',
      name: 'id',
      render: (id: number, row: LanguageListRes) => (
        <Flex gap={16} align={'center'}>
          <Tooltip title={t('翻译')}>
            <IconButton size={24} type={'text'}>
              <IconLanguage size={15} />
            </IconButton>
          </Tooltip>
          <Tooltip title={t('配置到市场')}>
            <IconButton
              onClick={() => {
                marketInfo.edit({ languageId: row.id, marketIds: row.market_ids })
              }} size={24} type={'text'}
            >
              <IconWorld size={15} />
            </IconButton>
          </Tooltip>
          <SRender render={(list?.data?.length || 0) > 0}>
            <IconButton onClick={async () => { await onRemove(id) }} size={24} type={'text'}>
              <IconTrash size={15} />
            </IconButton>
          </SRender>
        </Flex>
      ),
      width: (list?.data?.length || 0) > 0 ? 100 : 80
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

      <MarketModal
        languages={list.data || []}
        onFresh={list.refresh}
        openInfo={marketInfo}
        marketOptions={markets?.data || []}
      />
    </Page>
  )
}
