import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { useRequest } from 'ahooks'
import { Flex, Form, Input, Radio, Tooltip } from 'antd'
import cloneDeep from 'lodash/cloneDeep'

import { useCountries } from '@/api/base/countries'
import { DomainListApi, DomainStatus } from '@/api/domain/list'
import { MarketUpDomainApi } from '@/api/domain/update'
import { LanguageListApi } from '@/api/languages/list'
import { MarketInfoApi } from '@/api/market/info'
import { UpdateMarketLangApi } from '@/api/market/update-market-lang'
import TransHandle from '@/api/trans-handle'
import Page from '@/components/page'
import SCard from '@/components/s-card'
import { sMessage } from '@/components/s-message'
import SRender from '@/components/s-render'
import SSelect from '@/components/s-select'
import { useNav } from '@/hooks/use-nav'
import LanguagesItems from '@/pages/mange/settings/markets/languages/languages-items'
import { isEqualHandle } from '@/utils/is-equal-handle'

import styles from './index.module.less'

export default function MarketLanguages () {
  const { t } = useTranslation('settings', { keyPrefix: 'market' })
  const id = Number(useParams().id || 0)
  const languages = useRequest(LanguageListApi)
  const domainList = useRequest(async () => await DomainListApi({ status: [DomainStatus.ConnectSuccess] }))
  const info = useRequest(MarketInfoApi, { manual: true })
  const countries = useCountries()
  const countryList = countries?.data?.filter(c => info?.data?.country_codes?.includes(c.code))
  const [form] = Form.useForm()
  const mainDomain = domainList?.data?.find(d => d.is_main)
  const otherDomains = domainList?.data?.filter(d => !d.is_main)
  const update = useRequest(MarketUpDomainApi, { manual: true })
  const updateMarketLang = useRequest(UpdateMarketLangApi, { manual: true })
  const init = useRef<any>()
  const [isChange, setIsChange] = useState(false)
  const [defaultLanguageId, setDefaultLangugaeId] = useState(0)
  const nav = useNav()

  const domain_type = Form.useWatch('domain_type', form)

  const onValuesChange = (force?: boolean) => {
    const values = form.getFieldsValue(true)
    if (!init.current || force === true || !init.current?.language_ids?.length) {
      init.current = cloneDeep(values)
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
    await form.validateFields().catch(err => {
      const msg = err.errorFields?.[0]?.errors?.[0]
      if (msg) {
        sMessage.warning(msg)
      }
      throw new Error(err)
    })
    const values = form.getFieldsValue()
    await update.runAsync({ id: Number(id), ...values })
    await updateMarketLang.runAsync({ language_ids: values?.language_ids, id, default_language_id: defaultLanguageId })
    await info.refreshAsync()
    await languages.refreshAsync()
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
    if (!languages?.data?.length) return
    setDefaultLangugaeId(info?.data?.default_language_id || 0)
  }, [info?.data?.default_language_id])

  return (
    <Page
      onOk={onOk}
      isChange={isChange || (!!defaultLanguageId && defaultLanguageId !== info?.data?.default_language_id)}
      onCancel={onCancel}
      loading={!info.data?.id || !countries?.data?.length || !domainList.data?.length || !languages.data?.length || languages?.loading || info?.loading}
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
      <Form onValuesChange={onValuesChange} form={form}>
        <Flex vertical gap={16}>
          <SCard
            tips={
              <TransHandle
                to={'/settings/domains'}
                title={t('域名和语言')}
                i18nkey={t('你可以在域名设置上管理主域名及子域名')}
              >
                {t('域名设置')}
              </TransHandle>
            }
            title={t('域名')}
          >
            <Form.Item name={'domain_type'} style={{ marginBottom: 12 }}>
              <Radio.Group options={[{ value: 1, label: t('使用主域名') }]} />
            </Form.Item>
            <SRender render={domain_type === 1} style={{ marginLeft: 24, marginTop: -12, marginBottom: info?.data?.is_main ? 0 : 12 }}>
              {mainDomain?.domain}
            </SRender>

            <SRender render={!info?.data?.is_main}>
              <Tooltip placement={'topLeft'} title={otherDomains?.length === 0 ? t('没有可用的子域名') : undefined}>
                <Form.Item
                  name={'domain_type'}
                  extra={<div style={{ marginLeft: 24, marginTop: -4 }}>{t('子域名提示')}</div>}
                  style={{ marginBottom: 12 }}
                >
                  <Radio.Group options={[{ value: 2, label: t('使用子域名'), disabled: otherDomains?.length === 0 }]} />
                </Form.Item>
              </Tooltip>
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
          </SCard>

          <Form.Item
            rules={[{ required: true, message: t('至少选择一种语言') }]}
            className={'mb0'}
            name={'language_ids'}
          >
            <LanguagesItems
              info={info.data}
              defaultLanguageId={defaultLanguageId}
              setDefaultLanguageId={setDefaultLangugaeId}
              languages={languages.data || []}
              mainDomain={mainDomain}
              domainList={domainList?.data || []}
            />
          </Form.Item>
        </Flex>
      </Form>
    </Page>
  )
}
