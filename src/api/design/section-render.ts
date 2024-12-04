import { api } from '@/api/api'

export interface SectionRenderReq {
  part_name: string
  section_id: string
}

export interface SectionRenderRes {
  html: string
}

export const SectionRenderApi = async (data: SectionRenderReq) => {
  return await api<SectionRenderRes>('/design/section/render', data)
}
