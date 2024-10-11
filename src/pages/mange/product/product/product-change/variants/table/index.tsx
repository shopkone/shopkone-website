import React, { ReactNode, useEffect, useMemo, useState } from 'react'
import { Button, Flex, Form } from 'antd'

import SRender from '@/components/s-render'
import STable from '@/components/s-table'
import FilterLabels from '@/components/table-filter/FilterLabels'
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
  isFull: boolean
  setLoaded: () => void
}

export default function Table (props: TableProps) {
  const { isFull, variants, options, loading, onChangeGroupVariants, onOpenOptions, setLoaded } = props
  const form = Form.useFormInstance()
  const [groupVariants, setGroupVariants] = useState<Variant[]>([])
  const [expandedRowKeys, setExpandedRowKeys] = useState<number[]>([])
  const [filters, setFilters] = useState<Record<string, string>>({})
  const [groupName, setGroupName] = useState('')
  const [locationId, setLocationId] = useState(0)
  const [labels, setLabels] = useState<Record<string, ReactNode>>({})

  const { columns, ImageUploader } = useColumns({
    variants: groupVariants,
    setVariants: setGroupVariants,
    groupName,
    expands: expandedRowKeys,
    setExpands: setExpandedRowKeys,
    locationId,
    isFull
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

  const renderTable = useMemo(() => {
    if (!columns?.length) return false
    if (groupName && !groupVariants?.length) return false
    if (variants?.length && !groupVariants?.length) return false
    return true
  }, [groupVariants, groupName, columns, variants, locationId])

  useEffect(() => {
    form.setFieldValue('variants', groupVariants)
    onChangeGroupVariants(groupVariants)
    if (groupVariants.length) {
      setLoaded()
    }
  }, [groupVariants])

  return (
    <div style={{ position: 'relative' }}>
      {ImageUploader}
      <div style={{ marginBottom: 12 }}>
        <Flex style={{ marginBottom: 12 }} align={'center'} justify={'space-between'}>
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
        <Filters labels={labels} setLabels={setLabels} key={'filters'} value={filters} onChange={setFilters} options={options} />
      </div>
      <FilterLabels style={{ marginBottom: 12 }} labels={labels} value={filters} onChange={setFilters} />
      <SRender render={renderTable}>
        <STable
          className={styles.table}
          width={isFull ? undefined : 578}
          init
          loading={loading}
          columns={columns}
          data={filterGroup}
          useVirtual={variants.length > 30}
          expand={{ value: expandedRowKeys, onChange: setExpandedRowKeys }}
          empty={{
            title: 'Please configure the variant options for the product.',
            desc: <span style={{ fontSize: 13 }}>Set options like size and color for the product variations.</span>,
            actions: (
              <Flex align={'center'} justify={'center'}>
                <Button type={'primary'} onClick={onOpenOptions}>Set options</Button>
              </Flex>
            )
          }}
        />
      </SRender>
    </div>
  )
}
