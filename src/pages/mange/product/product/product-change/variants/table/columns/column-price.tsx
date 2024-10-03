import SInputNumber from '@/components/s-input-number'

export interface ColumnPriceProps {
  value: number
  onChange: (value: number) => void
}

export default function ColumnPrice (props: ColumnPriceProps) {
  const { value, onChange } = props

  return (
    <SInputNumber value={value} onChange={e => { onChange(Number(e || 0)) }} money />
  )
}
