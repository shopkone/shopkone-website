export interface PurchaseItem {
  id: number
  variant_id: number
  purchasing: number
  cost: number
  tax_rate: number
  sku?: string
  total: number
  rejected?: number
  received?: number
  rejected_count?: number
  received_count?: number
  is_deleted?: boolean
}
