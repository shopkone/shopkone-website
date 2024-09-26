import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from '@icon-park/react'
import { Button, Flex } from 'antd'

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
}

export default function Page (props: PageProps) {
  const { children, width, header, footer, title, back, isChange, bottom } = props
  const nav = useNavigate()
  const setIsChange = useLayoutState(state => state.setChange)
  const resetPage = useLayoutState(state => state.reset)

  useEffect(() => {
    setIsChange(isChange)
  }, [isChange])

  useEffect(() => {
    return () => { resetPage() }
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
          <Flex gap={4} align={'center'}>
            <SRender render={!!back}>
              <Button onClick={() => { nav(back || '') }} type={'text'} className={styles['back-icon']}>
                <ArrowLeft strokeWidth={5} size={16} />
              </Button>
            </SRender>
            <SRender render={!!title}>
              <div style={{ fontSize: 20 }}>{title}</div>
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
          <Button type={'primary'}>Save</Button>
        </SRender>
      </Flex>
    </div>
  )
}
