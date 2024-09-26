import { useEffect, useState } from 'react'
import { Plus } from '@icon-park/react'
import { useRequest } from 'ahooks'
import { Flex } from 'antd'
import classNames from 'classnames'

import { AddFileApi } from '@/api/file/add-file-record'
import { UploadFileType } from '@/api/file/UploadFileType'
import Image from '@/components/image'
import SelectFiles from '@/components/media/select-files'
import SLoading from '@/components/s-loading'
import SRender from '@/components/s-render'
import { useUpload } from '@/components/upload/use-upload'
import { useOpen } from '@/hooks/useOpen'
import styles from '@/pages/mange/settings/general/index.module.less'

export interface UploaderProps {
  value: string
  onChange: (value: string) => void
}

export default function Uploader () {
  const [file, setFile] = useState<UploadFileType>()
  const { upload } = useUpload()
  const addFile = useRequest(AddFileApi, { manual: true })

  const openInfo = useOpen<number[]>([])

  useEffect(() => {
    if (file?.status === 'wait') {
      upload(file).then(async res => {
        await addFile.runAsync(res)
        setFile(res)
      })
    }
  }, [file])

  if (['uploading', 'wait'].includes(file?.status || '')) {
    return (
      <div className={classNames(styles.favicon, styles.faviconLoading)}>
        <SLoading loading size={24} />
      </div>
    )
  }

  return (
    <div>
      <Flex onClick={() => { openInfo.edit() }} align={'center'} justify={'center'} className={styles.favicon}>
        <SRender render={file?.path}>
          <Image style={{ width: 64, height: 64 }} src={file?.path} alt={file?.alt} />
        </SRender>
        <SRender render={!file?.path}>
          <Plus size={24} style={{ position: 'relative', top: 2 }} />
        </SRender>
      </Flex>
      <SelectFiles info={openInfo} />
    </div>
  )
}
