import { Flex, FlexProps } from 'antd'

type StatusType = 'success' | 'info' | 'warning' | 'error' | 'default' | 'black'

export interface StatusProps extends FlexProps {
  type?: StatusType
  borderless?: boolean
}

export default function Status (props: StatusProps) {
  const { children, type = 'default', borderless, ...rest } = props

  const color: Record<StatusType, Record<'bg' | 'color' | 'border', string>> = {
    default: {
      bg: '#f3f4f6', // 非常浅的中性灰色背景，冷静且柔和
      color: '#333333', // 中性深灰色文字，保证良好的可读性
      border: '#c6c6c6' // 柔和的中灰色边框，轻盈但足够有存在感
    },
    success: {
      bg: '#e6f4e9', // 柔和的淡绿色背景，传递积极的成功反馈
      color: '#2e7d32', // 深绿色文字，平衡了能量与专业感
      border: '#81c784' // 浅绿色边框，柔和且不刺眼
    },
    info: {
      bg: '#e4ecff', // 贴近主题色 `#3370ff` 的淡蓝背景，确保视觉和谐
      color: '#3370ff', // 主色调，明确传递信息状态
      border: '#709eff' // 比文字颜色稍浅的蓝色边框，确保层次感
    },
    warning: {
      bg: '#fff4e0', // 柔和的橙黄色背景，警告却不过于刺眼
      color: '#b36b00', // 深橙色文字，传达重要性但避免过度焦虑
      border: '#ffb84d' // 浅橙色边框，与背景形成自然的渐变
    },
    error: {
      bg: '#ffe5e5', // 浅红色背景，传递警示但保持柔和
      color: '#d32f2f', // 深红色文字，强调错误信息的重要性
      border: '#ef9a9a' // 边框浅红色，与背景保持自然过渡
    },
    black: {
      bg: '#1c1c1c', // 深色黑灰背景，带有现代感
      color: '#ffffff', // 纯白文字，创造出强烈对比
      border: '#424242' // 边框比背景略浅，带来深邃而精致的层次
    }
  }

  if (!borderless) {
    return (
      <Flex
        {...rest}
        align={'center'}
        style={{
          borderRadius: 8,
          background: color[type].bg,
          border: `1px solid ${color[type].border}`,
          fontSize: 12,
          padding: '0 8px',
          color: color[type].color,
          height: 20,
          lineHeight: '20px',
          ...rest.style
        }}
      >
        {children}
      </Flex>
    )
  }

  return (
    <Flex {...rest} gap={8} align={'center'}>
      <div style={{ width: 8, height: 8, background: color[type].bg, borderRadius: 3 }} />
      <div>{children}</div>
    </Flex>
  )
}
