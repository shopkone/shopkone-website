import { Input } from 'antd'

import SInputNumber from '@/components/s-input-number'

type ValueType = string | number
type onChangeType = (value: ValueType | null) => void
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
      return <Input className={'flex1'} onChange={e => { p.onChange(e.target.value) }} value={p.value} />
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
    component: (p: ComponentProps) => {
      return <SInputNumber money className={'flex1'} onChange={e => { p.onChange(e) }} value={Number(p.value || 0)} />
    },
    actions: [eq, neq, gt, lt]
  },
  {
    label: 'Compare-at price',
    key: 'compare_at_price',
    component: (p: ComponentProps) => {
      return <SInputNumber money className={'flex1'} onChange={e => { p.onChange(e) }} value={Number(p.value || 0)} />
    },
    actions: [eq, neq, gt, lt, empty, nempty]
  },
  {
    label: 'Weight',
    key: 'weight',
    component: (p: ComponentProps) => {
      return <SInputNumber suffix={'kg'} className={'flex1'} onChange={e => { p.onChange(e) }} value={Number(p.value || 0)} />
    },
    actions: [eq, neq, gt, lt]
  },
  {
    label: 'Inventory stock',
    key: 'inventory_stock',
    component: (p: ComponentProps) => {
      return <Input className={'flex1'} onChange={e => { p.onChange(e.target.value) }} value={p.value} />
    },
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
