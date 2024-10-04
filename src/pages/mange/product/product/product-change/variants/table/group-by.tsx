import { useEffect } from 'react'
import { Flex, Form } from 'antd'

import SSelect from '@/components/s-select'
import { Option, Variant } from '@/pages/mange/product/product/product-change/variants/state'
import styles from '@/pages/mange/product/product/product-change/variants/table/index.module.less'

// @ts-expect-error
import Handle from './group-handle?worker'

export interface GroupByProps {
  options: Option[]
  variants: Variant[]
  onChange: (grouped: Variant[]) => void
  filters: Record<string, string>
  groupName: string
  setGroupName: (groupName: string) => void
}

export default function GroupBy (props: GroupByProps) {
  const { options, variants, onChange, filters, setGroupName, groupName } = props
  const form = Form.useFormInstance()

  const onChangeHandle = (newVariants: Variant[]) => {
    onChange(newVariants)
  }

  const filterHandle = () => {
    const list = variants.map(variant => {
      const isEvery = variant.name.every(item => {
        if (!filters[item.label]) return true
        return filters[item.label] === item.value
      })
      return { ...variant, hidden: !isEvery }
    })
    const oldVariants: Variant[] = [];
    (form.getFieldValue('variants') as Variant[])?.forEach(item => {
      if (item.children) {
        oldVariants.push(...item.children)
      } else {
        oldVariants.push(item)
      }
    })
    return list.map(item => {
      const find = oldVariants.find(i => i.id === item.id)
      return find ? { ...find, hidden: item.hidden } : item
    })
  }

  useEffect(() => {
    const list = filterHandle()
    const handle: Worker = new Handle()
    handle.postMessage({ options, variants: list, groupName })
    handle.onmessage = (e) => {
      onChangeHandle(e.data)
    }
  }, [variants, groupName, filters])

  useEffect(() => {
    if (options.length < 2) {
      setGroupName('')
      return
    }
    const option = options.find(i => i.name === groupName)
    if (!option && options.length >= 2) {
      setGroupName(options?.[0]?.name)
    }
  }, [variants, groupName, options])

  if (options.length < 2) return null

  return (
    <>
      <span className={styles.textLine}>|</span>
      <Flex align={'center'} gap={8}>
        <div style={{ flexShrink: 0 }}>Group by</div>
        <SSelect
          value={groupName}
          onChange={setGroupName}
          options={options.map(({ name }) => ({
            label: name,
            value: name
          }))}
          size={'small'}
          dropdownStyle={{ minWidth: 200 }}
          style={{ minWidth: 120 }}
        />
      </Flex>
    </>
  )
}
