import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { Button, Checkbox, Flex, Form, Tooltip } from 'antd'

import { DomainListRes } from '@/api/domain/list'
import { LanguageListRes } from '@/api/languages/list'
import SCard from '@/components/s-card'
import SRender from '@/components/s-render'
import STable, { STableProps } from '@/components/s-table'
import Status from '@/components/status'

export interface LanguagesItemsProps {
  languages: LanguageListRes[]
  mainDomain?: DomainListRes
  domainList?: DomainListRes[]
  value?: number[]
  onChange?: (v: number[]) => void
  defaultLanguageId: number
  setDefaultLangugaeId: (v: number) => void
}

export default function LanguagesItems (props: LanguagesItemsProps) {
  const { languages, mainDomain, domainList, value = [], onChange, defaultLanguageId, setDefaultLangugaeId } = props
  const form = Form.useFormInstance()
  const subDomainID = Form.useWatch('sub_domain_id', form)
  const domainPrefix = Form.useWatch('domain_suffix', form)
  const { t: languageT } = useTranslation('language')
  const { t } = useTranslation('settings', { keyPrefix: 'market' })
  const domain_type = Form.useWatch('domain_type', form)
  const id = Number(useParams().id || 0)

  const onChecked = (id: number) => {
    if (value.includes(id)) {
      onChange?.(value.filter(i => i !== id))
    } else {
      onChange?.([...value, id])
    }
  }

  const columns: STableProps['columns'] = [
    {
      title: <div style={{ marginLeft: 32 }}>{t('语言')}</div>,
      name: 'language',
      code: 'language',
      render: (language: string, row: LanguageListRes) => (
        <Flex gap={16} align={'center'}>
          <div>
            <Tooltip title={languages?.length === 1 ? t('至少启用一个语言') : undefined}>
              <Checkbox
                onChange={() => { onChecked(row.id) }}
                disabled={languages?.length === 1}
                checked={value.includes(row.id)}
              />
            </Tooltip>
          </div>
          <Flex gap={8} align={'center'}>
            {languageT(language)}
            <SRender render={defaultLanguageId === row.id}>
              <Status type={'info'}>{t('默认')}</Status>
            </SRender>
          </Flex>
        </Flex>
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
    if (!languages?.length) return
    const selected = languages?.filter(i => i.markets?.map(i => i.market_id)?.includes(id))
    onChange?.(selected?.map(i => i.id))
    const defaultLang = languages?.find(ii => ii.markets?.find(o => o.market_id === id)?.is_default)?.id
    setDefaultLangugaeId(defaultLang || 0)
  }, [languages?.length])

  return (
    <SCard
      tips={t('选择要在此市场中为客户提供的语言，你可以在商店语言上管理这些内容')}
      title={t('语言')}
      extra={
        <SRender render={languages?.length !== 1}>
          <Button type={'link'} size={'small'}>{t('切换默认语言')}</Button>
        </SRender>
      }
    >
      <STable
        onRowClick={row => { onChecked(row.id) }}
        borderless
        className={'table-border'}
        columns={columns}
        data={languages || []}
      />
    </SCard>
  )
}
