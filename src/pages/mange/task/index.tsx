import { Attention, Check, Close, Minus, Up } from '@icon-park/react'
import { Badge, Button, Flex, Tabs } from 'antd'
import classNames from 'classnames'

import SLoading from '@/components/s-loading'
import SRender from '@/components/s-render'
import { useI18n } from '@/hooks/use-lang'
import { useGlobalTask } from '@/pages/mange/task/state'
import UploadRender from '@/pages/mange/task/upload/upload-render'
import { useTaskUpload } from '@/pages/mange/task/upload/use-task-upload'

import styles from './index.module.less'

export default function Task () {
  const globalTask = useGlobalTask(state => state)
  useTaskUpload()
  const loadingFileCount = globalTask.files.filter(file => ['wait', 'uploading'].includes(file.status)).length
  const loadingCount = loadingFileCount
  const errorFileCount = globalTask.files.filter(file => file.status === 'error').length
  const errorCount = errorFileCount
  const t = useI18n()

  const options = [
    { label: <Badge color={'#3370ff'} size={'small'} count={loadingCount}>{t('文件')}</Badge>, key: 'upload' },
    { label: t('导入'), key: 'import' },
    { label: t('导出'), key: 'export' }
  ]

  if (!globalTask.isOpen) return null

  return (
    <div className={classNames([styles.container, { [styles.max]: globalTask.isExpand }])}>
      <SRender render={globalTask.isExpand} className={styles.maxContent}>
        <Flex className={styles.header} justify={'space-between'}>
          <Tabs className={'flex1'} size={'small'} items={options} />
          <Button type={'text'} onClick={() => { globalTask.collapse() }} className={styles.btn}>
            <Minus className={styles.icon} size={16} />
          </Button>
        </Flex>

        <div className={styles.content}>
          <UploadRender />
        </div>
      </SRender>

      <SRender render={!globalTask.isExpand}>
        <Flex style={{ position: 'relative', top: 2 }} justify={'space-between'} align={'center'} gap={12}>
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
                  {loadingCount} {t('个任务正在进行中。')}
                </span>
              </SRender>
              <SRender render={!loadingCount && !errorCount}>
                <span>{t('所有任务已完成。')}</span>
              </SRender>
              <SRender render={errorCount ? !loadingCount : null}>
                <span>{errorCount} {t('个任务失败。')}</span>
              </SRender>
            </div>
          </Flex>
          <Flex align={'center'} gap={12}>
            <SRender render={!(!loadingCount && !errorCount)}>
              <Button
                onClick={globalTask.expand}
                className={styles.btn}
              >
                <Up className={styles.icon} size={16} />
              </Button>
            </SRender>
            <SRender render={!loadingCount}>
              <Button
                onClick={globalTask.close}
                style={{
                  height: 26,
                  width: 26
                }}
                type={'text'}
                size={'small'}
              >
                <Close style={{ position: 'relative', left: -2, top: 1 }} size={12} />
              </Button>
            </SRender>
          </Flex>
        </Flex>
      </SRender>
    </div>
  )
}
