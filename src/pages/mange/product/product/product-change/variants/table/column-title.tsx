import { Checkbox } from 'antd'

import SRender from '@/components/s-render'

export interface ColumnTitleProps {}

export default function ColumnTitle () {
  return (
    <SRender render>
      <Checkbox />
      <span style={{ marginLeft: 12 }}>Variants</span>
    </SRender>
  )
}
