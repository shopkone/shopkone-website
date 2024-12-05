import { api } from '@/api/api'

export interface BlockUpdateReq {
  section_id: string
  block_id: string
  part_name: string
  key: string
  value: any
}

export const BlockUpdateApi = async (params: BlockUpdateReq) => {
  return await api('/design/block/update', params)
}
