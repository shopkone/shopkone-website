import { useRequest } from 'ahooks'

import { api } from '@/api/api'

export interface TimezonesRes {
  value: string
  label: string
}

const TimeZoneApi = async () => {
  return await api<TimezonesRes[]>('/base/timezones')
}

export const useTimezones = () => {
  return useRequest(TimeZoneApi, { staleTime: -1, cacheKey: '/base/timezones' })
}
