import { create } from 'zustand/react'

import { UploadFileType } from '@/api/file/UploadFileType'

export interface TaskState {
  files: UploadFileType[]
  fileDoneFlag: number
  isOpen: boolean
  isExpand: boolean
}

export interface TaskAction {
  addFiles: (files: UploadFileType[]) => void
  updateFile: (file: UploadFileType) => void
  setFileDone: (clear?: boolean) => void
  close: () => void
  open: () => void
  expand: () => void
  collapse: () => void
}

export const useGlobalTask = create<TaskState & TaskAction>((set, get, store) => ({
  files: [],
  fileDoneFlag: 0,
  addFiles: (files: UploadFileType[]) => {
    set({ files: [...get().files, ...files] })
  },
  updateFile: (file: UploadFileType) => {
    set({ files: get().files.map(item => item.uuid === file.uuid ? file : item) })
  },
  setFileDone: (clear = false) => {
    set({ fileDoneFlag: clear ? 0 : get().fileDoneFlag + 1 })
  },

  isOpen: false,
  close: () => {
    set({ isOpen: false, files: [] })
  },
  open: () => {
    set({ isOpen: true })
  },

  isExpand: false,
  expand: () => {
    set({ isExpand: true })
  },
  collapse: () => {
    set({ isExpand: false })
  }
}))
