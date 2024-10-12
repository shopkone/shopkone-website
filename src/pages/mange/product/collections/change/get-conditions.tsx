import { Input } from 'antd'

import { useCategories } from '@/api/base/categories'
import Categories from '@/components/categories'
import SInputNumber from '@/components/s-input-number'
import SSelect from '@/components/s-select'
import { useOpen } from '@/hooks/useOpen'

type ValueType = string | number
type onChangeType = (value?: ValueType) => void
interface ComponentProps { value?: ValueType, onChange: onChangeType }

const eq = { label: 'is equal to', value: 'eq' }
const neq = { label: 'is not equal to', value: 'neq' }
const sw = { label: 'starts width', value: 'sw' }
const ew = { label: 'ends width', value: 'ew' }
const ct = { label: 'contains', value: 'ct' }
const nct = { label: 'does not contain', value: 'nct' }
const gt = { label: 'is greater than', value: 'gt' }
const lt = { label: 'is less than', value: 'lt' }
const empty = { label: 'is empty', value: 'empty' }
const nempty = { label: 'is not empty', value: 'nempty' }

const inputNumberRender = (p: ComponentProps, money?: boolean) => {
  return <SInputNumber className={'flex1'} money={money} onChange={e => { p.onChange(e || 0) }} value={typeof p.value === 'undefined' ? undefined : Number(p.value)} />
}

const CategoryRender = (p: { onChange: (value?: number) => void, value?: number }) => {
  const info = useOpen<number>()
  const categories = useCategories()
  const onSelect = (v: number) => {
    p.onChange(v)
    info.close()
  }
  const label = categories?.data?.find(i => i.value === p.value)?.label
  return (
    <div style={{ width: '33%' }}>
      <SSelect
        value={label}
        open={false}
        onDropdownVisibleChange={v => { v && info.edit(p.value) }}
      />
      <Categories info={info} onConfirm={onSelect} data={categories.data} />
    </div>
  )
}

export const conditions = [
  {
    label: 'Title',
    key: 'title',
    component: (p: ComponentProps) => {
      return <Input className={'flex1'} onChange={e => { p.onChange(e.target.value) }} value={p.value} />
    },
    actions: [eq, neq, sw, ew, ct, nct]
  },
  {
    label: 'Type',
    key: 'type',
    component: (p: ComponentProps) => {
      return <Input className={'flex1'} onChange={e => { p.onChange(e.target.value) }} value={p.value} />
    },
    actions: [eq, neq, sw, ew, ct, nct]
  },
  {
    label: 'Category',
    key: 'category',
    component: (p: ComponentProps) => {
      return <CategoryRender value={Number(p.value || 0)} onChange={v => { p.onChange(v) }} />
    },
    actions: [eq]
  },
  {
    label: 'Vendor',
    key: 'vendor',
    component: (p: ComponentProps) => {
      return <Input className={'flex1'} onChange={e => { p.onChange(e.target.value) }} value={p.value} />
    },
    actions: [eq, neq, sw, ew, ct, nct]
  },
  {
    label: 'Tag',
    key: 'tag',
    component: (p: ComponentProps) => {
      return <Input className={'flex1'} onChange={e => { p.onChange(e.target.value) }} value={p.value} />
    },
    actions: [eq]
  },
  {
    label: 'Price',
    key: 'price',
    component: (p: ComponentProps) => inputNumberRender(p, true),
    actions: [eq, neq, gt, lt]
  },
  {
    label: 'Compare-at price',
    key: 'compare_at_price',
    component: (p: ComponentProps) => inputNumberRender(p, true),
    actions: [eq, neq, gt, lt, empty, nempty]
  },
  {
    label: 'Weight',
    key: 'weight',
    component: (p: ComponentProps) => {
      return <SInputNumber suffix={'kg'} className={'flex1'} onChange={e => { p.onChange(e || 0) }} value={Number(p.value || 0)} />
    },
    actions: [eq, neq, gt, lt]
  },
  {
    label: 'Inventory stock',
    key: 'inventory_stock',
    component: inputNumberRender,
    actions: [eq, gt, lt]
  },
  {
    label: 'Variant’s title',
    key: 'variant_title',
    component: (p: ComponentProps) => {
      return <Input className={'flex1'} onChange={e => { p.onChange(e.target.value) }} value={p.value} />
    },
    actions: [eq, neq, sw, ew, ct, nct]
  }
]
