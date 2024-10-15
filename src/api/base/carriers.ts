import { useRequest } from 'ahooks'

import { api } from '@/api/api'

export interface CarriersRes {
  id: number
  name: string
  pattern: string
  pattern_options: string
  display_name: string
  supports_shipment_tracking: boolean
}

const GetCarrierList = async () => {
  return await api<CarriersRes[]>('/base/carrier-list')
}

export const useCarriers = () => {
  return useRequest(GetCarrierList, { staleTime: -1, cacheKey: 'CARRIERS_LIST' })
}
