import { ReactNode } from 'react'
import { Flex } from 'antd'

export interface EmptyProps {
  children?: ReactNode
  title?: string
  desc?: ReactNode
  image?: ReactNode
  height?: number
}

export default function SEmpty (props: EmptyProps) {
  const { title, desc, image, children, height } = props
  return (
    <Flex gap={16} vertical style={{ padding: '32px 0', height }} align={'center'} justify={'center'}>
      {image}
      <Flex gap={16} vertical align={'center'} justify={'center'}>
        <div className={'tips'} style={{ fontSize: 13 }}>{title}</div>
        {children}
      </Flex>
    </Flex>
  )
}
