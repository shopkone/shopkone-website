import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { IconChevronDown } from '@tabler/icons-react'
import { useMemoizedFn, useRequest } from 'ahooks'
import { Button, Collapse, Flex } from 'antd'
import classNames from 'classnames'
import { ItemType } from 'rc-collapse/es/interface'

import { useCountries } from '@/api/base/countries'
import { MarketInfoApi } from '@/api/market/info'
import { ShippingZoneListApi } from '@/api/shipping/list-by-contry-codes'
import CountryFlag from '@/components/country-flag'
import Page from '@/components/page'
import SRender from '@/components/s-render'
import { useNav } from '@/hooks/use-nav'
import Zones from '@/pages/mange/settings/shipping/courier-service/change/zones'

import styles from './index.module.less'

export default function MarketShipping () {
  const { t } = useTranslation('settings', { keyPrefix: 'market' })
  const id = Number(useParams().id || 0)
  const info = useRequest(MarketInfoApi, { manual: true })
  const list = useRequest(ShippingZoneListApi, { manual: true })
  const countries = useCountries()
  const nav = useNav()
  const getCountryName = useMemoizedFn((code: string) => {
    return countries.data?.find(c => c.code === code)?.name
  })

  const zones = useMemo(() => {
    if (!list?.data?.length) return []
    return list?.data?.map(zone => {
      const codes = zone.codes?.map(c => c?.country_code)
      return { ...zone, codes }
    })
  }, [list?.data])

  const items = useMemo(() => {
    if (!info?.data?.country_codes?.length) return []
    return info?.data?.country_codes?.map(code => {
      const currentZones = zones?.filter(i => i.codes?.includes(code))
      let feeCount = 0
      currentZones.forEach(zone => {
        feeCount += zone.fees?.length || 0
      })
      const item: ItemType = {
        collapsible: !currentZones?.length ? 'disabled' : undefined,
        extra: (
          <div
            style={{ color: currentZones?.length ? '#4f4700' : '#646a73', position: 'relative', top: 1 }}
          >
            {
              currentZones?.length
                ? t('x组方案的y项费率', {
                  x: currentZones?.length,
                  y: feeCount
                })
                : t('未设置运费方案')
            }
          </div>
        ),
        key: code,
        label: (
          <Flex
            style={{
              fontWeight: 'bolder',
              fontSize: 14
            }} align={'center'} gap={8}
          >
            <div style={{ transform: 'scale(0.9)' }}>
              <CountryFlag country={code} size={16} />
            </div>
            {getCountryName(code)}
          </Flex>
        ),
        children: (
          <SRender render={currentZones?.length}>
            {
              currentZones?.map((zone, index) => (
                <div style={{ marginTop: index ? 16 : 4 }} key={zone.id}>
                  <Flex
                    align={'center'} justify={'space-between'}
                    style={{ fontWeight: 'bolder', margin: 4 }}
                  >
                    {zone.shipping_name || t('通用方案')}
                    <Button
                      onClick={() => {
                        nav(`/settings/shipping/courier-service/change/${zone.id}?type=${zone?.shipping_name ? 2 : 1}`, { title: t('市场') })
                      }} type={'link'} size={'small'}
                    >
                      {t('管理发货')}
                    </Button>
                  </Flex>
                  <Zones value={[zone]} />
                </div>
              ))
            }
          </SRender>
        )
      }
      return item
    })
  }, [zones, info?.data?.country_codes])

  useEffect(() => {
    if (!id) return
    info.runAsync({ id }).then(res => {
      list.run({ country_codes: res.country_codes })
    })
  }, [id])

  return (
    <Page
      loadingHiddenBg
      back={`/settings/markets/change/${id}`}
      width={700}
      title={
        <Flex align={'center'} gap={12}>
          {t('商品与定价')}
          <span className={styles.moreTips}>#{info?.data?.name || '--'}</span>
        </Flex>
      }
      loading={info.loading || !list.data || !countries.data}
    >
      <Flex vertical gap={16}>
        <Collapse
          rootClassName={styles.collapse}
          expandIconPosition={'end'}
          expandIcon={p => (
            <Flex>
              <div style={{ fontSize: 13, marginRight: 8 }}>{p.extra}</div>
              <IconChevronDown
                className={
                  classNames(
                    styles.expandIcon,
                    { [styles.expanded]: p.isActive }
                  )
                }
                size={16}
              />
            </Flex>
          )}
          bordered={false}
          items={items}
        />
      </Flex>
    </Page>
  )
}
