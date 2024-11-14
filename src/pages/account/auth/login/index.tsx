import { Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet, useLocation } from 'react-router-dom'

import SLoading from '@/components/s-loading'
import Wrapper from '@/pages/account/auth/wrapper'

export default function Login () {
  const hasEmail = useLocation().pathname.includes('email')

  const { t } = useTranslation('account', { keyPrefix: 'login' })

  return (
    <Wrapper
      footer={{
        desc: t('还没账号？'),
        linkText: t('立即注册'),
        link: '/auth/signup'
      }}
      title={t('登录 ShopKimi')}
      back={hasEmail ? '/auth/login' : undefined}
    >
      <Suspense fallback={<SLoading />}>
        <Outlet />
      </Suspense>
    </Wrapper>
  )
}
