import { useEffect } from 'react'
import { useRequest } from 'ahooks'

import { AddFileApi } from '@/api/file/add-file-record'
import { useUpload } from '@/components/upload/use-upload'
import { useGlobalTask } from '@/pages/mange/task/state'

export const useTaskUpload = () => {
  const addFileRecord = useRequest(AddFileApi, { manual: true })
  const files = useGlobalTask(state => state.files)
  const updateFile = useGlobalTask(state => state.updateFile)
  const open = useGlobalTask(state => state.open)
  const setFileDone = useGlobalTask(state => state.setFileDone)
  const expand = useGlobalTask(state => state.expand)
  const { upload } = useUpload()

  const uploadList = async () => {
    const waitList = files.filter(item => item.status === 'wait')
    if (!waitList?.length) return
    open()
    expand()
    for await (const file of waitList) {
      const res = await upload(file)
      await addFileRecord.runAsync(res)
      setFileDone()
      updateFile(res)
    }
  }

  useEffect(() => {
    uploadList()
  }, [files])
}
