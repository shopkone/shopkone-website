import { useState } from 'react'
import { BellOutlined, QuestionCircleOutlined, ShopOutlined } from '@ant-design/icons'
import { Attention, Check, Right } from '@icon-park/react'
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react'
import { useRequest } from 'ahooks'
import { Button, Flex, Popover, Tooltip, Typography } from 'antd'
import classNames from 'classnames'

import { useGetLoginInfo } from '@/api/account/get-account-info'
import { LogoutApi } from '@/api/account/logout'
import { useShopList } from '@/api/shop/get-shop-list'
import SLoading from '@/components/s-loading'
import SRender from '@/components/s-render'
import { useLayoutState } from '@/pages/mange/layout/state'
import { useManageState } from '@/pages/mange/state'
import { toLogin } from '@/utils/to-login'

import styles from './index.module.less'

export default function Header () {
  const page = useLayoutState()
  const logoutApi = useRequest(LogoutApi, { manual: true })
  const shopList = useShopList()
  const manageState = useManageState()
  const userInfo = useGetLoginInfo()
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [infoExpand, setInfoExpand] = useState(false)

  const logout = async () => {
    await logoutApi.runAsync()
    toLogin()
  }

  const onOkHandler = async () => {
    try {
      setConfirmLoading(true)
      await page.onOk?.()
    } finally {
      setConfirmLoading(false)
    }
  }

  return (
    <header className={styles.header}>
      <Flex justify={'space-between'} align={'center'} className={styles.logo}>shopkone</Flex>
      <Flex justify={'space-between'} flex={1}>
        <div className={'flex1'} />
        <Flex flex={2} align={'center'} justify={'center'} className={styles.center} >
          <Flex
            justify={'space-between'}
            align={'center'}
            className={
            classNames(styles['center-inner'], { [styles.hide]: !page.isChange })
            }
          >
            <Flex align={'center'} gap={4}>
              <Attention strokeWidth={4} style={{ position: 'relative', top: 2 }} size={14} />
              <div>Unsaved</div>
            </Flex>
            <Flex align={'center'} gap={12}>
              <Button onClick={page.onCancel}>Discard</Button>
              <Button onClick={onOkHandler} type={'primary'} loading={confirmLoading}>Save</Button>
            </Flex>
          </Flex>
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
          <SLoading loading={manageState.shopInfoLoading}>
            <Popover
              open={infoExpand}
              onOpenChange={(open) => { setInfoExpand(open) }}
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
              <div className={styles.avatar} style={{ background: infoExpand ? '#edeeee' : undefined }}>
                <SRender render={shopList.data}>
                  <SRender render={manageState?.shopInfo?.website_favicon} className={styles['avatar-img']}>
                    <img src={manageState?.shopInfo?.website_favicon} alt={manageState?.shopInfo?.store_name} />
                  </SRender>
                  <Typography.Text ellipsis={{ tooltip: true }} className={styles['avatar-text']}>
                    {manageState?.shopInfo?.store_name}
                  </Typography.Text>
                </SRender>
                {
                  infoExpand
                    ? (
                      <IconChevronUp size={14} />
                      )
                    : (
                      <IconChevronDown size={14} />
                      )
                }
              </div>
            </Popover>
          </SLoading>
        </div>
      </Flex>
    </header>
  )
}
