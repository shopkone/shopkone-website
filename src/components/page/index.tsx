import { ReactNode, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { IconArrowLeft } from '@tabler/icons-react'
import { Button, Flex, Typography } from 'antd'

import SLoading from '@/components/s-loading'
import SRender from '@/components/s-render'
import { useLayoutState } from '@/pages/mange/layout/state'

import styles from './index.module.less'

export interface PageProps {
  children: React.ReactNode
  width?: number
  header?: React.ReactNode
  footer?: React.ReactNode
  title?: React.ReactNode
  back?: string
  isChange?: boolean
  bottom?: number
  onOk?: () => Promise<void>
  onCancel?: () => void
  loading?: boolean
  resetLoading?: boolean
  okText?: ReactNode
  loadingHiddenBg?: boolean
}

export default function Page (props: PageProps) {
  const { loadingHiddenBg, children, width, header, footer, title, back, isChange, bottom = 64, onOk, onCancel, loading = false, resetLoading = false, okText } = props
  const nav = useNavigate()
  const [confirmLoading, setConfirmLoading] = useState(false)
  const setIsChange = useLayoutState(state => state.setChange)
  const setAction = useLayoutState(state => state.setAction)
  const resetPage = useLayoutState(state => state.reset)
  const setResetLoading = useLayoutState(state => state.setResetLoading)
  const setOkText = useLayoutState(state => state.setOkText)
  const { t } = useTranslation('common', { keyPrefix: 'page' })

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

  useEffect(() => {
    setResetLoading(resetLoading)
  }, [resetLoading])

  useEffect(() => {
    document.getElementById('shopkone-main')?.scrollTo?.({ top: 0 })
  }, [])

  useEffect(() => {
    if (okText) {
      setOkText(okText)
    }
  }, [okText])

  return (
    <div
      style={{
        maxWidth: width,
        margin: '0 auto',
        paddingBottom: isChange !== undefined ? 60 : bottom,
        maxHeight: loading && loadingHiddenBg ? 500 : undefined,
        overflow: loading && loadingHiddenBg ? 'hidden' : undefined,
        minHeight: '110%'
      }}
    >
      <SRender render={title || header || back}>
        <Flex justify={'space-between'} gap={24} className={styles.title}>
          <Flex style={{ minWidth: 0 }} flex={1} gap={8}>
            <SRender render={!!back}>
              <Button style={{ position: 'relative', top: 1 }} onClick={() => { nav(back || '') }} type={'text'} className={styles['back-icon']}>
                <IconArrowLeft size={20} />
              </Button>
            </SRender>
            <SRender render={!!title}>
              <Typography.Text style={{ fontSize: 20, flex: 1, lineHeight: '28px', position: 'relative', top: 1 }}>
                {title}
              </Typography.Text>
            </SRender>
          </Flex>
          <div className={styles.header}>
            {header}
          </div>
        </Flex>
      </SRender>
      <SLoading loading={loading} foreShow={!loadingHiddenBg}>
        {children}
        <Flex gap={12} align={'center'} className={styles.footer}>
          {footer}
          <SRender render={isChange !== undefined}>
            <Button onClick={onOkHandle} loading={confirmLoading} disabled={!isChange} type={'primary'}>{okText || t('保存')}</Button>
          </SRender>
        </Flex>
      </SLoading>
    </div>
  )
}
