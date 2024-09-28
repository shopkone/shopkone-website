import { useRequest } from 'ahooks'

import { api } from '@/api/api'

export interface AddressConfig {
  address1: string
  address2: string
  city: string
  company: string
  country: string
  first_name: string
  last_name: string
  phone: string
  postal_code: string
  zone: string
}

export interface AddressFormatting {
  regex: string
  format: string
}

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
  config: AddressConfig
  formatting: string
  postal_code_config: AddressFormatting
}

export const CountriesApi = async () =>
  await api<CountriesRes[]>('/base/countries')

export const useCountries = () => {
  return useRequest(CountriesApi, { cacheKey: 'COUNTRIES', staleTime: -1 })
}
