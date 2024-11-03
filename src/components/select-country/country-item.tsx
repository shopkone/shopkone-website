import { useState } from 'react'
import { IconChevronRight } from '@tabler/icons-react'
import { useMemoizedFn } from 'ahooks'
import { Checkbox, Flex } from 'antd'

import { CountriesRes } from '@/api/base/countries'
import IconButton from '@/components/icon-button'
import SRender from '@/components/s-render'
import ZoneItem from '@/components/select-country/zone-item'

export interface CountryItemProps {
  country: CountriesRes
}

export default function CountryItem (props: CountryItemProps) {
  const { country } = props
  const [expands, setExpands] = useState<string[]>([])

  const onExpand = useMemoizedFn((code: string) => {
    if (expands.includes(code)) {
      setExpands(expands.filter(item => item !== code))
    } else {
      setExpands([...expands, code])
    }
  })

  return (
    <Flex style={{ marginLeft: 24 }} vertical>
      <Flex align={'center'} gap={8}>
        <SRender render={country.zones?.length}>
          <IconButton onClick={() => { onExpand(country.code) }} size={20} type={'text'}>
            <IconChevronRight size={15} />
          </IconButton>
        </SRender>
        <SRender style={{ width: 20 }} render={!country.zones?.length} />
        <Checkbox>{country.name}</Checkbox>
      </Flex>
      <SRender render={expands.includes(country.code)}>
        <Flex gap={8} vertical>
          {
            country.zones.map(zone => (
              <ZoneItem zone={zone} key={zone.code} />
            ))
          }
        </Flex>
      </SRender>
    </Flex>
  )
}
