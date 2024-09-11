import { Down } from '@icon-park/react'
import { Button, Flex } from 'antd'

export interface TableFilterProps {
  children?: React.ReactNode
}

export default function TableFilter (props: TableFilterProps) {
  const { children } = props
  return (
    <Button type={'dashed'} size={'small'}>
      <Flex gap={2} align={'center'} style={{ fontWeight: 400 }}>
        <div>{children}</div>
        <Down style={{ position: 'relative', top: 3 }} size={13} strokeWidth={3} />
      </Flex>
    </Button>
  )
}
