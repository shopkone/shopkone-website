// 变体类型
export enum VariantType {
  Single = 1,
  Multiple = 2
}

export const useVariantTypeOptions = () => [
  { label: 'Single', value: VariantType.Single },
  { label: 'Multiple', value: VariantType.Multiple }
]

// 变体状态
export enum VariantStatus {
  Draft = 1,
  Published = 2
}

export const useVariantStatusOptions = () => [
  { label: 'Draft', value: VariantStatus.Draft },
  { label: 'Active', value: VariantStatus.Published }
]

// 库存策略
export enum InventoryPolicy {
  Stop = 1,
  Continue = 2,
  Draft = 3
}
export const useInventoryPolicyOptions = () => [
  { label: 'Stop selling when out of stock', value: InventoryPolicy.Stop },
  { label: 'Continue selling when out of stock', value: InventoryPolicy.Continue },
  { label: 'Set as draft when out of stock', value: InventoryPolicy.Draft }
]

// 重量
export const WEIGHT_UNIT_OPTIONS = [
  { label: 'kg', value: 'kg' },
  { label: 'g', value: 'g' },
  { label: 'lb', value: 'lb' },
  { label: 'oz', value: 'oz' }
]
