import { useEffect, useState } from 'react'
import { useRequest } from 'ahooks'

import { AddFileApi } from '@/api/file/add-file-record'
import { UploadFileType } from '@/api/file/UploadFileType'
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
  const [uploadingList, setUploadingList] = useState<UploadFileType[]>([])

  const uploadList = async () => {
    let waitList = files.filter(item => item.status === 'wait' && !uploadingList.find(i => i.uuid === item.uuid))
    waitList = waitList.map(item => ({ ...item, status: 'uploading' }))
    if (!waitList?.length) return
    setUploadingList(waitList || [])
    open()
    expand()
  }

  const startUploadList = async () => {
    const list = uploadingList.filter(item => item.status === 'uploading')
    if (!list?.length) return
    for await (const file of list) {
      const res = await upload(file)
      await addFileRecord.runAsync(res)
      setFileDone()
      updateFile(res)
    }
  }

  useEffect(() => {
    uploadList()
  }, [files])

  useEffect(() => {
    startUploadList()
  }, [uploadingList])
}
