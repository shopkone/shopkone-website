import { api } from '@/api/api'

export interface AddressFormatListReq {
  countries: string[]
}

export interface AddressFormatListRes {
  country: string
  format: string
}

export const AddressFormatListApi = async (params: AddressFormatListReq) =>
  await api<AddressFormatListRes[]>('/base/address-formatting', params)
