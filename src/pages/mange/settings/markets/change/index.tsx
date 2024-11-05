import { useEffect } from 'react'
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
import { Button, Flex } from 'antd'

import { useCountries } from '@/api/base/countries'
import { MarketInfoApi, MarketInfoRes } from '@/api/market/info'
import Page from '@/components/page'
import SCard from '@/components/s-card'
import SRender from '@/components/s-render'
import SSelect from '@/components/s-select'
import Status from '@/components/status'
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

  const options = [
    { label: t('今天'), value: 1 },
    { label: t('过去7天'), value: 2 },
    { label: t('过去30天'), value: 3 }
  ]

  useEffect(() => {
    if (!id) return
    info.run({ id })
  }, [id])

  return (
    <Page
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
      loading={info.loading || countries.loading}
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
          <Flex wrap={'wrap'} gap={12}>
            {
              countryList?.map(c => (
                <Flex align={'center'} gap={8} key={c.code} className={styles.country}>
                  <div style={{ backgroundImage: `url(${c.flag?.src})` }} className={styles.icon} />
                  <div>{c.name}</div>
                </Flex>
              ))
            }
          </Flex>
        </SCard>

        <SCard tips={t('仅管理你的商店在此市场中的客户体验')} title={t('市场设置')}>
          <div className={styles.container}>
            <Flex align={'center'} justify={'space-between'} className={styles.item}>
              <Flex gap={16} align={'center'} justify={'space-between'}>
                <IconLanguage size={18} />
                <Flex vertical gap={2}>
                  <div>{t('域名和语言')}</div>
                  <div>sdfaa8fsdf2.myshopline.com • 英语</div>
                </Flex>
              </Flex>
              <IconChevronRight size={16} />
            </Flex>
            <Flex align={'center'} justify={'space-between'} className={styles.item}>
              <Flex gap={16} align={'center'} justify={'space-between'}>
                <IconShoppingBag size={18} />
                <Flex vertical gap={2}>
                  <div>{t('产品和定价')}</div>
                  <div>{t('美元(USD US$)')}</div>
                </Flex>
              </Flex>
              <IconChevronRight size={16} />
            </Flex>
            <Flex align={'center'} justify={'space-between'} className={styles.item}>
              <Flex gap={16} align={'center'} justify={'space-between'}>
                <IconTruckDelivery size={18} />
                <Flex vertical gap={2}>
                  <div>{t('发货')}</div>
                  <div>{t('1 组方案的 1 项费率 • 发货到美国')}</div>
                </Flex>
              </Flex>
              <IconChevronRight size={16} />
            </Flex>
            <Flex align={'center'} justify={'space-between'} className={styles.item}>
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
            <Flex align={'center'} justify={'space-between'} className={styles.item}>
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
