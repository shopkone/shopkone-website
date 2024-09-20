import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import { Flex } from 'antd'

import { ReactComponent as BannerImg } from '@/assets/image/banner.svg'
import SLoading from '@/components/s-loading'

import styles from '../index.module.less'

export default function Auth () {
  return (
    <div className={styles.wrap}>
      <section className={styles.banner}>
        <BannerImg className={styles['banner-img']} style={{ fontSize: '400px' }} />
        <div className={styles['banner-text']}>Empowering Brands for Global Expansion</div>
      </section>

      <Flex align={'center'} justify={'center'} className={styles.main}>
        <div className={styles.content}>
          <div className={styles.form}>
            <Suspense fallback={<SLoading />}>
              <Outlet />
            </Suspense>
          </div>
          <div className={styles.trem}>
            <div>By proceeding, you agree to the Terms and Conditions and Privacy Policy</div>
            <Flex>
              <div>Help</div>
              <div>Help</div>
              <div>Help</div>
            </Flex>
          </div>
        </div>
      </Flex>
    </div>
  )
}
