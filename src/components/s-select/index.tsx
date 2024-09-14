import { Down } from '@icon-park/react'
import { Select, SelectProps } from 'antd'

export default function SSelect (props: SelectProps) {
  return (
    <Select
      {...props}
      suffixIcon={
        <Down size={15} fill={'#646a73c0'} />
      }
    />
  )
}
