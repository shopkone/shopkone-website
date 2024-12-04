import { api } from '@/api/api'

export interface BlockUpdateReq {
  section_id: string
  block_id: string
  part_name: string
  key: string
  value: any
}
export interface BlockUpdateRes {}

export const BlockUpdateApi = async (params: BlockUpdateReq) => {
  return await api<BlockUpdateRes>('/design/block/update', params)
}
