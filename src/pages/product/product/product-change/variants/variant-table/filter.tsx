import { useEffect, useState } from 'react'
import { Button, Flex } from 'antd'

import SRender from '@/components/s-render'
import TableFilter from '@/components/table-filter'
import { Options } from '@/pages/product/product/product-change/variants/variant-changer'
import { Variant } from '@/pages/product/product/product-change/variants/variant-table/index'
import { genId } from '@/utils/random'

// @ts-expect-error
import GroupNameHandle from './group-name-handle?worker'
import styles from './index.module.less'
// @ts-expect-error
import OptionsHandle from './options-handle?worker'

export interface FilterProps {
  onChange: (variants: Variant[]) => void
  options: Options[]
  hide?: boolean
  groupName?: string
  isSingleVariantType: boolean
}

export default function Filter (props: FilterProps) {
  const { onChange, hide, groupName, options, isSingleVariantType = true } = props
  const [variants, setVariants] = useState<Variant[]>([])
  const [filter, setFilter] = useState<Record<string, string>>()

  const onClearAllFilter = () => {
    setFilter(undefined)
  }

  useEffect(() => {
    if (isSingleVariantType) return
    const worker: Worker = new OptionsHandle()
    worker.postMessage({ options })
    worker.onmessage = (e) => {
      setVariants(e.data)
    }
  }, [options, isSingleVariantType])

  useEffect(() => {
    if (isSingleVariantType) {
      setVariants([{ name: [], id: genId(), weight_uint: 'g', price: 0, isParent: false }])
    } else {
      setVariants([])
    }
  }, [isSingleVariantType])

  useEffect(() => {
    if (!variants?.length) {
      onChange(variants || [])
      return
    }
    const v = variants.filter(item => {
      if (!item.name) return false
      if (!filter || !Object.values(filter).find(i => i)) return true
      return item.name.every(name => {
        if (!filter[name.label]) return true
        return filter[name.label] === name.value
      })
    })
    if (!groupName) {
      onChange(v || [])
      return
    }
    const worker: Worker = new GroupNameHandle()
    worker.postMessage({ groupName, variants: v, options })
    worker.onmessage = (e) => {
      onChange(e.data)
    }
  }, [variants, filter, groupName])

  if (hide) return null

  return (
    <Flex gap={6} align={'center'} className={styles.filter}>
      <SRender style={{ width: 54, color: '#646a73', fontSize: 12 }} render={groupName}>
        Filter
      </SRender>

      {
        options?.filter(i => i.name && i.values?.[0]?.value)?.map(item => (
          <TableFilter
            radio={{
              options: item.values?.map(i => ({ label: i.value, value: i.value }))?.filter(i => i.label),
              value: filter?.[item.name],
              onChange: (value) => {
                setFilter(prev => ({ ...prev, [item.name]: (value || '').toString() }))
              }
            }}
            key={item.id}
          >
            {item.name}
          </TableFilter>
        ))
      }
      {
        !!Object.values(filter || {})?.filter(i => i)?.length && (
          <Button onClick={onClearAllFilter} className={styles.btn} size={'small'} type={'link'}>
            Clear all
          </Button>
        )
      }
    </Flex>
  )
}
