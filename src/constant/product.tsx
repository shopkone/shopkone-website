// 款式类型

import type { TFunction } from 'i18next'

export enum VariantType {
  Single = 1,
  Multiple = 2
}

export const useVariantTypeOptions = (t: TFunction) => [
  { label: t('单个款式'), value: VariantType.Single }, // 将 'Single' 翻译为 '单一'
  { label: t('多款式'), value: VariantType.Multiple } // 将 'Multiple' 翻译为 '多个'
]

// 款式状态
export enum VariantStatus {
  Draft = 1,
  Published = 2
}

export const useVariantStatusOptions = (t: TFunction) => [
  { label: t('草稿'), value: VariantStatus.Draft }, // 将 'Draft' 翻译为 '草稿'
  { label: t('已发布'), value: VariantStatus.Published } // 将 'Active' 翻译为 '活动'
]
// 库存策略
export enum InventoryPolicy {
  Stop = 1,
  Continue = 2,
  Draft = 3
}
export const useInventoryPolicyOptions = (t: TFunction) => [
  { label: t('缺货时停止销售'), value: InventoryPolicy.Stop },
  { label: t('缺货时继续销售'), value: InventoryPolicy.Continue },
  { label: t('缺货时设置自动下架'), value: InventoryPolicy.Draft }
]

// 重量
export const WEIGHT_UNIT_OPTIONS = [
  { label: 'kg', value: 'kg' },
  { label: 'g', value: 'g' },
  { label: 'lb', value: 'lb' },
  { label: 'oz', value: 'oz' }
]
