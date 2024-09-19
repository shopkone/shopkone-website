import { useRequest } from 'ahooks'

import { http } from '@/http/http'

export interface TimezonesRes {
  value: string
  label: string
}

const TimeZoneApi = async () => {
  return await http<TimezonesRes[]>('/base/timezones')
}

export const useTimezones = () => {
  return useRequest(TimeZoneApi, { staleTime: -1, cacheKey: '/base/timezones' })
}
