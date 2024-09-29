import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IconArrowLeft } from '@tabler/icons-react'
import { Button, Flex, Typography } from 'antd'

import SRender from '@/components/s-render'
import { useLayoutState } from '@/pages/mange/layout/state'

import styles from './index.module.less'

export interface PageProps {
  children: React.ReactNode
  width?: number
  header?: React.ReactNode
  footer?: React.ReactNode
  title?: string
  back?: string
  isChange?: boolean
  bottom?: number
  onOk?: () => Promise<void>
  onCancel?: () => void
}

export default function Page (props: PageProps) {
  const { children, width, header, footer, title, back, isChange, bottom, onOk, onCancel } = props
  const nav = useNavigate()
  const [confirmLoading, setConfirmLoading] = useState(false)
  const setIsChange = useLayoutState(state => state.setChange)
  const setAction = useLayoutState(state => state.setAction)
  const resetPage = useLayoutState(state => state.reset)

  const onOkHandle = async () => {
    try {
      setConfirmLoading(true)
      await onOk?.()
    } finally {
      setConfirmLoading(false)
    }
  }

  useEffect(() => {
    setIsChange(isChange)
  }, [isChange])

  useEffect(() => {
    setAction({ onOk, onCancel })
  }, [onOk, onCancel])

  useEffect(() => {
    return () => { resetPage(); setConfirmLoading(false) }
  }, [])

  return (
    <div style={{
      maxWidth: width,
      margin: '0 auto',
      paddingBottom: isChange !== undefined ? 60 : bottom
    }}
    >
      <SRender render={title || header}>
        <Flex align={'center'} justify={'space-between'} className={styles.title}>
          <Flex gap={8} align={'center'}>
            <SRender render={!!back}>
              <Button onClick={() => { nav(back || '') }} type={'text'} className={styles['back-icon']}>
                <IconArrowLeft size={20} />
              </Button>
            </SRender>
            <SRender render={!!title}>
              <Typography.Text ellipsis={{ tooltip: true }} style={{ fontSize: 20, maxWidth: width ? (width - 200) : undefined }}>
                {title}
              </Typography.Text>
            </SRender>
          </Flex>
          <div className={styles.header}>
            {header}
          </div>
        </Flex>
      </SRender>
      {children}
      <Flex gap={12} align={'center'} className={styles.footer}>
        {footer}
        <SRender render={isChange !== undefined}>
          <Button onClick={onOkHandle} loading={confirmLoading} disabled={!isChange} type={'primary'}>Save</Button>
        </SRender>
      </Flex>
    </div>
  )
}
