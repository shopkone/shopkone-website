import { useTranslation } from 'react-i18next'
import { IconReplace } from '@tabler/icons-react'
import { useRequest } from 'ahooks'
import { Button, Tooltip } from 'antd'

import { FileUpdateApi } from '@/api/file/file-update'
import { UploadFileType } from '@/api/file/UploadFileType'
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
  const { t } = useTranslation('settings', { keyPrefix: 'file' })

  const onUpload = async (files: UploadFileType[]) => {
    if (files?.[0]?.status !== 'wait') return
    try {
      if (!files.length) return
      onLoading(true)
      const res = await upload({ ...files[0], status: 'uploading' })
      await updateFile.runAsync({ id, src: res.path })
      sMessage.success(t('替换成功1'))
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
      <Tooltip title={t('替换')}>
        <Button
          onMouseDown={e => { e.stopPropagation() }}
          className={styles.actionsIcon}
          type={'text'}
          size={'small'}
        >
          <IconReplace size={15} />
        </Button>
      </Tooltip>
    </Upload>
  )
}
