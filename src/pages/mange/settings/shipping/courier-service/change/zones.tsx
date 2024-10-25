import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { IconPlus, IconWorld } from '@tabler/icons-react'
import { useMemoizedFn } from 'ahooks'
import { Button, Card, Empty, Flex, Tooltip } from 'antd'
import classNames from 'classnames'

import { useCountries } from '@/api/base/countries'
import { BaseShippingZone, BaseShippingZoneFee } from '@/api/shipping/base'
import SRender from '@/components/s-render'
import { useOpen } from '@/hooks/useOpen'
import FeeModal from '@/pages/mange/settings/shipping/courier-service/change/fee-modal'
import ZoneModal from '@/pages/mange/settings/shipping/courier-service/change/zone-modal'
import { getTextWidth } from '@/utils'

import styles from './index.module.less'

export interface ZonesProps {
  value?: BaseShippingZone[]
  onChange?: (value: BaseShippingZone[]) => void
}

export default function Zones (props: ZonesProps) {
  const { onChange, value = [] } = props
  const { t } = useTranslation('settings', { keyPrefix: 'shipping' })
  const openInfo = useOpen<BaseShippingZone>()
  const feeOpenInfo = useOpen<BaseShippingZoneFee>()
  const countries = useCountries()
  const [expands, setExpands] = useState<number[]>()

  const onConfirm = (item: BaseShippingZone) => {
    const find = value.find(i => i.id === item.id)
    if (find) {
      onChange?.(value?.map(i => i.id === find.id ? item : i))
    } else {
      onChange?.([...value, item])
    }
  }

  const onExpand = (item: BaseShippingZone) => {
    setExpands(expands?.includes(item.id) ? expands.filter(i => i !== item.id) : [...expands || [], item.id])
  }

  const getZoneName = useMemoizedFn((codes: string[]) => {
    const names = new Map<string, { country: string, zones: string[] }>()

    if (!countries?.data?.length) return Array.from(names.values())

    for (const code of codes) {
      const [countryCode, zoneCode] = code.split('_____')

      // 先处理国家
      const country = countries.countryMap.get(countryCode)
      if (country) {
        let entry = names.get(country.name)
        if (!entry) {
          entry = { country: country.name, zones: [] }
          names.set(country.name, entry)
        }

        // 再处理区域
        const zone = country.zones.find((z: any) => z.code === zoneCode)
        if (zone) {
          entry.zones.push(zone.name)
        }
      }
    }
    return Array.from(names.values())
  })

  return (
    <Card title={t('收货地点')}>
      <SRender render={!value.length}>
        <Empty
          image={<IconWorld size={64} color={'#eee'} />}
          description={t('暂无数据')}
          style={{ paddingBottom: 24 }}
        >
          <Button onClick={() => { openInfo.edit() }}>
            {t('添加区域')}
          </Button>
        </Empty>
      </SRender>

      <SRender style={{ marginTop: 8 }} render={value.length}>
        {
          value.map((item, index) => {
            const names = getZoneName(item.codes)
            const width = getTextWidth(names.reduce((i, ii) => ii.country + i, ''), 13) + names.length * 14
            return (
              <div key={item.name}>
                <div>
                  <Flex align={'center'} justify={'space-between'}>
                    <div className={styles.name}>{item.name}</div>
                    <Flex align={'center'}>
                      <Button
                        onClick={() => {
                          openInfo.edit(item)
                        }} type={'link'} size={'small'}
                      >
                        {t('编辑')}
                      </Button>
                      <Button type={'link'} size={'small'} danger>
                        {t('删除')}
                      </Button>
                    </Flex>
                  </Flex>
                  <div className={classNames(styles.inner, expands?.includes(item.id) && styles.expanded)}>
                    <span style={{ flexShrink: 0 }}>{t('配送至')}</span>
                    {names.map((i, index) => (
                      <Tooltip placement={'top'} title={i.zones.join(t('逗号'))} key={index}>
                        <SRender render={index}>{t('逗号')}</SRender>
                        <span className={i.zones?.length ? styles.hasZones : ''}>
                          {i.country}{i.zones?.length ? `(${i.zones.length})` : undefined}
                        </span>
                      </Tooltip>
                    ))}
                    <SRender render={expands?.includes(item.id)}>
                      <span onClick={() => { onExpand(item) }} className={styles.expand} style={{ top: 1 }}>
                        {t('隐藏部分')}
                      </span>
                    </SRender>
                  </div>
                  <SRender render={!expands?.includes(item.id) && width > 400}>
                    <span onClick={() => { onExpand(item) }} className={styles.expand}>
                      {t('展示全部')}
                    </span>
                  </SRender>
                </div>

                <div className={styles.areaItem}>
                  <SRender render={!item?.fees?.length}>
                    <Flex justify={'center'} align={'center'} style={{ padding: 16 }} vertical>
                      {t('请为该区域添加运费')}

                      <Button onClick={() => { feeOpenInfo.edit() }} type={'primary'} style={{ marginTop: 16 }}>
                        {t('添加运费')}
                      </Button>
                    </Flex>
                  </SRender>
                </div>
                <SRender
                  render={index !== value.length - 1} className={'line'} style={{
                    margin: '16px 0',
                    width: '100%'
                  }}
                />
              </div>
            )
          })
        }
      </SRender>

      <SRender render={value.length}>
        <Button
          style={{ marginTop: 16 }}
          onClick={() => {
            openInfo.edit()
          }}
        >
          <IconPlus size={14} />
          {t('添加区域')}
        </Button>
      </SRender>

      <ZoneModal
        olds={value}
        confirm={onConfirm}
        openInfo={openInfo}
      />

      <FeeModal openInfo={feeOpenInfo} />
    </Card>
  )
}
