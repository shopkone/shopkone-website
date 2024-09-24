import { useNavigate } from 'react-router-dom'
import { Attention, CheckOne, Close } from '@icon-park/react'
import { Button, Flex, Typography } from 'antd'
import classNames from 'classnames'
import { useAtomValue } from 'jotai'

import { UploadFileType } from '@/api/file/UploadFileType'
import Image from '@/components/image'
import SRender from '@/components/s-render'
import { uploadList } from '@/pages/mange/task/state'
import { formatFileSize } from '@/utils/format'

import styles from './index.module.less'

export default function UploadRender () {
  const nav = useNavigate()

  const toFilePage = (file: UploadFileType) => {
    if (file.status !== 'done') return
    nav(`/settings/files?name=${file.name}`)
  }

  const fileList = useAtomValue(uploadList)

  return (
    <Flex className={styles.container} vertical gap={12}>
      {
        fileList?.map(file => (
          <Flex
            onClick={() => { toFilePage(file) }}
            justify={'space-between'}
            align={'center'}
            className={classNames(styles.item, { [styles.done]: file.status === 'done' })}
            key={file.uuid}
          >
            <Flex gap={8}>
              <div className={styles.img}>
                <Image src={file.path} loading={['wait', 'uploading'].includes(file.status)} />
              </div>
              <div>
                <Typography.Text
                  ellipsis
                  className={styles.title}
                >
                  {file.name}
                </Typography.Text>
                <div className={styles.desc}>
                  {file.suffix} {formatFileSize(file.size)}
                </div>
              </div>
            </Flex>

            <SRender render={['wait', 'uploading'].includes(file.status)}>
              <Button className={styles.size28} type={'text'} size={'small'}>
                <Close />
              </Button>
            </SRender>
            <SRender style={{ marginRight: 8 }} render={file.status === 'done'}>
              <CheckOne theme={'filled'} size={16} fill={'#32a645'} />
            </SRender>
            <SRender style={{ marginRight: 8 }} render={file.status === 'error'}>
              <Attention theme={'filled'} size={16} fill={'#de7802'} />
            </SRender>
          </Flex>
        ))
      }
    </Flex>
  )
}
