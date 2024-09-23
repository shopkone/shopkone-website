import { useRequest } from 'ahooks'

import { api } from '@/api/api'

export interface PhonePrefixRes {
  code: string
  prefix: number
}

export const PhonePrefixApi = async () => {
  return await api<PhonePrefixRes[]>('/base/phone-prefix')
}

export const usePhonePrefix = () => {
  return useRequest(PhonePrefixApi, { cacheKey: 'PHONE_PREFIX', staleTime: -1 })
}
