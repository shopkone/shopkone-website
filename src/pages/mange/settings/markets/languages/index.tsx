import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { useRequest } from 'ahooks'
import { Button, Checkbox, Flex, Form, Input, Radio, Tooltip } from 'antd'
import cloneDeep from 'lodash/cloneDeep'

import { useCountries } from '@/api/base/countries'
import { DomainListApi, DomainStatus } from '@/api/domain/list'
import { MarketUpDomainApi } from '@/api/domain/update'
import { LanguageListApi, LanguageListRes } from '@/api/languages/list'
import { MarketInfoApi } from '@/api/market/info'
import Page from '@/components/page'
import SCard from '@/components/s-card'
import { sMessage } from '@/components/s-message'
import SRender from '@/components/s-render'
import SSelect from '@/components/s-select'
import STable, { STableProps } from '@/components/s-table'
import Status from '@/components/status'
import { isEqualHandle } from '@/utils/is-equal-handle'

import styles from './index.module.less'

export default function MarketLanguages () {
  const { t } = useTranslation('settings', { keyPrefix: 'market' })
  const id = Number(useParams().id || 0)
  const languages = useRequest(LanguageListApi)
  const languageList = languages?.data?.filter(i => i.is_active) || []
  const domainList = useRequest(async () => await DomainListApi({ status: [DomainStatus.ConnectSuccess] }))
  const info = useRequest(MarketInfoApi, { manual: true })
  const { t: languageT } = useTranslation('language')
  const countries = useCountries()
  const countryList = countries?.data?.filter(c => info?.data?.country_codes?.includes(c.code))
  const [form] = Form.useForm()
  const mainDomain = domainList?.data?.find(d => d.is_main)
  const otherDomains = domainList?.data?.filter(d => !d.is_main)
  const update = useRequest(MarketUpDomainApi, { manual: true })
  const init = useRef<any>()
  const [isChange, setIsChange] = useState(false)

  const domain_type = Form.useWatch('domain_type', form)
  const subDomainID = Form.useWatch('sub_domain_id', form)
  const domainPrefix = Form.useWatch('domain_suffix', form)

  const [selectedLanguages, setSelectedLanguages] = useState<number[]>([])

  const columns: STableProps['columns'] = [
    {
      title: <div style={{ marginLeft: 32 }}>{t('语言')}</div>,
      name: 'language',
      code: 'language',
      render: (language: string, row: LanguageListRes) => (
        <Flex gap={16} align={'center'}>
          <Tooltip title={languageList?.length === 1 ? t('至少启用一个语言') : undefined}>
            <Checkbox disabled={languageList?.length === 1} checked={selectedLanguages.includes(row.id)} />
          </Tooltip>
          <Flex gap={8} align={'center'}>
            {languageT(language)}
            <SRender render={row.markets?.find(i => i.market_id === id)?.is_default}>
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
      render: (language: string) => {
        if (domain_type === 1) {
          return mainDomain?.domain
        }
        if (domain_type === 2) {
          return `${subDomainID ? domainList?.data?.find(d => d.id === subDomainID)?.domain : ''}`
        }
        if (domain_type === 3) {
          return `${mainDomain?.domain}/${language}-${domainPrefix || ''}`
        }
      }
    }
  ]

  const onValuesChange = (force?: boolean) => {
    const values = form.getFieldsValue(true)
    if (!init.current || force === true) {
      init.current = cloneDeep(values)
      console.log(init.current, 'init.current')
      return
    }
    const isSame = isEqualHandle(values, init.current)
    setIsChange(!isSame)
  }

  const onCancel = () => {
    form.setFieldsValue(init.current)
    setIsChange(false)
  }

  const onOk = async () => {
    await form.validateFields()
    const values = form.getFieldsValue()
    await update.runAsync({ id: Number(id), ...values })
    info.refresh()
    setIsChange(false)
    sMessage.success(t('更新成功'))
  }

  useEffect(() => {
    if (!id) return
    info.run({ id })
  }, [id])

  useEffect(() => {
    if (domain_type === 2) {
      if (!form.getFieldValue('sub_domain_id')) {
        form.setFieldValue('sub_domain_id', otherDomains?.[0]?.id)
      }
    }
  }, [domain_type])

  useEffect(() => {
    if (!info.data) return
    form.setFieldsValue(info.data)
    onValuesChange(true)
  }, [info.data])

  useEffect(() => {
    if (!languageList?.length || !info?.data) return
    const selected = languageList?.filter(i => i.markets?.map(i => i.market_id)?.includes(id))
    setSelectedLanguages(selected?.map(i => i.id))
  }, [languageList?.length, info?.data])

  return (
    <Page
      onOk={onOk}
      isChange={isChange}
      onCancel={onCancel}
      loading={!info.data?.id || !countries?.data?.length || !domainList.data?.length || !languages.data?.length}
      loadingHiddenBg
      back={`/settings/markets/change/${id}`}
      title={
        <Flex align={'center'} gap={12}>
          {t('域名和语言')}
          <SRender
            className={countryList?.length === 1 ? undefined : styles.moreTips}
            render={info.data?.id ? countries?.data?.length : null}
            style={{ fontSize: 13, fontWeight: 450 }}
          >
            <Tooltip
              mouseEnterDelay={0.01}
              title={countryList?.length === 1 ? undefined : countryList?.map(i => i.name).join('、')}
            >
              #{info?.data?.is_main ? countryList?.[0]?.name : info?.data?.name}
            </Tooltip>
          </SRender>
        </Flex>
      }
      width={700}
    >
      <Flex vertical gap={16}>
        <SCard
          tips={t('你可以在域名设置上管理主域名及子域名')}
          title={t('域名')}
        >
          <Form onValuesChange={onValuesChange} form={form}>
            <Form.Item name={'domain_type'} style={{ marginBottom: 12 }}>
              <Radio.Group options={[{ value: 1, label: t('使用主域名') }]} />
            </Form.Item>
            <SRender render={domain_type === 1} style={{ marginLeft: 24, marginTop: -12, marginBottom: info?.data?.is_main ? 0 : 12 }}>
              {mainDomain?.domain}
            </SRender>

            <SRender render={!info?.data?.is_main}>
              <Form.Item
                name={'domain_type'}
                extra={<div style={{ marginLeft: 24, marginTop: -4 }}>{t('子域名提示')}</div>}
                style={{ marginBottom: 12 }}
              >
                <Radio.Group options={[{ value: 2, label: t('使用子域名'), disabled: otherDomains?.length === 0 }]} />
              </Form.Item>
              <SRender render={domain_type === 2}>
                <Form.Item name={'sub_domain_id'} style={{ marginLeft: 24, marginTop: -8, marginBottom: 12 }}>
                  <SSelect options={otherDomains?.map(i => ({ label: i.domain, value: i.id }))} />
                </Form.Item>
              </SRender>
            </SRender>

            <SRender render={!info?.data?.is_main}>
              <Form.Item
                name={'domain_type'}
                extra={<div style={{ marginLeft: 24, marginTop: -4 }}>{t('子文件夹提示')}</div>}
                style={{ marginBottom: 12 }}
              >
                <Radio.Group options={[{ value: 3, label: t('设置子文件夹') }]} />
              </Form.Item>
              <SRender render={domain_type === 3}>
                <Form.Item
                  name={'domain_suffix'}
                  rules={[
                    {
                      required: true,
                      message: t('请输入后缀')
                    }, {
                      pattern: /^[a-zA-Z]+$/,
                      message: t('后缀只能包含字母')
                    }]}
                  style={{ marginLeft: 24, marginTop: -8, marginBottom: 12 }}
                >
                  <Input autoComplete={'off'} prefix={'/'} />
                </Form.Item>
              </SRender>
            </SRender>

          </Form>
        </SCard>

        <SCard
          tips={t('选择要在此市场中为客户提供的语言，你可以在商店语言上管理这些内容')}
          title={t('语言')}
          extra={
            <SRender render={languageList?.length !== 1}>
              <Button type={'link'} size={'small'}>{t('切换默认语言')}</Button>
            </SRender>
          }
        >
          <STable
            borderless
            className={'table-border'}
            columns={columns}
            data={languageList}
          />
        </SCard>
      </Flex>
    </Page>
  )
}
