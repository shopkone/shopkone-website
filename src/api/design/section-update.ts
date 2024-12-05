import { api } from '@/api/api'

export interface SectionUpdateReq {
  section_id: string
  part_name: string
  key: string
  value: any
}

export const SectionUpdateApi = async (params: SectionUpdateReq) => {
  return await api('/design/section/update', params)
}
