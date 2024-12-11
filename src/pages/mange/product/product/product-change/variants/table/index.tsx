import React, { ReactNode, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { IconTag } from '@tabler/icons-react'
import { Button, Flex, Form } from 'antd'

import SEmpty from '@/components/s-empty'
import SRender from '@/components/s-render'
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
  settingsStyle: React.CSSProperties
  isFull: boolean
  setLoaded: () => void
}

export default function Table (props: TableProps) {
  const { isFull, variants, options, loading, onChangeGroupVariants, onOpenOptions, forceChange, settingsStyle, setLoaded } = props
  const form = Form.useFormInstance()
  const [groupVariants, setGroupVariants] = useState<Variant[]>([])
  const [expandedRowKeys, setExpandedRowKeys] = useState<number[]>([])
  const [filters, setFilters] = useState<Record<string, string>>({})
  const [groupName, setGroupName] = useState('')
  const [locationId, setLocationId] = useState(0)
  const [labels, setLabels] = useState<Record<string, ReactNode>>({})
  const { id } = useParams()
  const { t } = useTranslation('product', { keyPrefix: 'product' })

  const { columns, ColumnSettings, ImageUploader } = useColumns({
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

  const renderTable = useMemo(() => {
    if (!ColumnSettings) return false
    if (!columns?.length) return false
    if (!variants?.length || variants?.length === 1) return true
    console.log(groupName && !groupVariants?.length, 'groupName && !groupVariants?.length')
    if (groupName && !groupVariants?.length) return false
    console.log(variants?.length && !groupVariants?.length, 'variants?.length && !groupVariants?.length')
    if (variants?.length && !groupVariants?.length) return false
    console.log(variants?.length && !groupVariants?.length, 'variants?.length && !groupVariants?.length')
    if (groupName && !groupVariants?.[0]?.children?.length) return false
    console.log(variants?.[0]?.name?.length > 1 && !groupName, 'variants?.[0]?.name?.length > 1 && !groupName')
    if (variants?.[0]?.name?.length > 1 && !groupName) return false
    console.log(Number(variants?.[0]?.name?.length || 0) !== options.length, 'Number(variants?.[0]?.name?.length || 0) !== options.length')
    if (Number(variants?.[0]?.name?.length || 0) !== options.length) return false
    console.log(id && !variants?.length, 'id && !variants?.length')
    if (id && !variants?.length) return false
    return true
  }, [groupVariants, groupName, columns, variants, ColumnSettings, locationId, options])

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
      <div style={{ position: 'absolute', top: -33, ...settingsStyle }}>
        {ColumnSettings}
      </div>
      <Flex wrap={'wrap'} align={'center'} gap={12}>
        <Flex style={{ width: '100%' }} gap={48} align={'center'}>
          <GroupBy
            key={'groupBy'}
            groupName={groupName}
            setGroupName={setGroupName}
            filters={filters}
            onChange={setGroupVariants}
            variants={variants}
            options={options}
          />
          <Form.Item noStyle className={'mb0'} name={'enabled_location_ids'}>
            <LocationsSelect key={'location'} selected={locationId} setSelected={setLocationId} />
          </Form.Item>
        </Flex>
        <Filters labels={labels} setLabels={setLabels} key={'filters'} value={filters} onChange={setFilters} options={options} />
      </Flex>
      <SRender render={renderTable}>
        <STable
          className={styles.table}
          width={isFull ? undefined : 916}
          init
          loading={loading}
          columns={columns}
          data={filterGroup}
          useVirtual={variants.length > 30}
          expand={{ value: expandedRowKeys, onChange: setExpandedRowKeys }}
        >
          <SEmpty
            image={<IconTag style={{ marginBottom: 16 }} size={80} color={'#eee'} />}
            title={t('添加你的商品款式')}
          >
            <div style={{ marginTop: -20 }}>
              {t('设置商品选项（如尺寸、颜色）以添加不同款式。')}
            </div>
            <Flex justify={'center'}>
              <Button style={{ marginTop: 32 }} type={'primary'} onClick={onOpenOptions}>
                {t('添加款式')}
              </Button>
            </Flex>
          </SEmpty>
        </STable>
      </SRender>
    </div>
  )
}
