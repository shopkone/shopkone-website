import { UploadFileType } from '@/api/file/UploadFileType'
import { useOss } from '@/hooks/use-oss'

export const useUpload = () => {
  const oss = useOss()

  const upload = async (fileInfo: UploadFileType): Promise<UploadFileType> => {
    try {
      if (fileInfo.status !== 'uploading') {
        return fileInfo
      }
      const { fileInstance } = fileInfo
      const result = await oss.run(fileInfo.name, fileInstance)
      return { ...fileInfo, path: result?.url, status: 'done' }
    } catch (e) {
      return { ...fileInfo, status: 'error', errMsg: e?.toString() || '' }
    }
  }

  return { upload }
}
