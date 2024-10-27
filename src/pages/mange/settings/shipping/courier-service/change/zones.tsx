import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { IconPencil, IconPlus, IconTrash, IconWorld } from '@tabler/icons-react'
import { useMemoizedFn } from 'ahooks'
import { Button, Empty, Flex, Tooltip } from 'antd'
import classNames from 'classnames'

import { useCountries } from '@/api/base/countries'
import { BaseShippingZone, BaseShippingZoneFee } from '@/api/shipping/base'
import IconButton from '@/components/icon-button'
import SCard from '@/components/s-card'
import SRender from '@/components/s-render'
import STable, { STableProps } from '@/components/s-table'
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
  const feeOpenInfo = useOpen<{ fee?: BaseShippingZoneFee, zoneId: number }>({ zoneId: 0 })
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

  const onUpdateFee = (item: { fee?: BaseShippingZoneFee, zoneId: number }) => {
    setExpands([])
    const { fee, zoneId } = item
    if (!fee) return
    const zone = value.find(i => i.id === zoneId)
    if (!zone) return
    const zoneFee = zone.fees.find(i => i.id === fee?.id)
    if (zoneFee) {
      zone.fees = zone.fees?.map(i => i.id === fee?.id ? fee : i)
      onChange?.(value?.map(i => i.id === zone.id ? zone : i))
    } else {
      zone.fees = [...zone.fees, fee]
      onChange?.(value?.map(i => i.id === zone.id ? zone : i))
    }
  }

  const feeColumns = useMemoizedFn((item: BaseShippingZone): STableProps['columns'] => [
    {
      title: t('运费名称'),
      code: 'name',
      name: 'name',
      width: 200,
      render: (name: string, row: BaseShippingZoneFee) => {
        if (!row.id) {
          return (
            null
          )
        }
        return name
      }
    },
    {
      title: t('运费'),
      code: 'fees',
      name: 'fees',
      render: (_, row: BaseShippingZoneFee) => {
        if (!row.id) {
          return (
            <Button onClick={() => { feeOpenInfo.edit({ zoneId: item.id }) }} style={{ position: 'relative', left: 85 }} type={'link'} size={'small'}>
              <IconPlus size={14} />
              {t('添加运费')}
            </Button>
          )
        }
        return 123
      },
      width: 250
    },
    {
      title: t('货到付款'),
      name: 'cod',
      code: 'cod',
      render: (cod: boolean, row: BaseShippingZoneFee) => {
        if (!row.id) return null
        if (cod) {
          return t('支持')
        }
        return t('不支持')
      }
    },
    {
      title: '',
      name: 'id',
      code: 'id',
      render: (_, row: BaseShippingZoneFee) => (
        <SRender render={row.id}>
          <Flex gap={12}>
            <IconButton onClick={() => { feeOpenInfo.edit({ fee: row, zoneId: item.id }) }} type={'text'} size={24}>
              <IconPencil size={16} />
            </IconButton>
            <IconButton type={'text'} size={24}>
              <IconTrash size={15} />
            </IconButton>
          </Flex>
        </SRender>
      ),
      width: 80
    }
  ])

  const onExpand = (item: BaseShippingZone) => {
    setExpands(expands?.includes(item.id) ? expands.filter(i => i !== item.id) : [...expands || [], item.id])
  }

  const disabledList = useMemo(() => {
    const disabledItems: string[] = []
    value.forEach((zone: BaseShippingZone) => {
      if (zone.id === openInfo.data?.id) {
        return
      }
      disabledItems.push(...zone.codes)
    })
    return disabledItems
  }, [value, openInfo.data?.id])

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
    <SCard title={t('收货地点')}>
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
                <div style={{ marginBottom: 8 }}>
                  <Flex justify={'space-between'} align={'center'} gap={12}>
                    <div className={styles.name}>{item.name}</div>
                    <Flex style={{ marginTop: -2, position: 'relative', bottom: -23 }} align={'center'}>
                      <Button
                        onClick={() => {
                          openInfo.edit(item)
                        }} type={'link'} size={'small'}
                      >
                        {t('编辑区域')}
                      </Button>
                      <Button type={'link'} size={'small'} danger>
                        {t('删除区域')}
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
                    <span onClick={() => { onExpand(item) }} style={{ marginLeft: 0 }} className={styles.expand}>
                      {t('展示全部')}
                    </span>
                  </SRender>
                </div>

                <SRender render={!item?.fees?.length} className={styles.areaItem}>
                  <Flex justify={'center'} align={'center'} style={{ padding: 16 }} vertical>
                    {t('请为该区域添加运费')}

                    <Button onClick={() => { feeOpenInfo.edit({ zoneId: item.id }) }} type={'primary'} style={{ marginTop: 16 }}>
                      {t('添加运费')}
                    </Button>
                  </Flex>
                </SRender>

                <SRender render={item?.fees?.length}>
                  <STable
                    borderless
                    className={'table-border'}
                    data={[...item.fees, { id: 0 }]}
                    columns={feeColumns(item)}
                    init
                  />
                </SRender>
                <div
                  className={'line'} style={{
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
        disabled={disabledList}
        olds={value}
        confirm={onConfirm}
        openInfo={openInfo}
      />

      <FeeModal olds={value?.find(i => i.id === feeOpenInfo?.data?.zoneId)?.fees || []} onConfirm={onUpdateFee} openInfo={feeOpenInfo} />
    </SCard>
  )
}
