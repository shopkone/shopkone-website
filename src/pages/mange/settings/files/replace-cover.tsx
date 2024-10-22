import { useTranslation } from 'react-i18next'
import { IconImageInPicture } from '@tabler/icons-react'
import { useRequest } from 'ahooks'
import { Button, Tooltip } from 'antd'

import { FileUpdateApi } from '@/api/file/file-update'
import { UploadFileType } from '@/api/file/UploadFileType'
import { sMessage } from '@/components/s-message'
import Upload from '@/components/upload'
import { useUpload } from '@/components/upload/use-upload'
import styles from '@/pages/mange/settings/files/index.module.less'

export interface ReplaceCoverProps {
  onLoading: (loading: boolean) => void
  id: number
}

export default function ReplaceCover (props: ReplaceCoverProps) {
  const { id, onLoading } = props
  const updateFile = useRequest(FileUpdateApi, { manual: true })
  const { upload } = useUpload()
  const { t } = useTranslation('product')

  const onUpload = async (files: UploadFileType[]) => {
    if (files?.[0]?.status !== 'wait') return
    try {
      onLoading(true)
      const res = await upload(files[0])
      await updateFile.runAsync({ id, cover: res.path })
      sMessage.success(t('替换成功'))
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
      <Tooltip title={t('替换封面')}>
        <Button
          onMouseDown={e => { e.stopPropagation() }}
          className={styles.actionsIcon}
          type={'text'}
          size={'small'}
        >
          <IconImageInPicture style={{ position: 'relative', top: -1 }} size={17} />
        </Button>
      </Tooltip>
    </Upload>
  )
}
