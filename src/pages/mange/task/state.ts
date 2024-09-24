import { atom } from 'jotai'

import { UploadFileType } from '@/api/file/UploadFileType'

export const uploadList = atom<UploadFileType[]>([])
