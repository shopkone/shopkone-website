import { ReactNode } from 'react'
import { Attention, CheckOne } from '@icon-park/react'
import { message } from 'antd'

export const sMessage = ({
  warning: (content: ReactNode) => message.warning({
    icon: <Attention theme={'filled'} size={18} fill={'#de7802'} />,
    content
  }),
  success: (content: ReactNode) => message.success({
    icon: <CheckOne theme={'filled'} size={18} fill={'#32a645'} />,
    content
  })
})
