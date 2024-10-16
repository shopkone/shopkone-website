import { Button, ButtonProps } from 'antd'

export interface IconButtonProps extends Omit<ButtonProps, 'size'> {
  size: number
}

export default function IconButton (props: IconButtonProps) {
  const { children, size = 24, ...rest } = props
  return (
    <Button
      {...rest}
      style={{
        padding: 0,
        width: size,
        height: size
      }}
    >
      {children}
    </Button>
  )
}
