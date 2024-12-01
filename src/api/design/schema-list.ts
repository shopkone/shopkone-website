/*
type SectionSchema struct {
  Name     string          `json:"name"`
  Class    string          `json:"class"`
  Blocks   []BlockSchema   `json:"blocks"`
  Settings []SettingSchema `json:"settings"`
}

type BlockSchema struct {
  Type     string          `json:"type"`
  Name     string          `json:"name"`
  Settings []SettingSchema `json:"settings"`
}

type SettingSchema struct {
  Type    string                `json:"type"`
  Name    string                `json:"name"`
  ID      string                `json:"id"`
  Max     int                   `json:"max"`
  Min     int                   `json:"min"`
  Step    int                   `json:"step"`
  Uint    string                `json:"uint"`
  Label   string                `json:"label"`
  Options []SettingSchemaOption `json:"options"`
  Default interface{}           `json:"default"`
}

type SettingSchemaOption struct {
  Value string `json:"value"`
  Label string `json:"label"`
}

type DesignSchemaListReq struct {
  g.Meta `path:"/design/schema/list" method:"post" tags:"Design" summary:"获取设计数据列表"`
  Type   []string `json:"type"`
}
type DesignSchemaListRes SectionSchema
*/

import { api } from '@/api/api'

export interface SectionSchema {
  name: string
  class: string
  blocks: BlockSchema[]
  settings: SettingSchema[]
  type?: string
}

export interface BlockSchema {
  type: string
  name: string
  settings: SettingSchema[]
}

export interface SettingSchema {
  type: string
  name: string
  id: string
  max: number
  min: number
  step: number
  unit: string
  label: string
  options: SettingSchemaOption[]
  default: any
  content: string
  __kimi_value?: any
}

export interface SettingSchemaOption {
  value: string
  label: string
}

export interface DesignSchemaListReq {
  type: string[]
}

export const DesignSchemaListApi = async (data: DesignSchemaListReq) => {
  return await api<SectionSchema[]>('/design/schema/list', data)
}
