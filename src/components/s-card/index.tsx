import { ReactNode } from 'react'
import { Card, CardProps } from 'antd'

import SLoading from '@/components/s-loading'

export interface SCardProps extends CardProps {
  tips?: ReactNode
}

export default function SCard (props: SCardProps) {
  const { children, loading = false, tips, ...rest } = props
  return (
    <Card {...rest}>
      <SLoading loading={loading} size={'large'}>
        {children}
      </SLoading>
    </Card>
  )
}
