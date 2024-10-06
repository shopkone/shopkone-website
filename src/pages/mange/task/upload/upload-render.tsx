import { Attention, CheckOne, Close } from '@icon-park/react'
import { Button, Flex, Tooltip, Typography } from 'antd'

import FileImage from '@/components/file-image'
import SRender from '@/components/s-render'
import { useGlobalTask } from '@/pages/mange/task/state'
import { formatFileSize } from '@/utils/format'

import styles from './index.module.less'

export default function UploadRender () {
  const files = useGlobalTask(state => state.files)

  return (
    <Flex className={styles.container} vertical gap={12}>
      {
        files?.map(file => (
          <Flex
            justify={'space-between'}
            align={'center'}
            className={styles.item}
            key={file.uuid}
          >
            <Flex gap={8} align={'center'}>
              <FileImage
                error={file.status === 'error'}
                src={file.cover || file.path}
                type={file.type} width={36}
                height={36}
                loading={['wait', 'uploading'].includes(file.status)}
              />
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
                <Close style={{ position: 'relative', left: -2, top: 1 }} />
              </Button>
            </SRender>
            <SRender style={{ marginRight: 8 }} render={file.status === 'done'}>
              <CheckOne theme={'filled'} size={16} fill={'#32a645'} />
            </SRender>
            <SRender style={{ marginRight: 8 }} render={file.status === 'error'}>
              <Tooltip title={file.errMsg}>
                <Attention theme={'filled'} size={16} fill={'#de7802'} />
              </Tooltip>
            </SRender>
          </Flex>
        ))
      }
    </Flex>
  )
}
