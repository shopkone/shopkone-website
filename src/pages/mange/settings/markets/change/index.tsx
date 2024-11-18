import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import {
  IconChevronDown,
  IconChevronRight,
  IconCreditCard,
  IconLanguage,
  IconShoppingBag,
  IconTax,
  IconTruckDelivery
} from '@tabler/icons-react'
import { useRequest } from 'ahooks'
import { Button, Flex, Typography } from 'antd'

import { useCountries } from '@/api/base/countries'
import { useCurrencyList } from '@/api/base/currency-list'
import { useLanguageList } from '@/api/base/languages'
import { DomainListApi } from '@/api/domain/list'
import { LanguageListApi } from '@/api/languages/list'
import { MarketInfoApi, MarketInfoRes } from '@/api/market/info'
import { ShippingZoneListApi } from '@/api/shipping/list-by-contry-codes'
import Page from '@/components/page'
import SCard from '@/components/s-card'
import SRender from '@/components/s-render'
import SSelect from '@/components/s-select'
import Status from '@/components/status'
import { useNav } from '@/hooks/use-nav'
import { useOpen } from '@/hooks/useOpen'
import MarketEditModal from '@/pages/mange/settings/markets/change/market-edit-modal'

import styles from './index.module.less'

export default function MarketChange () {
  const id = Number(useParams().id || 0)
  const info = useRequest(MarketInfoApi, { manual: true })
  const countries = useCountries()
  const countryList = countries?.data?.filter(c => info?.data?.country_codes?.includes(c.code))
  const { t } = useTranslation('settings', { keyPrefix: 'market' })
  const openEdit = useOpen<MarketInfoRes>()
  const nav = useNav()
  const domainList = useRequest(DomainListApi)
  const languages = useRequest(LanguageListApi)
  const languageList = useLanguageList()
  const currencyList = useCurrencyList()
  const currency = currencyList?.data?.find(c => c.code === info?.data?.currency_code)
  const shippingList = useRequest(ShippingZoneListApi, { manual: true })
  const [isOpen, setIsIOpen] = useState(false)

  const options = [
    { label: t('今天'), value: 1 },
    { label: t('过去7天'), value: 2 },
    { label: t('过去30天'), value: 3 }
  ]

  const domain = useMemo(() => {
    if (!domainList?.data?.length || !info?.data?.domain_type) return '--'
    if (info?.data?.domain_type === 1) {
      return domainList?.data?.find(i => i.is_main)?.domain
    }
    if (info?.data?.domain_type === 2) {
      return domainList?.data?.find(i => i.id === info?.data?.sub_domain_id)?.domain
    }
    const mainDomain = domainList?.data?.find(i => i.is_main)?.domain
    return `${mainDomain}/${info?.data?.domain_suffix}`
  }, [info.data, domainList?.data])

  const langs = useMemo(() => {
    if (!languages?.data?.length || !info?.data?.language_ids?.length) return []
    const items = languages?.data?.filter(l => info?.data?.language_ids?.includes(l.id) && l.id !== info?.data?.default_language_id) || []
    const defaultItem = languages?.data?.find(l => l.id === info?.data?.default_language_id)
    if (!defaultItem) return []
    return [defaultItem, ...items].map(l => languageList?.data?.find(i => i.value === l.language)?.label)
  }, [info.data, languages?.data])

  const langsRender = useMemo(() => {
    console.log({ langs })
    if (!langs?.length) return ''
    if (langs.length > 4) {
      return t('语言x', { x: langs.filter((_, i) => i < 3)?.join(t('，')), y: langs?.length || 0 })
    }
    return langs.join(t('，'))
  }, [langs])

  const { shippingCount, feeCount, shippingCountry } = useMemo(() => {
    let shippingCountry: string[] = []
    if (!info?.data?.id || !shippingList.data) return { shippingCount: 0, feeCount: 0, shippingCountry }
    let shippingIds: number[] = []
    let feeCount = 0
    shippingList.data?.forEach(zone => {
      shippingCountry.push(...zone.codes?.map(i => i.country_code))
      shippingIds.push(zone.shipping_id)
      feeCount = (zone.fees?.length || 0) + feeCount
    })
    shippingIds = [...new Set(shippingIds)]
    shippingCountry = [...new Set(shippingCountry)]
    return { shippingCount: shippingIds.length, feeCount, shippingCountry }
  }, [info.data, shippingList?.data?.length])

  const shippingCountryNames = useMemo(() => {
    const list = shippingCountry?.map(c => {
      const country = countryList?.find(b => b.code === c)
      return country?.name
    })
    if (!list?.length) return ''
    if (list?.length > 4) {
      return t('发货到x', { x: shippingCount, y: list?.filter((_, i) => i < 3)?.join(t('，')) })
    }
    return t('发货到', { y: list?.filter((_, i) => i < 3)?.join(t('，')) })
  }, [shippingCountry])

  useEffect(() => {
    if (!id) return
    info.run({ id })
  }, [id])

  useEffect(() => {
    if (!info.data) return
    shippingList.run({ country_codes: info.data.country_codes })
  }, [info.data])

  return (
    <Page
      loadingHiddenBg
      header={
        <Flex align={'center'} gap={12}>
          <Button onClick={() => { openEdit.edit(info.data) }} type={'text'}>
            {t('编辑')}
          </Button>
          <Button type={'text'}>
            {t('预览')}
            <IconChevronDown size={15} />
          </Button>
        </Flex>
      }
      loading={!info.data?.id || countries.loading || domainList.loading || languages.loading || currencyList?.loading || !shippingList.data}
      back={'/settings/markets'}
      width={700}
      title={
        <Flex gap={8} align={'center'}>
          {info?.data?.is_main ? countryList?.[0]?.name : info?.data?.name}
          <SRender render={info?.data?.is_main}>
            <Status type={'info'}>{t('主要市场')}</Status>
          </SRender>
        </Flex>
      }
    >
      <Flex gap={16} vertical>
        <SCard title={t('包含的国家/地区')}>
          <Flex align={'center'} wrap={'wrap'} gap={12}>
            {
              countryList?.filter((_, i) => isOpen || i < 8)?.map(c => (
                <Flex align={'center'} gap={8} key={c.code} className={styles.country}>
                  <div style={{ backgroundImage: `url(${c.flag?.src})` }} className={styles.icon} />
                  <div>{c.name}</div>
                </Flex>
              ))
            }
            <SRender render={(countryList?.length || 0) > 8} style={{ height: 24, width: '100%' }} />
            {
              (countryList?.length || 0) > 8 && (
                <Flex gap={4} className={styles.more} align={'center'}>
                  {t('共x个国家/地区', { x: countryList?.length })}
                  <Button
                    onClick={() => { setIsIOpen(!isOpen) }}
                    style={{ fontSize: 13, position: 'relative', top: 1 }}
                    type={'link'}
                    size={'small'}
                  >
                    {isOpen ? t('收起') : t('展开全部')}
                    <IconChevronDown
                      style={{ transform: isOpen ? 'rotate(-180deg)' : 'rotate(0deg)' }}
                      size={15}
                    />
                  </Button>
                </Flex>
              )
            }
          </Flex>
        </SCard>

        <SCard tips={t('仅管理你的商店在此市场中的客户体验')} title={t('市场设置')}>
          <div className={styles.container}>
            <Flex
              onClick={() => { nav(`/settings/markets/languages/${id}`) }}
              align={'center'}
              justify={'space-between'}
              className={styles.item}
            >
              <Flex gap={16} align={'center'} justify={'space-between'}>
                <IconLanguage size={18} />
                <Flex vertical gap={2}>
                  <div>{t('域名和语言')}</div>
                  <Flex align={'center'} gap={8}>
                    <Typography.Text style={{ lineHeight: '12px', maxWidth: 260 }} ellipsis={{ tooltip: { placement: 'topLeft' } }} >
                      {domain}
                    </Typography.Text>
                    <SRender render={langsRender}>
                      <div>•</div>
                    </SRender>
                    <Typography.Text style={{ lineHeight: '12px', width: 260 }} ellipsis={{ tooltip: { placement: 'topLeft' } }} >
                      {langsRender}
                    </Typography.Text>
                  </Flex>
                </Flex>
              </Flex>
              <IconChevronRight size={16} />
            </Flex>
            <Flex
              onClick={() => { nav(`/settings/markets/price-adjust/${id}`) }}
              align={'center'}
              justify={'space-between'}
              className={styles.item}
            >
              <Flex gap={16} align={'center'} justify={'space-between'}>
                <IconShoppingBag size={18} />
                <Flex vertical gap={2}>
                  <div>{t('商品与定价')}</div>
                  <div>{currency?.title} {currency?.symbol}</div>
                </Flex>
              </Flex>
              <IconChevronRight size={16} />
            </Flex>
            <Flex
              onClick={() => { nav(`/settings/markets/shipping/${id}`) }}
              align={'center'}
              justify={'space-between'}
              className={styles.item}
            >
              <Flex gap={16} align={'center'} justify={'space-between'}>
                <IconTruckDelivery size={18} />
                <Flex vertical gap={2}>
                  <div>{t('发货')}</div>
                  <Flex gap={8}>
                    {t('x组方案的y项费率', { x: shippingCount, y: feeCount })}
                    <SRender render={shippingCount}>
                      <div>•</div>
                    </SRender>
                    <Typography.Text
                      style={{ lineHeight: '12px', width: 350, position: 'relative', top: 3 }}
                      ellipsis={{ tooltip: { placement: 'topLeft' } }}
                    >
                      {shippingCountryNames}
                    </Typography.Text>
                  </Flex>
                </Flex>
              </Flex>
              <IconChevronRight size={16} />
            </Flex>
            <Flex
              align={'center'}
              justify={'space-between'}
              className={styles.item}
            >
              <Flex gap={16} align={'center'} justify={'space-between'}>
                <IconCreditCard size={18} />
                <Flex vertical gap={2}>
                  <div>{t('支付')}</div>
                  <div>{t('管理你在全球接受的付款方式')}</div>
                </Flex>
              </Flex>
              <IconChevronRight size={16} />
            </Flex>
          </div>
        </SCard>

        <SCard tips={t('管理影响你的整个商店的国际设置')} title={t('店铺设置')}>
          <div className={styles.container}>
            <Flex
              onClick={() => { nav('/settings/taxes', { title: info?.data?.name }) }}
              align={'center'}
              justify={'space-between'}
              className={styles.item}
            >
              <Flex gap={16} align={'center'} justify={'space-between'}>
                <IconTax size={18} />
                <Flex vertical gap={2}>
                  <div>{t('税费')}</div>
                  <div>{t('收税')}</div>
                </Flex>
              </Flex>
              <IconChevronRight size={16} />
            </Flex>
          </div>
        </SCard>

        <SCard
          extra={
            <SSelect
              value={1}
              labelRender={(info) => `${t('日期范围')} ${info.label}`}
              options={options}
              size={'small'}
              dropdownStyle={{ width: 150 }}
            />
          }
          title={t('市场数据')}
        >
          <Flex flex={1}>
            <Flex align={'center'} flex={1} gap={2} vertical>
              <div>0%</div>
              <div className={'secondary'}>{t('总销售额份额')}</div>
            </Flex>
            <div className={styles.line} />
            <Flex align={'center'} flex={1} gap={2} vertical>
              <div>0%</div>
              <div className={'secondary'}>{t('销售额')}</div>
            </Flex>
            <div className={styles.line} />
            <Flex align={'center'} flex={1} gap={2} vertical>
              <div>0%</div>
              <div className={'secondary'}>{t('转化率')}</div>
            </Flex>
            <div className={styles.line} />
            <Flex align={'center'} flex={1} gap={2} vertical>
              <div>0%</div>
              <div className={'secondary'}>{t('客单价')}</div>
            </Flex>
          </Flex>
        </SCard>
      </Flex>

      <MarketEditModal onFinished={info.refresh} openInfo={openEdit} />
    </Page>
  )
}
