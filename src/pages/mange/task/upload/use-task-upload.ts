import { useEffect } from 'react'

import { useUpload } from '@/components/upload/use-upload'
import { useGlobalTask } from '@/pages/mange/task/state'

export const useTaskUpload = () => {
  const files = useGlobalTask(state => state.files)
  const updateFile = useGlobalTask(state => state.updateFile)
  const { upload } = useUpload()

  const uploadList = async () => {
    const waitList = files.filter(item => item.status === 'wait')
    for await (const file of waitList) {
      const res = await upload(file)
      updateFile(res)
    }
  }

  useEffect(() => {
    uploadList()
  }, [files])
}
