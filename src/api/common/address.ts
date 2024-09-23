export interface PhoneType {
  country: string
  prefix: number
  num: string
}

export interface AddressType {
  id: number
  legal_business_name: string
  address1: string
  address2: string
  city: string
  company: string
  country: string
  first_name: string
  last_name: string
  phone: PhoneType
  postal_code: string
  zone: string
}
