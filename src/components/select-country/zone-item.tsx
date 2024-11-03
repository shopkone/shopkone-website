import { Checkbox } from 'antd'

import { ZoneListOut } from '@/api/base/countries'

export interface ZoneItemProps {
  zone: ZoneListOut
}

export default function ZoneItem (props: ZoneItemProps) {
  const { zone } = props
  return (
    <Checkbox style={{ marginLeft: 56 }}>
      {zone.name}
    </Checkbox>
  )
}
