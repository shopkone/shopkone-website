import { useMemo } from 'react'
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
  const ret = useRequest(CountriesApi, { cacheKey: 'COUNTRIES', staleTime: -1 })

  const countryMap = useMemo(() => {
    if (!ret.data) return {}
    // @ts-expect-error
    if (window.__countryMap) {
      // @ts-expect-error
      return window.__countryMap
    }
    // 创建一个哈希表来快速查找国家和区域
    const countryMap = new Map<string, { name: string, zones: Array<{ code: string, name: string }> }>()
    for (const country of ret.data) {
      countryMap.set(country.code, { name: country.name, zones: country.zones || [] })
    }
    return countryMap
  }, [ret.data])

  return { ...ret, countryMap }
}
