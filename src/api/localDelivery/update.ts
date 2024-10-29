import { api } from '@/api/api'

export enum LocalDeliveryStatus {
  Open = 1,
  Close = 2
}

export interface BaseLocalDeliveryFee {
  condition: number
  fee: number
}

export interface BaseLocalDeliverArea {
  name: string
  postalCode: string
  note: string
  fees: BaseLocalDeliveryFee[]
}

export interface UpdateLocalDeliveryReq {
  id: number
  status: LocalDeliveryStatus
  areas: BaseLocalDeliverArea[]
}

export const UpdateLocalDeliveryApi = async (params: UpdateLocalDeliveryReq): Promise<void> => {
  await api('/delivery/local-delivery/update', params)
}
