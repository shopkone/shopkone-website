import ReactDOM from 'react-dom/client'
import { I18nextProvider } from 'react-i18next'
import { App, ConfigProvider } from 'antd'
import zh_CN from 'antd/locale/zh_CN'
import i18next from 'i18next'

import Pages from '@/pages/pages'

import '@/assets/styles/reset.less'
import '@/assets/styles/global.less'
import '@/assets/styles/animation.less'
import '@/assets/styles/antd/antd.less'
import '@/assets/styles/base.less'

const dom = document.getElementById('root')

if (dom) {
  ReactDOM.createRoot(dom).render(
    <I18nextProvider i18n={i18next}>
      <ConfigProvider
        theme={{
          token: {
            fontSize: 13,
            colorText: '#1f2329',
            motionDurationMid: '0.1s',
            motionDurationSlow: '0.1s',
            colorPrimary: '#165cfa'
          }
        }}
        locale={zh_CN}
        prefixCls={'shopkone'}
      >
        <App>
          <Pages />
        </App>
      </ConfigProvider>
    </I18nextProvider>
  )
}
