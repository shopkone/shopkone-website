import { useEffect, useState } from 'react'
import { Button, Flex } from 'antd'
import { useAtomValue } from 'jotai/index'

import TableFilter from '@/components/table-filter'
import { Variant, variantsAtom, variantsOptions } from '@/pages/product/product/product-change/state'

import styles from './index.module.less'

export interface FilterProps {
  groupName?: string
  onChange: (variants: Variant[]) => void
}

export default function Filter (props: FilterProps) {
  const { groupName, onChange } = props
  const options = useAtomValue(variantsOptions)
  const variants = useAtomValue(variantsAtom)
  const [filter, setFilter] = useState<Record<string, number>>()

  const onClearAllFilter = () => {
    setFilter(undefined)
  }

  useEffect(() => {
    if (!variants?.length || !filter || !Object.keys(filter).length) {
      onChange(variants || [])
      return
    }
    onChange(variants.filter(item => {
      return item.name?.every(i => !filter[i.label] || (filter[i.label] === i.id))
    }))
  }, [variants, filter])

  return (
    <Flex gap={6} align={'center'} className={styles.filter}>
      {
      !!groupName && (<div className={styles.label}>Filter</div>
      )
      }

      {
      options?.filter(i => i.name && i.values?.[0]?.value)?.map(item => (
        <TableFilter
          radio={{
            options: item.values?.map(i => ({ label: i.value, value: i.id }))?.filter(i => i.label),
            value: filter?.[item.name],
            onChange: (value) => {
              setFilter(prev => ({ ...prev, [item.name]: Number(value || 0) }))
            }
          }}
          key={item.id}
        >
          {item.name}
        </TableFilter>
      ))
    }
      {
        !!filter && (
          <Button onClick={onClearAllFilter} className={styles.btn} size={'small'} type={'link'}>
            Clear all
          </Button>
        )
      }
    </Flex>
  )
}
