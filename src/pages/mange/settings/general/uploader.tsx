import { useEffect, useState } from 'react'
import { Plus } from '@icon-park/react'
import { useRequest } from 'ahooks'
import { Flex } from 'antd'
import classNames from 'classnames'

import { FileType } from '@/api/file/add-file-record'
import { fileListByIds, FileListByIdsRes } from '@/api/file/file-list-by-ids'
import FileImage from '@/components/file-image'
import SelectFiles from '@/components/media/select-files'
import SLoading from '@/components/s-loading'
import SRender from '@/components/s-render'
import { useOpen } from '@/hooks/useOpen'
import styles from '@/pages/mange/settings/general/index.module.less'

export interface UploaderProps {
  value?: number
  onChange?: (value: number) => void
}

export default function Uploader (props: UploaderProps) {
  const [file, setFile] = useState<FileListByIdsRes>()
  const list = useRequest(fileListByIds, { manual: true })

  const openInfo = useOpen<number[]>([])

  useEffect(() => {
    if (!props.value) return
    list.runAsync({ ids: [Number(props.value)] }).then(list => { setFile(list?.[0]) })
  }, [props.value])

  return (
    <div>
      <SRender render={list.loading}>
        <div className={classNames(styles.favicon, styles.faviconLoading)}>
          <SLoading loading size={24} />
        </div>
      </SRender>
      <SRender render={!list.loading}>
        <Flex
          onClick={() => { openInfo.edit(props.value ? [props.value] : []) }} align={'center'} justify={'center'} className={styles.favicon}
        >
          <SRender render={props.value}>
            <FileImage type={FileType.Image} width={64} height={64} src={file?.path || ''} alt={file?.path} />
          </SRender>
          <SRender render={!props.value}>
            <Plus size={24} style={{ position: 'relative', top: 2 }} />
          </SRender>
        </Flex>
      </SRender>
      <SelectFiles
        includes={[FileType.Image]}
        onConfirm={async select => {
          openInfo.close()
          props.onChange?.(select?.[0])
        }}
        info={openInfo}
      />
    </div>
  )
}
