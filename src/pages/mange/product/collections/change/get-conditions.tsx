import { useTranslation } from 'react-i18next'
import { Input } from 'antd'

import { useCategories } from '@/api/base/categories'
import Categories from '@/components/categories'
import SInputNumber from '@/components/s-input-number'
import SSelect from '@/components/s-select'
import { useOpen } from '@/hooks/useOpen'

type ValueType = string | number
type onChangeType = (value?: ValueType) => void
interface ComponentProps { value?: ValueType, onChange: onChangeType }

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

export const useConditions = () => {
  const { t } = useTranslation('product', { keyPrefix: 'collections' })

  const eq = { label: t('等于'), value: 'eq' }
  const neq = { label: t('不等于'), value: 'neq' }
  const sw = { label: t('开头为'), value: 'sw' }
  const ew = { label: t('结尾为'), value: 'ew' }
  const ct = { label: t('包含'), value: 'ct' }
  const nct = { label: t('不包含'), value: 'nct' }
  const gt = { label: t('大于'), value: 'gt' }
  const lt = { label: t('小于'), value: 'lt' }
  const empty = { label: t('为空'), value: 'empty' }
  const nempty = { label: t('不为空'), value: 'nempty' }

  return [
    {
      label: t('标题'),
      key: 'title',
      component: (p: ComponentProps) => {
        return <Input className={'flex1'} onChange={e => { p.onChange(e.target.value) }} value={p.value} />
      },
      actions: [eq, neq, sw, ew, ct, nct]
    },
    {
      label: t('类型'),
      key: 'type',
      component: (p: ComponentProps) => {
        return <Input className={'flex1'} onChange={e => { p.onChange(e.target.value) }} value={p.value} />
      },
      actions: [eq, neq, sw, ew, ct, nct]
    },
    {
      label: t('分类'),
      key: 'category',
      component: (p: ComponentProps) => {
        return <CategoryRender value={Number(p.value || 0)} onChange={v => { p.onChange(v) }} />
      },
      actions: [eq]
    },
    {
      label: t('供应商'),
      key: 'vendor',
      component: (p: ComponentProps) => {
        return <Input className={'flex1'} onChange={e => { p.onChange(e.target.value) }} value={p.value} />
      },
      actions: [eq, neq, sw, ew, ct, nct]
    },
    {
      label: t('标签'),
      key: 'tag',
      component: (p: ComponentProps) => {
        return <Input className={'flex1'} onChange={e => { p.onChange(e.target.value) }} value={p.value} />
      },
      actions: [eq]
    },
    {
      label: t('售价'),
      key: 'price',
      component: (p: ComponentProps) => inputNumberRender(p, true),
      actions: [eq, neq, gt, lt]
    },
    {
      label: t('原价'),
      key: 'compare_at_price',
      component: (p: ComponentProps) => inputNumberRender(p, true),
      actions: [eq, neq, gt, lt, empty, nempty]
    },
    {
      label: t('重量'),
      key: 'weight',
      component: (p: ComponentProps) => {
        return <SInputNumber suffix={'kg'} className={'flex1'} onChange={e => { p.onChange(e || 0) }} value={Number(p.value || 0)} />
      },
      actions: [eq, neq, gt, lt]
    },
    {
      label: t('库存'),
      key: 'inventory_stock',
      component: inputNumberRender,
      actions: [eq, gt, lt]
    },
    {
      label: t('变体值'),
      key: 'variant_title',
      component: (p: ComponentProps) => {
        return <Input className={'flex1'} onChange={e => { p.onChange(e.target.value) }} value={p.value} />
      },
      actions: [eq, neq, sw, ew, ct, nct]
    }
  ]
}
