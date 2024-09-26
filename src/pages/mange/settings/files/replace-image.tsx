import { useRequest } from 'ahooks'
import { Button, Tooltip } from 'antd'

import { FileUpdateApi } from '@/api/file/file-update'
import { UploadFileType } from '@/api/file/UploadFileType'
import { ReactComponent as ReplaceIcon } from '@/assets/icon/replace.svg'
import { sMessage } from '@/components/s-message'
import Upload from '@/components/upload'
import { useUpload } from '@/components/upload/use-upload'
import styles from '@/pages/mange/settings/files/index.module.less'

export interface ReplaceImageProps {
  onLoading: (loading: boolean) => void
  id: number
}

export default function ReplaceImage (props: ReplaceImageProps) {
  const { id, onLoading } = props
  const updateFile = useRequest(FileUpdateApi, { manual: true })
  const { upload } = useUpload()

  const onUpload = async (files: UploadFileType[]) => {
    if (files?.[0]?.status !== 'wait') return
    try {
      onLoading(true)
      const res = await upload(files[0])
      await updateFile.runAsync({ id, src: res.path })
      sMessage.success('Replace success')
    } finally {
      onLoading(false)
    }
  }

  return (
    <Upload
      accepts={['image']}
      multiple={false}
      maxSize={1024 * 1024 * 10}
      onChange={onUpload}
    >
      <Tooltip title={'Replace'}>
        <Button
          className={styles.actionsIcon}
          type={'text'}
          size={'small'}
        >
          <ReplaceIcon style={{ fontSize: 15 }} />
        </Button>
      </Tooltip>
    </Upload>
  )
}
