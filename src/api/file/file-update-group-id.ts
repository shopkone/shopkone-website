/*
// UpdateGroupIdByFileIds 更新文件分组
type UpdateGroupIdByFileIdsReq struct {
  g.Meta  `path:"/file/update/group_id" method:"post" summary:"更新文件分组" tags:"文件"`
  FileIds []uint `json:"file_ids" v:"required" dc:"文件ID列表"`
  GroupId uint   `json:"group_id" v:"required" dc:"分组ID"`
}
type UpdateGroupIdByFileIdsRes struct {
} */

import { api } from '@/api/api'

export interface UpdateGroupIdByFileIdsReq {
  file_ids: number[]
  group_id: number
}

export const UpdateGroupIdByFileIdsApi = async (params: UpdateGroupIdByFileIdsReq) =>
  await api('/file/update/group_id', params)
