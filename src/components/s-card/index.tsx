import { ReactNode } from 'react'
import { Card, CardProps } from 'antd'

import SLoading from '@/components/s-loading'
import SRender from '@/components/s-render'

export interface SCardProps extends CardProps {
  tips?: ReactNode
}

export default function SCard (props: SCardProps) {
  const { children, loading = false, tips, ...rest } = props
  return (
    <Card {...rest}>
      <SLoading loading={loading} size={32}>
        <SRender render={tips}>
          <div className={'secondary'} style={{ fontSize: 12, marginTop: -4, marginBottom: 8 }}>{tips}</div>
        </SRender>
        {children}
      </SLoading>
    </Card>
  )
}
