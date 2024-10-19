import { useCountries } from '@/api/base/countries'
import { AddressType } from '@/api/common/address'

export function formatFileSize (sizeInBytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let index = 0

  while (sizeInBytes >= 1024 && index < units.length - 1) {
    sizeInBytes /= 1024
    index++
  }

  return `${sizeInBytes.toFixed(2)} ${units[index]}`
}

export const formatInfo = (countries: ReturnType<typeof useCountries>, address?: AddressType) => {
  if (!countries?.data?.length) return '-'
  const country = countries?.data?.find(item => item.code === address?.country)
  const zone = country?.zones?.find(item => item.code === address?.zone)?.name
  const format = country?.formatting
  const formatArr = format?.replaceAll('{', '').replaceAll('}', '').split('_')
  return formatArr?.map(item => item?.split(' ').map(item => {
    if (item === 'firstName') return address?.first_name
    if (item === 'lastName') return address?.last_name
    if (item === 'phone') return address?.phone?.num
    if (item === 'province') return zone
    if (item === 'country') return country?.name
    return (address as any)[item] || ''
  }).filter(i => i?.trim()).join(' ')).filter(i => i?.trim()).join(', ') || '-'
}
