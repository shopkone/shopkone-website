import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  IconChecklist,
  IconChevronUp,
  IconCircleCheckFilled,
  IconExclamationCircleFilled,
  IconX
} from '@tabler/icons-react'
import { useMemoizedFn } from 'ahooks'
import { Flex, Tooltip } from 'antd'
import classNames from 'classnames'

import IconButton from '@/components/icon-button'
import SEmpty from '@/components/s-empty'
import SLoading from '@/components/s-loading'
import SRender from '@/components/s-render'
import { useTask } from '@/pages/mange/task/state'
import UploadTask from '@/pages/mange/task/upload-task'

import styles from './index.module.less'

export default function Task () {
  const { t } = useTranslation('common', { keyPrefix: 'task' })
  const state = useTask(state => state)
  const [expand, setExpand] = useState(false)
  const [close, setClose] = useState(true)

  const total = useMemo(() => {
    return state.uploadTasks.length
  }, [state.uploadTasks])

  const errorTotal = useMemo(() => {
    const upload = state.uploadTasks.filter(item => item.status === 'error')
    return upload.length
  }, [state.uploadTasks])

  const successTotal = useMemo(() => {
    const upload = state.uploadTasks.filter(item => item.status === 'done')
    return upload.length
  }, [state.uploadTasks])

  const loadingTotal = useMemo(() => {
    const upload = state.uploadTasks.filter(item => item.status === 'uploading')
    return upload.length
  }, [state.uploadTasks])

  const LoadingRender = useMemoizedFn(() => (
    <Flex align={'center'} gap={6}>
      <Flex align={'center'} gap={6}>
        <div><SLoading size={18} /></div>
        <div>{successTotal + errorTotal} / {total}，</div>
      </Flex>
      <div>{t('任务正在执行，请不要关闭或刷新页面')}</div>
    </Flex>
  ))

  const ErrorRender = useMemoizedFn(() => (
    <Flex align={'center'} gap={6}>
      <IconExclamationCircleFilled color={'#d32f2f'} size={17} />
      <div>{t('执行失败', { count: errorTotal })}</div>
    </Flex>
  ))

  const SuccessRender = useMemoizedFn(() => (
    <Flex align={'center'} gap={6}>
      <IconCircleCheckFilled color={'#2e7d32'} size={18} />
      <div>{t('已完成', { count: successTotal })}</div>
    </Flex>
  ))

  useEffect(() => {
    if (close && expand) {
      setExpand(false)
    }
  }, [close])

  useEffect(() => {
    if (total > 0) {
      setClose(false)
    }
  }, [total])

  return (
    <div className={classNames(styles.container, close && styles.close)}>
      <SRender render={!close}>
        <Flex gap={16} align={'center'} justify={'space-between'} style={{ padding: '12px 16px 12px 16px' }}>
          <SRender render={successTotal === total && total}>
            <SuccessRender />
          </SRender>
          <SRender render={loadingTotal}>
            <LoadingRender />
          </SRender>
          <SRender render={errorTotal ? !loadingTotal : null}>
            <ErrorRender />
          </SRender>
          <SRender render={!total}>
            {t('没有正在执行的任务')}
          </SRender>
          <Flex gap={8}>
            <Tooltip title={expand ? t('收起') : t('展开')}>
              <IconButton onClick={() => { setExpand(!expand) }} type={'text'} size={24}>
                <IconChevronUp size={17} style={{ transform: `rotate(${expand ? 180 : 0}deg)` }} />
              </IconButton>
            </Tooltip>
            <SRender render={!loadingTotal}>
              <Tooltip title={t('关闭')}>
                <IconButton onClick={() => { setClose(true) }} type={'text'} size={24}>
                  <IconX size={15} />
                </IconButton>
              </Tooltip>
            </SRender>
          </Flex>
        </Flex>
      </SRender>

      <SRender render={close}>
        <IconButton onClick={() => { setClose(false) }} size={26}>
          <IconChecklist size={20} color={'#888'} />
        </IconButton>
      </SRender>

      <div className={classNames(expand && styles.expand, !expand && styles.unExpand)}>
        <UploadTask tasks={state.uploadTasks} />
        <SRender style={{ padding: 16 }} render={!total}>
          <SEmpty />
        </SRender>
      </div>
    </div>
  )
}
