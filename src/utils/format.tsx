import { ReactNode } from 'react'
import { Flex } from 'antd'

import { useCountries } from '@/api/base/countries'
import { AddressType, PhoneType } from '@/api/common/address'
import { renderText } from '@/utils/render-text'

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

export const formatPhone = (phone?: PhoneType): ReactNode => {
  if (!phone?.num || !phone.prefix) return ''
  return renderText(`+(${phone.prefix}) ${phone.num}`)
}

export const formatAddress = (address?: AddressType, extra?: ReactNode): ReactNode => {
  if (!address) return ''
  const { first_name, last_name, phone } = address
  const { address1, address2, city, zone, country, company, postal_code } = address
  const phoneStr = formatPhone(phone)
  const zoneStr = [zone, postal_code].filter(Boolean).join(' ')
  const nameStr = [first_name, last_name].filter(Boolean).join(' ')
  return (
    <div>
      <Flex gap={8} align={'center'} style={{ fontWeight: 'bolder' }}>
        {[nameStr, phoneStr].filter(Boolean).join(', ')}
        {extra}
      </Flex>
      <div style={{ marginTop: 4 }}>
        {[company].filter(Boolean).join(', ')}
      </div>
      <div style={{ marginTop: 4 }}>
        {[address2, address1, city, zoneStr, country].filter(Boolean).join(', ')}
      </div>
    </div>
  )
}
