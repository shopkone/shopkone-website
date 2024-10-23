import { Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet, useNavigate } from 'react-router-dom'
import { ArrowRight } from '@icon-park/react'
import { Button, Flex, Form } from 'antd'

import SLoading from '@/components/s-loading'

import styles from '../../index.module.less'

export default function Login () {
  const [form] = Form.useForm()
  const nav = useNavigate()

  const { t } = useTranslation('account', { keyPrefix: 'login' })

  return (
    <Flex vertical className={'fit-width fit-height'} style={{ position: 'relative' }}>

      <div className={styles.title}>{t('登录 Shopkone')}</div>

      <Form style={{ flex: 1 }} layout={'vertical'} form={form}>

        <Flex className={'fit-height'} vertical>
          <div style={{ flex: 1 }}>
            <Suspense fallback={<SLoading />}>
              <Outlet />
            </Suspense>
          </div>

          <Flex align={'center'} justify={'center'} className={styles['help-link']}>
            <div>{t('还没账号？')} </div>
            <Button
              onClick={() => {
                nav('/auth/signup')
              }} size={'small'} className={styles['link-btn']} type={'link'}
            >
              <Flex style={{ fontSize: 13 }} align={'center'} gap={4}>
                <div>{t('立即注册')}</div>
                <ArrowRight className={styles['link-icon']} />
              </Flex>
            </Button>
          </Flex>
        </Flex>
      </Form>

    </Flex>
  )
}
