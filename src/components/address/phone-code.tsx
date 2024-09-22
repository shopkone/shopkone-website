import { Flex, Input } from 'antd'

import { PhoneCodeRes, usePhoneCode } from '@/api/base/phone-code'
import SSelect from '@/components/s-select'

export interface PhoneCodeProps {
  value?: PhoneCodeRes
  onChange?: (value: PhoneCodeRes) => void
}

export default function PhoneCode (props: PhoneCodeProps) {
  const { value, onChange } = props

  const phoneCodes = usePhoneCode()

  console.log(value)

  return (
    <Flex>
      <Flex gap={4}>
        <SSelect
          virtual={false}
          value={value?.code}
          loading={phoneCodes.loading}
          dropdownStyle={{ width: 400 }}
          options={phoneCodes.data}
          style={{ width: 100 }}
        />
        <Input />
      </Flex>
    </Flex>
  )
}
