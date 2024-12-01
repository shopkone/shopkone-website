import { api } from '@/api/api'

export interface PartData {
  name: string
  type: string
  order: string[]
  sections: Record<string, SectionData>
}

export interface SectionData {
  type: string
  block_order: string[]
  settings: Record<string, any>
  blocks: Record<string, BlockData>
}

export interface BlockData {
  type: string
  name: string
  settings: Record<string, any>
}

export type SettingDataType = Record<string, any | SectionData>

export interface DesignDataListRes {
  header_data: PartData
  footer_data: PartData
  current_page_data: PartData
  setting_data: SettingDataType
}

export const DesignDataListApi = async () => {
  return await api<DesignDataListRes>('/design/data/list')
}
