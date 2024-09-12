import ReactDOM from 'react-dom/client'
import { App, ConfigProvider } from 'antd'

import Index from '@/Index'

import '@/assets/styles/reset.less'
import '@/assets/styles/global.less'
import '@/assets/styles/antd/antd.less'

const dom = document.getElementById('root')

if (dom) {
  ReactDOM.createRoot(dom).render(
    <ConfigProvider
      theme={{ token: { fontSize: 13, colorText: '#1f2329', motionDurationMid: '0.1s', colorPrimary: '#3370ff' } }}
      prefixCls={'shopkone'}
    >
      <App>
        <Index />
      </App>
    </ConfigProvider>
  )
}
