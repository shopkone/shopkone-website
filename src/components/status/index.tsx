import { Flex, FlexProps } from 'antd'

export interface StatusProps extends FlexProps {
  type?: 'success' | 'info' | 'warning' | 'error' | 'default'
  borderless?: boolean
}

export default function Status (props: StatusProps) {
  const { children, type = 'default', borderless, ...rest } = props

  const color = {
    default: '#646A73',
    success: '#32a645',
    info: '#3370ff'
  }

  if (!borderless) {
    return (
      <Flex
        {...rest}
        align={'center'}
        style={{
          borderRadius: 4,
          background: color[type] + '30',
          border: `1px solid ${color[type] + '40'}`,
          fontSize: 12,
          padding: '0 8px',
          color: color[type],
          height: 22,
          ...rest.style
        }}
      >
        {children}
      </Flex>
    )
  }

  return (
    <Flex {...rest} gap={8} align={'center'}>
      <div style={{ width: 8, height: 8, background: color[type], borderRadius: 3 }} />
      <div>{children}</div>
    </Flex>
  )
}
