import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from '@icon-park/react'
import { Button, Flex } from 'antd'
import { useSetAtom } from 'jotai'

import SRender from '@/components/s-render'
import { pageAtom } from '@/pages/mange/state'

import styles from './index.module.less'

export interface PageProps {
  children: React.ReactNode
  width?: number
  header?: React.ReactNode
  footer?: React.ReactNode
  title?: string
  back?: string
  isChange?: boolean
}

export default function Page (props: PageProps) {
  const { children, width, header, footer, title, back, isChange } = props
  const setPage = useSetAtom(pageAtom)
  const nav = useNavigate()

  useEffect(() => {
    setPage({ isChange })
  }, [isChange])

  useEffect(() => {
    return () => { setPage({}) }
  }, [])

  return (
    <div style={{ maxWidth: width, margin: '0 auto', paddingBottom: isChange !== undefined ? 60 : undefined }}>
      <Flex align={'center'} justify={'space-between'} className={styles.title}>
        <Flex gap={4} align={'center'}>
          <SRender render={!!back}>
            <Button onClick={() => { nav(back || '') }} type={'text'} className={styles['back-icon']}>
              <ArrowLeft strokeWidth={5} size={16} />
            </Button>
          </SRender>
          <div style={{ fontSize: 20 }}>{title}</div>
        </Flex>
        <div className={styles.header}>
          {header}
        </div>
      </Flex>
      {children}
      <Flex gap={12} align={'center'} className={styles.footer}>
        {footer}
        <SRender render={isChange !== undefined}>
          <Button type={'primary'}>Save</Button>
        </SRender>
      </Flex>
    </div>
  )
}
