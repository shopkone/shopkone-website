// 变体类型
import { useI18n } from '@/hooks/use-lang'

export enum VariantType {
  Single = 1,
  Multiple = 2
}

export const useVariantTypeOptions = (t: ReturnType<typeof useI18n>) => [
  { label: t('单一变体'), value: VariantType.Single }, // 将 'Single' 翻译为 '单一'
  { label: t('多个变体'), value: VariantType.Multiple } // 将 'Multiple' 翻译为 '多个'
]

// 变体状态
export enum VariantStatus {
  Draft = 1,
  Published = 2
}

export const useVariantStatusOptions = (t: ReturnType<typeof useI18n>) => [
  { label: t('草稿'), value: VariantStatus.Draft }, // 将 'Draft' 翻译为 '草稿'
  { label: t('上架'), value: VariantStatus.Published } // 将 'Active' 翻译为 '活动'
]
// 库存策略
export enum InventoryPolicy {
  Stop = 1,
  Continue = 2,
  Draft = 3
}
export const useInventoryPolicyOptions = (t: ReturnType<typeof useI18n>) => [
  { label: t('缺货时停止销售'), value: InventoryPolicy.Stop },
  { label: t('缺货时继续销售'), value: InventoryPolicy.Continue },
  { label: t('缺货时设置为草稿'), value: InventoryPolicy.Draft }
]

// 重量
export const WEIGHT_UNIT_OPTIONS = [
  { label: 'kg', value: 'kg' },
  { label: 'g', value: 'g' },
  { label: 'lb', value: 'lb' },
  { label: 'oz', value: 'oz' }
]
