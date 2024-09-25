import { useState } from 'react'
import { Plus } from '@icon-park/react'
import classNames from 'classnames'
import { useAtomValue } from 'jotai'

import Image from '@/components/image'
import SLoading from '@/components/s-loading'
import SRender from '@/components/s-render'
import Upload from '@/components/upload'
import styles from '@/pages/mange/settings/general/index.module.less'
import { uploadList } from '@/pages/mange/task/state'

export interface UploaderProps {
  value: string
  onChange: (value: string) => void
}

export default function Uploader () {
  const [uploadKey, setUploadKey] = useState<string>()
  const files = useAtomValue(uploadList)
  const file = files.find(i => i.uuid === uploadKey)

  const isLoading = file?.status && ['uploading', 'wait'].includes(file.status)

  if (isLoading) {
    return (
      <div className={classNames(styles.favicon, styles.faviconLoading)}>
        <SLoading loading size={24} />
      </div>
    )
  }

  return (
    <Upload
      global={false}
      accepts={['image']}
      maxSize={1024 * 1024 * 10}
      multiple
      align={'center'}
      justify={'center'}
      className={styles.favicon}
      onUpload={(files) => {
        setUploadKey(files[0].uuid)
      }}
    >
      <SRender render={file?.path}>
        <Image style={{ width: 64, height: 64 }} src={file?.path} alt={file?.alt} />
      </SRender>
      <SRender render={!file?.path}>
        <Plus size={24} style={{ position: 'relative', top: 2 }} />
      </SRender>
    </Upload>
  )
}
