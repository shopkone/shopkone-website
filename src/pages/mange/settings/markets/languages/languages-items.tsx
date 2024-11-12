import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { useRequest } from 'ahooks'
import { Button, Checkbox, Flex, Form, Tooltip } from 'antd'

import { useLanguageList } from '@/api/base/languages'
import { DomainListRes } from '@/api/domain/list'
import { LanguageListRes } from '@/api/languages/list'
import { MarketInfoRes } from '@/api/market/info'
import { MarketOptionsApi } from '@/api/market/options'
import SCard from '@/components/s-card'
import SRender from '@/components/s-render'
import STable, { STableProps } from '@/components/s-table'
import Status from '@/components/status'
import { useOpen } from '@/hooks/useOpen'
import SelectDefaultModal from '@/pages/mange/settings/markets/languages/select-default-modal'

export interface LanguagesItemsProps {
  languages: LanguageListRes[]
  mainDomain?: DomainListRes
  domainList?: DomainListRes[]
  value?: number[]
  onChange?: (v: number[]) => void
  defaultLanguageId: number
  setDefaultLanguageId: (v: number) => void
  info?: MarketInfoRes
}

export default function LanguagesItems (props: LanguagesItemsProps) {
  const { languages, mainDomain, domainList, value = [], onChange: onChangeHandle, defaultLanguageId, setDefaultLanguageId, info } = props
  const form = Form.useFormInstance()
  const subDomainID = Form.useWatch('sub_domain_id', form)
  const domainPrefix = Form.useWatch('domain_suffix', form)
  const { t } = useTranslation('settings', { keyPrefix: 'market' })
  const domain_type = Form.useWatch('domain_type', form)
  const id = Number(useParams().id || 0)
  const openInfo = useOpen<number>()
  const marketOptions = useRequest(MarketOptionsApi)
  const mainMarket = marketOptions.data?.find(i => i.is_main)
  const justUseMainConfig = mainMarket?.value !== id && domain_type === 1
  const languageList = useLanguageList()

  const oldValue = useRef<{ defaultLanguageId: number, value: number[] }>()

  const onChange = (v: number[]) => {
    // 如果默认语言没有选中，则选择第一个为默认值
    if (!v.includes(defaultLanguageId)) {
      setDefaultLanguageId(v[0])
    }
    onChangeHandle?.(v)
  }

  const getCheckBoxTips = (row: LanguageListRes) => {
    if (languages?.length === 1) return
    if (justUseMainConfig) return t('使用主域名时，默认使用主市场的语言设置，可前往主市场 变更语言')
    if (row.id === defaultLanguageId) return t('默认语言不可禁用，如需禁用，请切换默认语言')
  }

  const onChecked = (id: number) => {
    if (languages?.length === 1) return
    const item = languages.find(i => i.id === id)
    if (!item) return
    if (getCheckBoxTips(item)) return
    if (value.includes(id)) {
      onChange?.(value.filter(i => i !== id))
    } else {
      onChange?.([...value, id])
    }
  }

  const columns: STableProps['columns'] = [
    {
      title: <div style={{ marginLeft: languages?.length === 1 || justUseMainConfig ? 0 : 32 }}>{t('语言')}</div>,
      name: 'language',
      code: 'language',
      render: (language: string, row: LanguageListRes) => (
        <Tooltip title={getCheckBoxTips(row)}>
          <Flex gap={16} align={'center'}>
            <div style={{ display: languages?.length === 1 || justUseMainConfig ? 'none' : undefined }}>
              <Checkbox
                onChange={() => { onChecked(row.id) }}
                disabled={!!getCheckBoxTips(row)}
                checked={value.includes(row.id)}
              />
            </div>
            <Flex gap={8} align={'center'}>
              {languageList?.data?.find(i => i.value === language)?.label}
              <SRender render={defaultLanguageId === row.id}>
                <Status type={'info'}>{t('默认')}</Status>
              </SRender>
            </Flex>
          </Flex>
        </Tooltip>
      )
    },
    {
      title: t('URL名称'),
      name: 'language',
      code: 'language',
      render: (language: string, row: LanguageListRes) => {
        if (domain_type === 1) {
          if (row.is_default) return mainDomain?.domain
          return `${mainDomain?.domain}/${language}`
        }
        if (domain_type === 2) {
          return `${subDomainID ? domainList?.find(d => d.id === subDomainID)?.domain : ''}`
        }
        if (domain_type === 3) {
          return `${mainDomain?.domain}/${language}-${domainPrefix || ''}`
        }
      }
    }
  ]

  useEffect(() => {
    if (!info) return
    onChange?.(info?.language_ids)
  }, [info])

  useEffect(() => {
    if (!mainMarket || !value?.length) return
    if (justUseMainConfig) {
      // 如果不是主市场且用了主域名，则使用主域名的配置
      oldValue.current = { defaultLanguageId, value }
      setDefaultLanguageId(mainMarket.default_language_id)
      onChange?.(mainMarket.language_ids)
    } else if (oldValue.current?.defaultLanguageId) {
      setDefaultLanguageId(oldValue.current.defaultLanguageId)
      onChange?.(oldValue.current.value)
    }
  }, [justUseMainConfig, mainMarket?.default_language_id])

  return (
    <SCard
      tips={
      justUseMainConfig
        ? (
            t('使用主域名时，默认使用主市场的语言设置，可前往主市场 变更语言')
          )
        : t('选择要在此市场中为客户提供的语言，你可以在商店语言上管理这些内容')
      }
      title={t('语言')}
      extra={
        <SRender render={languages?.length !== 1 && !justUseMainConfig}>
          <Button onClick={() => { openInfo.edit(defaultLanguageId) }} type={'link'} size={'small'}>
            {t('切换默认语言')}
          </Button>
        </SRender>
      }
    >
      <STable
        loading={marketOptions.loading}
        onRowClick={(justUseMainConfig || languages?.length === 1) ? undefined : row => { onChecked(row.id) }}
        borderless
        className={'table-border'}
        columns={columns}
        data={languages || []}
      />

      <SelectDefaultModal
        languages={languages}
        openInfo={openInfo}
        onConfirm={(langId) => {
          setDefaultLanguageId(langId)
          onChange?.(value.includes(langId) ? value : [...value, langId])
        }}
      />
    </SCard>
  )
}
