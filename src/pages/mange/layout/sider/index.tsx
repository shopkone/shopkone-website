import { useLocation, useNavigate } from 'react-router-dom'
import { CornerDownRight, Down, Home } from '@icon-park/react'
import { useMemoizedFn } from 'ahooks'
import { Flex } from 'antd'
import classNames from 'classnames'

import SRender from '@/components/s-render'

import styles from './index.module.less'

export default function Sider () {
  const nav = useNavigate()
  const location = useLocation()

  const menus = [
    {
      title: 'Home',
      key: 'home',
      icon: <Home style={{ position: 'relative', top: 2 }} size={14} />
    },
    {
      title: 'Products',
      key: 'products',
      icon: <Home style={{ position: 'relative', top: 2 }} size={14} />,
      children: [
        { title: 'Products', key: 'products' },
        { title: 'Collections', key: 'collections' },
        { title: 'Inventory', key: 'inventory' },
        { title: 'Purchase Order', key: 'purchase_order' },
        { title: 'Transfers', key: 'transfers' },
        { title: 'Gift cards', key: 'gift_cards' }
      ]
    }
  ]

  const getIsSelect = useMemoizedFn((key: string) => {
    return location.pathname.includes(key)
  })

  const to = (key: string) => {
    if (getIsSelect(key)) return
    nav(key)
  }

  return (
    <nav className={styles.sider}>
      <div className={'group'}>
        {
          menus.map(item => (
            <div key={item.key}>
              <Flex justify={'space-between'} align={'center'} className={styles.item}>
                <Flex gap={8} align={'center'}>
                  {item.icon}
                  <div>{item.title}</div>
                </Flex>
                <SRender render={!!item?.children}>
                  <Down size={14} style={{ position: 'relative', top: 2 }} />
                </SRender>
              </Flex>
              {item?.children?.map(child => (
                <Flex
                  onClick={() => { to(child.key) }}
                  key={child.key}
                  gap={8}
                  align={'center'}
                  className={classNames(styles.item, { [styles.active]: getIsSelect(child.key) })}
                  style={{ marginLeft: 2 }}
                >
                  <CornerDownRight className={styles['item-left-arrow']} size={13} />
                  <div>{child.title}</div>
                </Flex>
              ))}
            </div>
          ))
        }
      </div>
    </nav>
  )
}
