import { api } from '@/api/api'

export const DomainBlockCountryListApi = async (params: any) => {
  return await api<Array<{ code: string, name: string }>>('/domain/block-country/list', params)
}
