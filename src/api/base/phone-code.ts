import { useRequest } from 'ahooks'

import { http } from '@/http/http'

export interface PhoneCodeRes {
  value: string
  label: string
  iso2: string
}

const PhoneCodeApi = async () => {
  return await http<PhoneCodeRes[]>('/base/phone-area-code')
}

export const usePhoneCode = () => {
  return useRequest(PhoneCodeApi, { staleTime: -1, cacheKey: '/phone-code/list' })
}
