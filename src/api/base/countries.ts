import { useRequest } from 'ahooks'

import { http } from '@/http/http'

export interface CountriesReq {
  children?: boolean
}

export interface CountriesRes {
  value: string
  label: string
  region_name: string
  children: CountriesRes[]
}

const CountriesApi = async (params: CountriesReq) => {
  return await http<CountriesRes[]>('/base/countries', params)
}

export const useCountries = () => {
  return useRequest(CountriesApi, { staleTime: -1, cacheKey: '/base/countries' })
}

export const useWithChildrenCountries = () => {
  return useRequest(async () => await CountriesApi(
    { children: true }),
  { staleTime: -1, cacheKey: '/base/countries_children' })
}
