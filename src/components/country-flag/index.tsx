import { useCountries } from '@/api/base/countries'
import SLoading from '@/components/s-loading'

export interface CountryFlagProps {
  country?: string
  size?: number
}

export default function CountryFlag (props: CountryFlagProps) {
  const countries = useCountries()

  const country = countries.data?.find(c => c.code === props.country)

  return (
    <SLoading size={'small'} loading={countries.loading}>
      <img
        style={{ height: props.size, borderRadius: 4 }}
        src={country?.flag?.src}
        alt={country?.flag?.alt}
      />
    </SLoading>
  )
}
