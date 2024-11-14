import { Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet, useLocation } from 'react-router-dom'

import SLoading from '@/components/s-loading'
import Wrapper from '@/pages/account/auth/wrapper'

export default function Signup () {
  const { t } = useTranslation('account', { keyPrefix: 'signup' })

  const hasEmail = useLocation().pathname.includes('email')

  return (
    <Wrapper
      footer={{
        desc: t('已有账号？'),
        linkText: t('直接登录'),
        link: '/auth/login'
      }}
      title={t('注册 ShopKimi')}
      back={hasEmail ? '/auth/signup' : undefined}
    >
      <Suspense fallback={<SLoading />}>
        <Outlet />
      </Suspense>
    </Wrapper>
  )
}
