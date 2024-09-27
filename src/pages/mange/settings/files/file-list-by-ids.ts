/*
// FileListByIds 根据文件ID列表获取文件信息
type FileListByIdsReq struct {
  g.Meta `path:"/file/list/by_ids" method:"post" summary:"根据文件ID列表获取文件信息" tags:"文件"`
  Ids    []uint `json:"ids" v:"required" dc:"文件ID列表"`
}
type FileListByIdsRes struct {
  Id   uint   `json:"id"`
  Path string `json:"path"`
} */

import { api } from '@/api/api'

export interface FileListByIdsReq {
  ids: number[]
}

export interface FileListByIdsRes {
  id: number
  path: string
}

export const fileListByIds = async (params: FileListByIdsReq) => {
  return await api<FileListByIdsRes[]>('/file/list/by_ids', params)
}
