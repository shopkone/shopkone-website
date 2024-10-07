import { useEffect, useMemo, useState } from 'react'
import { Button, Flex, Form } from 'antd'

import STable from '@/components/s-table'
import { Option, Variant } from '@/pages/mange/product/product/product-change/variants/state'
import Filters from '@/pages/mange/product/product/product-change/variants/table/filters'
import GroupBy from '@/pages/mange/product/product/product-change/variants/table/group-by'
import LocationsSelect from '@/pages/mange/product/product/product-change/variants/table/locations'
import useColumns from '@/pages/mange/product/product/product-change/variants/table/use-columns'

import styles from './index.module.less'

export interface TableProps {
  variants: Variant[]
  options: Option[]
  loading: boolean
  onChangeGroupVariants: (variants: Variant[]) => void
  onOpenOptions: () => void
  forceChange: (variants: Variant[]) => void
}

export default function Table (props: TableProps) {
  const { variants, options, loading, onChangeGroupVariants, onOpenOptions, forceChange } = props
  const form = Form.useFormInstance()
  const [groupVariants, setGroupVariants] = useState<Variant[]>([])
  const [expandedRowKeys, setExpandedRowKeys] = useState<number[]>([])
  const [filters, setFilters] = useState<Record<string, string>>({})
  const [groupName, setGroupName] = useState('')
  const [locationId, setLocationId] = useState(0)

  const { columns, ColumnSettings } = useColumns({
    variants: groupVariants,
    setVariants: setGroupVariants,
    groupName,
    expands: expandedRowKeys,
    setExpands: setExpandedRowKeys,
    locationId,
    forceChange
  })

  const filterGroup = useMemo(() => {
    if (!Object.values(filters).filter(Boolean).length) return groupVariants
    let v = groupVariants.filter(item => {
      return !item.hidden
    })
    v = v.map(i => {
      const children = i.children?.filter(item => !item.hidden)
      return { ...i, children }
    })
    return v
  }, [groupVariants])

  useEffect(() => {
    form.setFieldValue('variants', groupVariants)
    onChangeGroupVariants(groupVariants)
  }, [groupVariants])

  return (
    <div>
      <div>{ColumnSettings}</div>
      <Flex style={{ marginBottom: 12 }} align={'center'} gap={32}>
        <Filters key={'filters'} value={filters} onChange={setFilters} options={options} />
        <GroupBy
          key={'groupBy'}
          groupName={groupName}
          setGroupName={setGroupName}
          filters={filters}
          onChange={setGroupVariants}
          variants={variants}
          options={options}
        />
        <LocationsSelect key={'location'} selected={locationId} setSelected={setLocationId} />
      </Flex>
      <STable
        className={styles.table}
        width={916}
        init={!!columns.length}
        loading={loading}
        columns={columns}
        data={filterGroup}
        expand={{ value: expandedRowKeys, onChange: setExpandedRowKeys }}
        empty={{
          img: 'asd',
          desc: 'adsad',
          title: 'xxx',
          actions: (
            <Flex align={'center'} justify={'center'}>
              <Button type={'primary'} onClick={onOpenOptions}>Edit options</Button>
            </Flex>
          )
        }}
      />
    </div>
  )
}
