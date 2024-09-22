import { BellOutlined, QuestionCircleOutlined, ShopOutlined } from '@ant-design/icons'
import { Attention, Check, Right } from '@icon-park/react'
import { useRequest } from 'ahooks'
import { Button, Flex, Popover, Skeleton, Tooltip } from 'antd'
import { useAtomValue } from 'jotai'

import { useGetLoginInfo } from '@/api/account/get-account-info'
import { LogoutApi } from '@/api/account/logout'
import { useGetShopInfo } from '@/api/shop/get-shop-info'
import { useShopList } from '@/api/shop/get-shop-list'
import SLoading from '@/components/s-loading'
import SRender from '@/components/s-render'
import { pageAtom } from '@/pages/mange/state'
import { toLogin } from '@/utils/to-login'

import styles from './index.module.less'

export default function Header () {
  const page = useAtomValue(pageAtom)
  const logoutApi = useRequest(LogoutApi, { manual: true })
  const shopList = useShopList()
  const shop = useGetShopInfo()
  const userInfo = useGetLoginInfo()

  const logout = async () => {
    await logoutApi.runAsync()
    toLogin()
  }

  return (
    <header className={styles.header}>
      <Flex align={'center'} className={styles.logo}>shopkone</Flex>
      <Flex align={'center'} justify={'center'} className={styles.center} >
        <SRender render={page.isChange}>
          <Flex justify={'space-between'} align={'center'} className={styles['center-inner']}>
            <Flex align={'center'} gap={4}>
              <Attention strokeWidth={4} style={{ position: 'relative', top: 2 }} size={14} />
              <div>Unsaved</div>
            </Flex>
            <Flex align={'center'} gap={12}>
              <Button>Discard</Button>
              <Button type={'primary'}>Save</Button>
            </Flex>
          </Flex>
        </SRender>
      </Flex>
      <div className={styles.right}>
        <Tooltip arrow={false} title={'View your online store'}>
          <Flex align={'center'} justify={'center'} className={styles.bell} >
            <ShopOutlined />
          </Flex>
        </Tooltip>
        <Tooltip arrow={false} title={'Help center'}>
          <Flex align={'center'} justify={'center'} className={styles.bell} >
            <QuestionCircleOutlined />
          </Flex>
        </Tooltip>
        <Flex align={'center'} justify={'center'} className={styles.bell} >
          <BellOutlined />
        </Flex>
        <Popover
          trigger={'click'}
          placement={'bottomRight'}
          arrow={false}
          overlayInnerStyle={{ padding: 0 }}
          content={(
            <div className={styles.popover}>
              {
                shopList?.data?.map((item) => (
                  <Flex key={item.uuid} justify={'space-between'} className={styles.item}>
                    <Flex gap={6}>
                      <SRender render={item.website_favicon}>
                        <Flex align={'center'} justify={'center'} className={styles['item-avatar']}>
                          <img src={item.website_favicon} alt={item.store_name} />
                        </Flex>
                      </SRender>
                      <div style={{ fontWeight: 500 }}>{item.store_name}</div>
                    </Flex>
                    <Check strokeWidth={6} size={11} />
                  </Flex>
                ))
              }
              <div style={{ margin: 0, marginBottom: 4 }} className={'line'} />
              <div className={styles.info}>
                <SRender render={userInfo?.data?.is_master} style={{ fontWeight: 500 }}>admin</SRender>
                <div>{userInfo?.data?.email}</div>
              </div>
              <Flex justify={'space-between'} align={'center'} className={styles.item}>
                <div>Language</div>
                <div className={styles['right-icon']}><Right size={14} /></div>
              </Flex>
              <div className={styles.item}>
                Manage account
              </div>
              <div onClick={logout} className={styles.item}>
                <SRender render={!logoutApi.loading}>
                  Log out
                </SRender>
                <SRender render={logoutApi.loading}>
                  <SLoading size={20} />
                </SRender>
              </div>
            </div>
          )}
        >
          <div className={styles.avatar}>
            <SRender render={shopList.data}>
              <SRender render={shop?.data?.website_favicon} className={styles['avatar-img']}>
                <img src={shop.data?.website_favicon} alt={shop.data?.store_name} />
              </SRender>
              <div className={styles['avatar-text']}>{shop.data?.store_name}</div>
            </SRender>
            <SRender render={!shopList.data}>
              <Skeleton.Button active style={{ width: 100 }} />
            </SRender>
          </div>
        </Popover>
      </div>
    </header>
  )
}
