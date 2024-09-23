import { useRequest } from 'ahooks'

import { api } from '@/api/api'

export interface TimezoneListRes {
  olson_name: string
  description: string
}

export const TimezoneListApi = async () =>
  await api<TimezoneListRes[]>('/base/timezone-list')

export const useTimezoneList = () => {
  return useRequest(TimezoneListApi, { cacheKey: 'TIMEZONE_LIST', staleTime: -1 })
}
