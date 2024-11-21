import axios from 'axios'
import i18next from 'i18next'

import { sMessage } from '@/components/s-message'
import { getStorage, STORAGE_KEY } from '@/utils/storage-key'
import { toLogin } from '@/utils/to-login'

const service = axios.create({ baseURL: '/api' })

service.interceptors.request.use(
  (config: any) => {
    const Authorization = 'Bearer ' + (getStorage(STORAGE_KEY.TOKEN) || '')
    const XShopID = window.location.pathname?.split('/')?.[1]
    config.headers = { ...config.headers, Authorization, 'x-shopid': XShopID }
    config.data = { ...(config.data || {}) }
    return config
  },
  err => err
)

service.interceptors.response.use(
  res => {
    // @ts-expect-error
    if (res.config.__hideErrorCodes?.includes(res.data.code)) {
      return res?.data?.data
    }
    if (res.data.code < 10000 && res.data.code !== 0) {
      sMessage.warning(res.data.message)
      // window.__info_modal({ content: res.data.message })
      return Promise.reject(res.data)
    }
    if (res?.data?.code !== 0) {
      // window.__info_modal({ content: res.data.message })
      sMessage.warning(res.data.message)
      return Promise.reject(res.data)
    }
    return res?.data?.data
  },
  async err => {
    if (err?.response?.status === 401) {
      toLogin()
    } else {
      sMessage.warning(i18next.t('base.系统异常', { ns: 'common' }))
      // window.__info_modal({ content: i18next.t('base.系统异常', { ns: 'common' }) })
      throw new Error(err)
    }
  }
)

export default service
