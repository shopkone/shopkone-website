import { useEffect } from 'react'
import { useRequest } from 'ahooks'
import { useAtom, useSetAtom } from 'jotai'

import { AddFileApi } from '@/api/file/add-file-record'
import { UploadFileType } from '@/api/file/UploadFileType'
import { useOss } from '@/hooks/use-oss'
import { taskExpand, taskOpen, triggerNewUploadFileAtom, uploadList } from '@/pages/mange/task/state'

export const useUpload = () => {
  const [fileList, setFileList] = useAtom(uploadList)
  const addFile = useRequest(AddFileApi, { manual: true })
  const oss = useOss()
  const setOpen = useSetAtom(taskOpen)
  const setExpand = useSetAtom(taskExpand)
  const triggerNewUploadFile = useSetAtom(triggerNewUploadFileAtom)

  const uploader = async (fileInfo: UploadFileType): Promise<UploadFileType> => {
    try {
      const { fileInstance } = fileInfo
      const result = await oss.run(fileInfo.name, fileInstance)
      const info: UploadFileType = { ...fileInfo, path: result?.url, status: 'done' }
      await addFile.runAsync(info)
      return info
    } catch (e) {
      return { ...fileInfo, status: 'error', errMsg: e?.toString() || '' }
    }
  }

  const upload = async (list: UploadFileType[]) => {
    const waitList = list.filter(item => item.status === 'wait')
    if (!waitList.length) return
    if (waitList.every(i => i.global)) {
      setOpen(true)
      setExpand(true)
    }
    setFileList(pre => pre.map(item => item.status === 'wait' ? { ...item, status: 'uploading' } : item))
    for await (const item of waitList) {
      const result = await uploader(item)
      setFileList(pre => pre.map(i => i.uuid === item.uuid ? result : i))
      triggerNewUploadFile(result)
    }
  }

  useEffect(() => {
    upload(fileList)
  }, [fileList])

  return fileList?.filter(i => i.global)
}
