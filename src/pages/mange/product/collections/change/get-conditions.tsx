import { Input } from 'antd'

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

export const getConditions = () => [
  { label: 'Title', key: 'title', component: Input, actions: [eq, neq, sw, ew, ct, nct] },
  { label: 'Type', key: 'type', component: Input, actions: [eq, neq, sw, ew, ct, nct] },
  { label: 'Category', key: 'category', component: Input, actions: [eq] },
  { label: 'Vendor', key: 'vendor', component: Input, actions: [eq, neq, sw, ew, ct, nct] },
  { label: 'Tag', key: 'tag', component: Input, actions: [eq] },
  { label: 'Price', key: 'price', component: Input, actions: [eq, neq, gt, lt] },
  { label: 'Compare-at price', key: 'compare_at_price', component: Input, actions: [eq, neq, gt, lt, empty, nempty] },
  { label: 'Weight', key: 'weight', component: Input, actions: [eq, neq, gt, lt] },
  { label: 'Inventory stock', key: 'inventory_stock', component: Input, actions: [eq, gt, lt] },
  { label: 'Variant’s title', key: 'variant_title', component: Input, actions: [eq, neq, sw, ew, ct, nct] }
]
