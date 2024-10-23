import { Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { ArrowRight } from '@icon-park/react'
import { IconChevronLeft } from '@tabler/icons-react'
import { Button, Flex, Form } from 'antd'

import IconButton from '@/components/icon-button'
import SLoading from '@/components/s-loading'
import SRender from '@/components/s-render'

import styles from '../../index.module.less'

export default function Signup () {
  const [form] = Form.useForm()
  const { t } = useTranslation('account', { keyPrefix: 'signup' })
  const nav = useNavigate()

  const hasEmail = useLocation().pathname.includes('email')

  return (
    <Flex vertical className={'fit-width fit-height'} style={{ position: 'relative' }}>
      <SRender render={hasEmail} style={{ position: 'absolute', left: -42, top: -48 }}>
        <IconButton onClick={() => { nav('/auth/signup') }} type={'text'} size={32}>
          <IconChevronLeft size={24} />
        </IconButton>
      </SRender>

      <div className={styles.title}>{t('注册 Shopkone')}</div>

      <Form style={{ flex: 1 }} layout={'vertical'} form={form} colon={false}>

        <Suspense fallback={<SLoading />}>
          <Outlet />
        </Suspense>

        <Flex justify={'center'} className={`secondary ${styles.agreement}`} align={'center'}>
          {t('协议')}
          <Button target={'_blank'} href={'https://shoplineapp.cn/about/terms/'} className={styles.linkAgreement} type={'link'} size={'small'}>
            {t('用户协议')}
          </Button>
          <Button target={'_blank'} href={'https://shoplineapp.cn/about/terms/'} className={styles.linkAgreement} type={'link'} size={'small'}>
            {t('隐私政策')}
          </Button>
        </Flex>
      </Form>

      <Flex align={'center'} justify={'center'} className={styles['help-link']}>
        <div>{t('已有账号？')}</div>
        <Button
          onClick={() => {
            nav('/auth/login')
          }} size={'small'} className={styles['link-btn']} type={'link'}
        >
          <Flex style={{ fontSize: 13 }} align={'center'} gap={4}>
            <div>{t('直接登录')}</div>
            <ArrowRight className={styles['link-icon']} />
          </Flex>
        </Button>
      </Flex>
    </Flex>
  )
}
