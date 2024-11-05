import { useCountries } from '@/api/base/countries'
import { FileType } from '@/api/file/add-file-record'
import FileImage from '@/components/file-image'
import SLoading from '@/components/s-loading'

export interface CountryFlagProps {
  country?: string
  size?: number
  borderless?: boolean
}

export default function CountryFlag (props: CountryFlagProps) {
  const countries = useCountries()

  const country = countries.data?.find(c => c.code === props.country)

  return (
    <SLoading loading={countries.loading}>
      <FileImage
        containerStyle={{ border: props.borderless ? 'none' : undefined }}
        size={16}
        type={FileType.Image}
        height={24}
        width={34}
        style={{ borderRadius: 0, padding: 0 }}
        src={country?.flag?.src || ''}
        alt={country?.flag?.alt || ''}
      />
    </SLoading>
  )
}
