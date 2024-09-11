import { Flex, FlexProps } from 'antd'

export interface StatusProps extends FlexProps {
  type?: 'success' | 'info' | 'warning' | 'error'
}

export default function Status (props: StatusProps) {
  const { children, type, ...rest } = props
  return (
    <Flex {...rest} gap={8} align={'center'}>
      <div style={{ width: 8, height: 8, background: '#047b5d', borderRadius: 3 }} />
      <div>{children}</div>
    </Flex>
  )
}
