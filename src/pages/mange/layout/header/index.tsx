import { BellOutlined, QuestionCircleOutlined, ShopOutlined } from '@ant-design/icons'
import { Attention, Check, Right } from '@icon-park/react'
import { Button, Flex, Popover, Tooltip } from 'antd'
import { useAtomValue } from 'jotai'

import SRender from '@/components/s-render'
import { pageAtom } from '@/pages/mange/state'

import styles from './index.module.less'

export default function Header () {
  const page = useAtomValue(pageAtom)

  console.log(page)

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
              <Flex justify={'space-between'} className={styles.item}>
                <Flex gap={6}>
                  <Flex align={'center'} justify={'center'} className={styles['item-avatar']}>
                    Ms
                  </Flex>
                  <div style={{ fontWeight: 500 }}>My store</div>
                </Flex>
                <Check strokeWidth={6} size={11} />
              </Flex>
              <div style={{ margin: 0, marginBottom: 4 }} className={'line'} />
              <div className={styles.info}>
                <div style={{ fontWeight: 500 }}>asd fa</div>
                <div>oetavttsut@daimashili.com</div>
              </div>
              <Flex justify={'space-between'} align={'center'} className={styles.item}>
                <div>Language</div>
                <div className={styles['right-icon']}><Right size={14} /></div>
              </Flex>
              <div className={styles.item}>
                Manage account
              </div>
              <div className={styles.item}>
                Log out
              </div>
            </div>
          )}
        >
          <div className={styles.avatar}>
            <div className={styles['avatar-img']}>MS</div>
            <div className={styles['avatar-text']}>My Store</div>
          </div>
        </Popover>
      </div>
    </header>
  )
}
