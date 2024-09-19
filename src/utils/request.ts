import axios from 'axios'

import { getStorage, STORAGE_KEY } from '@/utils/storage-key'

const service = axios.create({ baseURL: '/api' })

service.interceptors.request.use(
  (config: any) => {
    const Authorization = 'Bearer ' + (getStorage(STORAGE_KEY.TOKEN) || '')
    const XShopID = window.location.hash.split('#')[1]
    config.headers = { ...config.headers, Authorization, 'x-shopid': XShopID }
    config.data = { ...(config.data || {}) }
    return config
  },
  err => err
)

service.interceptors.response.use(
  res => {
    if (res.data.code < 10000 && res.data.code !== 0) {
      window.__info_modal({ content: res.data.message })
      return Promise.reject(res.data)
    }
    if (res?.data?.code !== 0) {
      window.__info_modal({ content: res.data.message })
      return Promise.reject(res.data)
    }
    return res?.data?.data
  },
  async err => {
    if (err?.response?.status === 401) {
      // logoutHandle()
    } else {
      window.__info_modal({ content: '服务器暂时出现问题，请稍后再试。如果问题仍然存在，请联系我们的客服人员。' })
      throw new Error(err)
    }
  }
)

export default service
