import { ReactNode } from 'react'
import { Attention, CheckOne } from '@icon-park/react'
import { message } from 'antd'

export const sMessage = ({
  warning: (content: ReactNode) => message.warning({
    icon: <Attention style={{ position: 'relative', top: 4, marginRight: 8 }} theme={'filled'} size={18} fill={'#de7802'} />,
    content
  }),
  success: (content: ReactNode) => message.success({
    icon: (
      <CheckOne
        style={{ position: 'relative', top: 4, marginRight: 8 }}
        theme={'filled'}
        size={18}
        fill={'#2e7d32'}
      />
    ),
    content,
    duration: 1.5
  })
})
