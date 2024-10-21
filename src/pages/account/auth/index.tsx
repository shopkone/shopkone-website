import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import { Flex } from 'antd'

import { ReactComponent as BannerImg } from '@/assets/image/banner.svg'
import SLoading from '@/components/s-loading'
import { useI18n } from '@/hooks/use-lang' // 引入国际化钩子

import styles from '../index.module.less'

export default function Auth () {
  const t = useI18n()

  return (
    <div className={styles.wrap}>
      <section className={styles.banner}>
        <BannerImg className={styles['banner-img']} style={{ fontSize: '400px' }} />
        <div className={styles['banner-text']}>{t('赋能品牌出海')}</div>
      </section>

      <Flex align={'center'} justify={'center'} className={styles.main}>
        <div className={styles.content}>
          <div className={styles.form}>
            <Suspense fallback={<SLoading minHeight={400} />}>
              <Outlet />
            </Suspense>
          </div>
        </div>
      </Flex>
    </div>
  )
}
