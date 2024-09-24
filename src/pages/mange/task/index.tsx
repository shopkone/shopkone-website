import { useState } from 'react'
import { Attention, Check, Minus, Up } from '@icon-park/react'
import { Badge, Button, Flex, Tabs } from 'antd'
import classNames from 'classnames'

import SLoading from '@/components/s-loading'
import SRender from '@/components/s-render'
import UploadRender from '@/pages/mange/task/upload/upload-render'
import { useUpload } from '@/pages/mange/task/upload/use-upload'

import styles from './index.module.less'

export default function Task () {
  const [mini, setMini] = useState(false)
  const files = useUpload()
  const loadingFileCount = files.filter(file => ['wait', 'uploading'].includes(file.status)).length
  const loadingCount = loadingFileCount
  const errorFileCount = files.filter(file => file.status === 'error').length
  const errorCount = errorFileCount

  const options = [
    { label: <Badge color={'#3370ff'} size={'small'} count={loadingCount}>Files</Badge>, key: 'upload' },
    { label: 'Import', key: 'import' },
    { label: 'Export', key: 'export' }
  ]

  return (
    <div className={classNames([styles.container, { [styles.max]: !mini }])}>
      <SRender render={!mini} className={styles.maxContent}>
        <Flex className={styles.header} justify={'space-between'}>
          <Tabs className={'flex1'} size={'small'} items={options} />
          <Button type={'text'} onClick={() => { setMini(!mini) }} className={styles.btn}>
            <Minus className={styles.icon} size={16} />
          </Button>
        </Flex>

        <div className={styles.content}>
          <UploadRender />
        </div>
      </SRender>

      <SRender render={mini}>
        <Flex justify={'space-between'} align={'center'} gap={12}>
          <Flex align={'center'} gap={6}>
            <div style={{ width: 20 }}>
              <SRender render={loadingCount}>
                <SLoading size={16} />
              </SRender>
              <SRender render={!loadingCount && !errorCount}>
                <Check
                  theme={'filled'}
                  fill={'#32a645'}
                  strokeWidth={6}
                  style={{ position: 'relative', top: 2 }}
                />
              </SRender>
              <SRender render={errorCount ? !loadingCount : null}>
                <Attention
                  size={16}
                  theme={'filled'}
                  fill={'#de7802'}
                  strokeWidth={6}
                  style={{ position: 'relative', top: 3 }}
                />
              </SRender>
            </div>
            <div>
              <SRender render={loadingCount}>
                <span>
                  {loadingCount} tasks are in progress.
                </span>
              </SRender>
              <SRender render={!loadingCount && !errorCount}>
                <span>All tasks have been completed.</span>
              </SRender>
              <SRender render={errorCount ? !loadingCount : null}>
                <span>{errorCount} tasks failed.</span>
              </SRender>
            </div>
          </Flex>
          <Button
            onClick={() => {
              setMini(!mini)
            }}
            className={styles.btn}
          >
            <Up className={styles.icon} size={16} />
          </Button>
        </Flex>
      </SRender>
    </div>
  )
}
