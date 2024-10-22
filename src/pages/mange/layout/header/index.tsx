import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Right } from '@icon-park/react'
import {
  IconBell,
  IconBuildingStore,
  IconCheck,
  IconChevronDown,
  IconChevronUp,
  IconHelp,
  IconInfoCircle
} from '@tabler/icons-react'
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

  const { t } = useTranslation('common', { keyPrefix: 'header' })

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
      <Flex justify={'space-between'} align={'center'} className={styles.logo}>Shopkone</Flex>
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
              <IconInfoCircle size={18} />
              <div>{t('未保存')}</div>
            </Flex>
            <Flex align={'center'} gap={12}>
              <Button loading={page.resetLoading} onClick={page.onCancel}>{t('取消')}</Button>
              <Button onClick={onOkHandler} type={'primary'} loading={confirmLoading}>{page.okText || t('保存')}</Button>
            </Flex>
          </Flex>
        </Flex>
        <div className={styles.right}>
          <Tooltip arrow={false} title={t('前往在线商店')}>
            <Flex align={'center'} justify={'center'} className={styles.bell} >
              <IconBuildingStore size={18} />
            </Flex>
          </Tooltip>
          <Tooltip arrow={false} title={t('帮助中心')}>
            <Flex style={{ marginLeft: 4 }} align={'center'} justify={'center'} className={styles.bell} >
              <IconHelp size={18} />
            </Flex>
          </Tooltip>
          <Flex style={{ marginLeft: 4 }} align={'center'} justify={'center'} className={styles.bell} >
            <IconBell size={18} />
          </Flex>
          <span style={{ padding: '0 8px', color: '#00000030' }}>|</span>
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
                      <Flex gap={12}>
                        <SRender render={item.website_favicon}>
                          <Flex align={'center'} justify={'center'} className={styles['item-avatar']}>
                            <img src={item.website_favicon} alt={item.store_name} />
                          </Flex>
                        </SRender>
                        <Typography.Text ellipsis={{ tooltip: true }} style={{ fontWeight: 500, maxWidth: 180 }}>
                          {item.store_name}
                        </Typography.Text>
                      </Flex>
                      <IconCheck size={16} />
                    </Flex>
                  ))
                }
                  <div style={{ margin: 0, marginBottom: 4 }} className={'line'} />
                  <div className={styles.info}>
                    <SRender render={userInfo?.data?.is_master} style={{ fontWeight: 500 }}>{t('管理员')}</SRender>
                    <div>{userInfo?.data?.email}</div>
                  </div>
                  <Flex justify={'space-between'} align={'center'} className={styles.item}>
                    <div>{t('语言')}</div>
                    <div className={styles['right-icon']}><Right size={14} /></div>
                  </Flex>
                  <div className={styles.item}>
                    {t('账户管理')}
                  </div>
                  <div onClick={logout} className={styles.item}>
                    <SRender render={!logoutApi.loading}>
                      {t('退出登录')}
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
