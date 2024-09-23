import { useRequest } from 'ahooks'

import { api } from '@/api/api'

export interface ZoneListOut {
  code: string
  name: string
}

export interface CountriesRes {
  code: string
  name: string
  continent: string
  flag: { src: string, alt: string }
  zones: ZoneListOut[]
}

export const CountriesApi = async () =>
  await api<CountriesRes[]>('/base/countries')

export const useCountries = () => {
  return useRequest(CountriesApi, { cacheKey: 'COUNTRIES', staleTime: -1 })
}
