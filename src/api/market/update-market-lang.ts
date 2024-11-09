import { api } from '@/api/api'

export interface UpdateMarketLangReq {
  id: number
  language_ids: number[]
  default_language_id: number
}

export const UpdateMarketLangApi = async (req: UpdateMarketLangReq) => {
  return await api('/market/update-lang', req)
}
