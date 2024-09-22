export interface Phone {
  country_iso3: string
  number: string
}

export interface AddressType {
  id: number
  legal_business_name: string
  country_iso3: string
  full_address: string
  apartment: string
  city: string
  province_code: string
  postal_code: string
  phone: Phone
}
