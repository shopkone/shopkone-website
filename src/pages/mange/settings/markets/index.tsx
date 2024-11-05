import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { IconChevronRight } from '@tabler/icons-react'
import { useRequest } from 'ahooks'
import { Button, Flex, Typography } from 'antd'

import { useCountries } from '@/api/base/countries'
import { MarketListApi } from '@/api/market/list'
import Page from '@/components/page'
import SCard from '@/components/s-card'
import SRender from '@/components/s-render'
import SSelect from '@/components/s-select'
import RandomGradientBackground from '@/pages/mange/settings/markets/random-bg'

import styles from './index.module.less'

export default function Markets () {
  const list = useRequest(MarketListApi)
  const countries = useCountries()
  const { t } = useTranslation('settings', { keyPrefix: 'market' })
  const nav = useNavigate()

  const options = [
    { label: t('今天'), value: 1 },
    { label: t('过去7天'), value: 2 },
    { label: t('过去30天'), value: 3 }
  ]

  const getCountry = (code: string) => {
    return countries?.data?.find(c => c.code === code)
  }

  return (
    <Page
      header={
        <Flex gap={12} align={'center'}>
          <Button>{t('偏好设置')}</Button>
          <Button type={'primary'} style={{ height: 26 }} onClick={() => { nav('add') }}>
            {t('添加市场')}
          </Button>
        </Flex>
      }
      loading={list.loading || countries.loading}
      loadingHiddenBg
      title={t('市场')}
      width={700}
    >
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
        title={t('预览')}
      >
        <div className={styles.container}>
          {
            list?.data?.map((item) => (
              <Flex
                onClick={() => { nav(`change/${item.id}`) }}
                align={'center'}
                gap={80}
                justify={'space-between'}
                className={styles.item} key={item.id}
              >
                <Flex style={{ width: 180 }} align={'center'} gap={12}>
                  <SRender
                    render={item.country_codes?.length === 1}
                    className={styles.icon}
                    style={{
                      backgroundImage: `url(${countries?.data?.find(c => c.code === item.country_codes[0])?.flag?.src})`,
                      flexShrink: 0
                    }}
                  />
                  <SRender style={{ flexShrink: 0 }} render={item.country_codes?.length !== 1}>
                    <RandomGradientBackground>{item?.name}</RandomGradientBackground>
                  </SRender>
                  <Flex align={'flex-start'} vertical>
                    <Typography.Text style={{ width: 180 }} ellipsis={{ tooltip: true }} className={styles.name}>
                      {item.is_main ? getCountry(item.name)?.name : item.name}
                    </Typography.Text>
                    <SRender className={'tips'} render={item.is_main}>
                      {t('主要市场')}
                    </SRender>
                  </Flex>
                </Flex>

                <Flex align={'center'} justify={'space-between'} gap={18} flex={1}>
                  <Flex vertical gap={2}>
                    <div>0%</div>
                    <div className={'secondary'}>{t('总销售额份额')}</div>
                  </Flex>
                  <Flex gap={2} vertical>
                    <div>$0</div>
                    <div className={'secondary'}>{t('销售额')}</div>
                  </Flex>
                  <Flex gap={2} vertical>
                    <div>0%</div>
                    <div className={'secondary'}>{t('转化率')}</div>
                  </Flex>

                  <IconChevronRight size={16} />
                </Flex>
              </Flex>
            ))
          }
        </div>
      </SCard>
    </Page>
  )
}
