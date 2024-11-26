import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { IconPlus, IconTrash } from '@tabler/icons-react'
import { useMemoizedFn } from 'ahooks'
import { BaseTableProps } from 'ali-react-table'
import { Button, Form } from 'antd'

import { useCountries } from '@/api/base/countries'
import { TaxFeeItem } from '@/api/customer/info'
import IconButton from '@/components/icon-button'
import SSelect from '@/components/s-select'
import STable from '@/components/s-table'
import { genId } from '@/utils/random'

export interface TaxTableProps {
  value?: TaxFeeItem[]
  onChange?: (value: TaxFeeItem[]) => void
  onAdd: () => void
}

export default function TaxTable (props: TaxTableProps) {
  const { value, onChange, onAdd } = props
  const { t } = useTranslation('customers', { keyPrefix: 'info' })
  const countries = useCountries()
  const form = Form.useFormInstance()
  const all = Form.useWatch('all', form)
  const free = Form.useWatch('free', form)

  const onSelectZones = useMemoizedFn((countryCode: string, zones: string[]) => {
    const newValue = value?.map(item => {
      if (item.country_code === countryCode) {
        const oldHasAll = item.zones.includes('all')
        const newHasAll = zones.includes('all')
        let temp = zones
        if (oldHasAll) {
          temp = temp.filter(i => i !== 'all')
        }
        if (!oldHasAll && newHasAll) {
          temp = ['all']
        }
        return { ...item, zones: temp }
      } else {
        return item
      }
    })
    onChange?.(newValue || [])
  })

  const onSelectCountry = useMemoizedFn((id: number, countryCode: string) => {
    const newValue = value?.map(item => {
      if (item.id === id) {
        const country = countries.data?.find(item => item.code === countryCode)
        return { ...item, country_code: countryCode, zones: country?.zones?.length ? [] : ['all'] }
      } else {
        return item
      }
    })
    onChange?.(newValue || [])
  })

  const addCountryItem = useMemoizedFn(() => {
    const newItem = {
      id: genId(),
      country_code: undefined,
      zones: []
    } as any
    onChange?.([...(value || []), newItem])
    setTimeout(() => {
      onAdd()
    })
  })

  const onRemoveItem = useMemoizedFn((id: number) => {
    const newValue = value?.filter(item => item.id !== id)
    onChange?.(newValue || [])
  })

  // 过滤已经选中的国家
  const countryOptions = useMemo(() => {
    return countries?.data?.map(item => {
      return { label: item.name, value: item.code }
    })
  }, [value, countries?.data])

  const columns: BaseTableProps['columns'] = [
    {
      title: t('国家/地区'),
      code: 'country_code',
      name: 'country_code',
      lock: true,
      width: 300,
      render: (countryCode: string, row: TaxFeeItem) => {
        const options = countryOptions?.filter(i => {
          return !value?.map(item => item.country_code).includes(i.value) || countryCode === i.value
        })
        return (
          <SSelect
            onChange={e => { onSelectCountry(row.id, e) }}
            showSearch
            optionLabelProp={'label'}
            optionFilterProp={'label'}
            value={countryCode}
            options={options}
          />
        )
      }
    },
    {
      title: t('州/省(可多选)'),
      code: 'zones',
      name: 'zones',
      render: (zones: string[], row: TaxFeeItem) => {
        const country = countries.data?.find(item => item.code === row.country_code)
        const zonesOptions = country?.zones?.map(zone => ({ label: zone.name, value: zone.code }))
        return (
          <SSelect
            showSearch
            optionLabelProp={'label'}
            optionFilterProp={'label'}
            onChange={e => { onSelectZones(row.country_code, e) }}
            value={zones}
            mode={'tags'}
            maxTagCount={zones.length > 1 ? 0 : undefined}
            maxTagPlaceholder={t('共x个区域', { x: zones.length })}
            disabled={!country?.zones?.length}
            options={[{ label: t('全部区域'), value: 'all' }].concat(zonesOptions || [])}
          />
        )
      }
    },
    {
      title: '',
      code: 'id',
      name: 'id',
      render: (id: number) => (
        <IconButton onClick={() => { onRemoveItem(id) }} type={'text'} size={24}>
          <IconTrash size={15} />
        </IconButton>
      ),
      width: 50,
      hidden: value?.length === 1
    }
  ]

  return (
    <div style={{ display: (all || !free) ? 'none' : 'block', paddingBottom: 64 }}>
      <STable
        stickyTop={-16}
        init={!!countries.data}
        borderless
        className={'table-border'}
        columns={columns}
        data={value || []}
      />
      <Button
        onClick={addCountryItem}
        style={{ marginTop: 12, fontSize: 13 }}
      >
        <IconPlus size={14} />
        {t('添加免税区域')}
      </Button>
    </div>
  )
}
