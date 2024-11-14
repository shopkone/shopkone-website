import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { ArrowRight } from '@icon-park/react'
import { IconArrowLeft } from '@tabler/icons-react'
import { Button, Flex, Form } from 'antd'

import IconButton from '@/components/icon-button'
import SRender from '@/components/s-render'
import { useNav } from '@/hooks/use-nav'

import styles from './index.module.less'

export interface WrapperProps {
  children: ReactNode
  title: ReactNode
  footer?: {
    desc: string
    linkText: string
    link: string
  }
  back?: string
}

export default function Wrapper (props: WrapperProps) {
  const { children, title, footer, back } = props
  const nav = useNav()
  const { t } = useTranslation('account', { keyPrefix: 'base' })
  const [form] = Form.useForm()

  return (
    <Flex justify={'center'} vertical className={styles.wrap}>
      <div className={styles.header}>
        <SRender render={back}>
          <IconButton
            onClick={() => {
              nav(back || '')
            }}
            type={'text'}
            size={28}
          >
            <IconArrowLeft size={24} />
          </IconButton>
        </SRender>
      </div>

      <div className={styles.title}>
        {title}
      </div>

      <Form form={form} className={styles.main}>
        {children}
      </Form>

      <Flex wrap={'wrap'} className={styles.agreenment}>
        <div style={{ marginTop: 1 }}>{t('协议')}</div>
        <Button target={'_blank'} href={'https://shoplineapp.cn/about/terms/'} type={'link'} size={'small'}>
          {t('用户协议')}
        </Button>
        <Button target={'_blank'} href={'https://shoplineapp.cn/about/terms/'} type={'link'} size={'small'}>
          {t('隐私政策')}
        </Button>
      </Flex>

      <SRender className={styles.footer} render={footer}>
        <div>
          {footer?.desc}
        </div>
        <Button
          className={styles.footerBtn} type={'link'} onClick={() => {
            nav(footer?.link || '')
          }}
        >
          <div className={styles.footerLink}>{footer?.linkText}</div>
          <ArrowRight className={styles.footerIcon} />
        </Button>
      </SRender>
    </Flex>
  )
}
