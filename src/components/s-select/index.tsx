import { IconChevronDown } from '@tabler/icons-react'
import { Select, SelectProps } from 'antd'

export default function SSelect (props: SelectProps) {
  return (
    <Select
      {...props}
      virtual={false}
      suffixIcon={
        <IconChevronDown size={15} color={'#646a73c0'} />
      }
    />
  )
}
