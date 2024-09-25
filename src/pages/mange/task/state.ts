import { atom } from 'jotai'

import { UploadFileType } from '@/api/file/UploadFileType'

export const uploadList = atom<UploadFileType[]>([])
export const triggerNewUploadFileAtom = atom<UploadFileType>()
export const taskOpen = atom(false)
export const taskExpand = atom(false)
