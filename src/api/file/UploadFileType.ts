import { AddFileReq } from '@/api/file/add-file-record'

export interface UploadFileType extends AddFileReq {
  status: 'uploading' | 'done' | 'error' | 'wait'
  uuid: string
  fileInstance: File
  global: boolean
}
