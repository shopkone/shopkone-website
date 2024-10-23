import { create } from 'zustand/react'

import { UploadFileType } from '@/api/file/UploadFileType'

export interface ITaskState {
  uploadTasks: UploadFileType[]
  uploadFinished: number
}

export interface ITaskAction {
  addUploadTasks: (tasks: UploadFileType[]) => void
  updateUploadTask: (task: UploadFileType) => void
  setUploadFinished: () => void
  resetUploadFinished: () => void
}

export const useTask = create<ITaskState & ITaskAction>((set, get, store) => ({
  uploadTasks: [],
  uploadFinished: 0,

  addUploadTasks: (tasks) => {
    set({ uploadTasks: [...get().uploadTasks, ...tasks] })
  },

  updateUploadTask: (task) => {
    set({ uploadTasks: get().uploadTasks.map(item => item.uuid === task.uuid ? task : item) })
  },

  setUploadFinished: () => {
    set({ uploadFinished: get().uploadFinished + 1 })
  },

  resetUploadFinished: () => {
    set({ uploadFinished: 0 })
  }
})
)
