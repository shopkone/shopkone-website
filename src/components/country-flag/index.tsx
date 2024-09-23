import { useCountries } from '@/api/base/countries'
import Image from '@/components/image'

export interface CountryFlagProps {
  country?: string
  size?: number
}

export default function CountryFlag (props: CountryFlagProps) {
  const countries = useCountries()

  const country = countries.data?.find(c => c.code === props.country)

  return (
    <Image
      loading={countries.loading}
      size={'small'}
      style={{ height: props.size, borderRadius: 4 }}
      src={country?.flag?.src}
      alt={country?.flag?.alt}
    />
  )
}
