import { Button, ButtonProps, Flex } from 'antd'

export interface IconButtonProps extends Omit<ButtonProps, 'size'> {
  size: number
}

export default function IconButton (props: IconButtonProps) {
  const { children, size = 24, ...rest } = props
  return (
    <Button
      {...rest}
      size={'small'}
      style={{
        padding: 0,
        width: size,
        height: size
      }}
    >
      <Flex align={'center'} justify={'center'}>{children}</Flex>
    </Button>
  )
}
