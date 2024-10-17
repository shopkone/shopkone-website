export interface PurchaseItem {
  id: number
  variant_id: number
  purchasing: number
  cost: number
  tax_rate: number
  sku?: string
  total: number
}
