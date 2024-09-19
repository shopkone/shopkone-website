import ReactDOM from 'react-dom/client'
import { App, ConfigProvider, Empty } from 'antd'

import { ReactComponent as EmptyImg } from '@/assets/image/empty.svg'
import Pages from '@/pages/pages'

import '@/assets/styles/reset.less'
import '@/assets/styles/global.less'
import '@/assets/styles/animation.less'
import '@/assets/styles/antd/antd.less'
import '@/assets/styles/base.less'

const dom = document.getElementById('root')

if (dom) {
  ReactDOM.createRoot(dom).render(
    <ConfigProvider
      renderEmpty={() => <Empty image={<EmptyImg style={{ fontSize: 80 }} />} />}
      theme={{
        token: {
          fontSize: 13,
          colorText: '#1f2329',
          motionDurationMid: '0.1s',
          motionDurationSlow: '0.1s',
          colorPrimary: '#3370ff'
        }
      }}
      prefixCls={'shopkone'}
    >
      <App>
        <Pages />
      </App>
    </ConfigProvider>
  )
}
