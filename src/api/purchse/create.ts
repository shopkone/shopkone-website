/*
type BasePurchaseItem struct {
  Cost       float64 `json:"cost" v:"required" dc:"成本"`
  Purchasing int     `json:"purchasing" v:"required" dc:"采购数量"`
  SKU        string  `json:"sku" v:"required" dc:"SKU"`
  TaxRate    float64 `json:"tax_rate" v:"required" dc:"税率"`
  VariantID  uint    `json:"variant_id" v:"required" dc:"变体ID"`
}

type PurchaseCreateReq struct {
  g.Meta                `path:"/purchase/create" method:"post" tags:"Purchase" summary:"创建采购单"`
  SupplierId            uint               `json:"supplier_id" v:"required" dc:"供应商ID"`
  DestinationId         uint               `json:"destination_id" v:"required" dc:"目的地ID"`
  CarrierId             uint               `json:"carrier_id" dc:"物流商ID"`
  DeliveryNumber        string             `json:"delivery_number" dc:"物流商单号"`
  CurrencyCode          string             `json:"currency_code" v:"required" dc:"货币代码"`
  Remarks               string             `json:"remarks" dc:"备注"`
  EstimatedDeliveryDate int64              `json:"estimated_delivery_date" dc:"预计送达时间"`
  PaymentTerms          int                `json:"payment_terms" dc:"付款条款"`
  Items                 []BasePurchaseItem `json:"items" v:"required" dc:"采购项"`
}
type PurchaseCreateRes struct {
  Id uint `json:"id" dc:"采购单ID"`
}
*/

import { api } from '@/api/api'

export interface BasePurchaseItem {
  cost: number
  purchasing: number
  id?: number
  sku: string
  taxRate: number
  variant_id: number
}

export interface PurchaseCreateReq {
  supplier_id: number
  destination_id: number
  carrier_id?: number
  delivery_number?: string
  currency_code: string
  remarks?: string
  estimated_delivery_date?: number
  payment_terms?: number
  items: BasePurchaseItem[]
}

export interface PurchaseCreateRes {
  id: number
}

export const PurchaseCreateApi = async (params: PurchaseCreateReq) => {
  return await api<PurchaseCreateRes>('/purchase/create', params)
}
