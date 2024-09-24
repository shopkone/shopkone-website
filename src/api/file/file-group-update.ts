/*
// FileGroupUpdate 更新分组
type FileGroupUpdateReq struct {
  g.Meta `path:"/file/group/update" method:"post" summary:"更新文件分组" tags:"文件"`
  Id     uint   `json:"id" v:"required" dc:"分组ID"`
  Name   string `json:"name" v:"required" dc:"分组名称"`
}
type FileGroupUpdateRes struct {
  ID uint `json:"id"`
}
/!*  *!/ */

import { api } from '@/api/api'

export interface FileGroupUpdateReq {
  id: number
  name: string
}

export interface FileGroupUpdateRes {
  id: number
}

export const FileGroupUpdateApi = async (params: FileGroupUpdateReq) =>
  await api<FileGroupUpdateRes>('/file/group/update', params)
