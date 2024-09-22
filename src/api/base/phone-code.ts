import { useRequest } from 'ahooks'

import { api } from '@/api/api'

export interface PhoneCodeRes {
  value: string
  label: string
  iso2: string
}

const PhoneCodeApi = async () => {
  return await api<PhoneCodeRes[]>('/base/phone-area-code')
}

export const usePhoneCode = () => {
  return useRequest(PhoneCodeApi, { staleTime: -1, cacheKey: '/phone-code/list' })
}
