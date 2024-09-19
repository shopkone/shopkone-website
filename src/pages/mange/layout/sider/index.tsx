import { useEffect, useState } from 'react'
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
  const [expand, setExpand] = useState<string[]>([])

  const menus = [
    {
      title: 'Home',
      key: '',
      icon: <Home style={{ position: 'relative', top: 2 }} size={14} />
    },
    {
      title: 'Products',
      key: 'products',
      icon: <Home style={{ position: 'relative', top: 2 }} size={14} />,
      children: [
        { title: 'Products', key: '/products/list' },
        { title: 'Collections', key: '/products/collections' },
        { title: 'Inventory', key: '/products/inventory' },
        { title: 'Purchase Order', key: '/products/purchase_order' },
        { title: 'Transfers', key: '/products/transfers' },
        { title: 'Gift cards', key: '/products/gift_cards' }
      ]
    }
  ]

  const getIsSelect = useMemoizedFn((key: string) => {
    const parent = location.pathname.split('/')?.[1]
    console.log(key, parent)
    return parent === key
  })

  const clickHandle = (key: string, isParent?: boolean) => {
    if (isParent) {
      setExpand(expand.includes(key) ? expand.filter(i => i !== key) : [...expand, key])
      return
    }
    if (getIsSelect(key)) return
    nav(key)
  }

  useEffect(() => {
    const parent = location.pathname.split('/')?.[2]
    if (expand.length) return
    setExpand([parent])
  }, [location.pathname])

  return (
    <nav className={styles.sider}>
      <div className={'group'}>
        {
          menus.map(item => (
            <div
              style={{ borderRadius: 12 }}
              onClick={(e) => { e.stopPropagation(); clickHandle(item.key, !!item.children) }}
              className={classNames({ [styles.part]: getIsSelect(item.key) })}
              key={item.key}
            >
              <Flex justify={'space-between'} align={'center'} className={classNames(styles.item, { [styles.active]: getIsSelect(item.key) && !item?.children })}>
                <Flex gap={8} align={'center'}>
                  {item.icon}
                  <div>{item.title}</div>
                </Flex>
                <SRender className={styles.arrow} render={!!item?.children} style={{ transform: expand.includes(item.key) ? 'rotate(-180deg)' : '' }}>
                  <Down size={15} style={{ position: 'relative', top: 2 }} />
                </SRender>
              </Flex>
              <SRender render={expand.includes(item.key)}>
                {item?.children?.map(child => (
                  <Flex
                    onClick={(e) => { e.stopPropagation(); clickHandle(child.key) }}
                    key={child.key}
                    gap={8}
                    align={'center'}
                    className={classNames(styles.item, { [styles.active]: getIsSelect(child.key) })}
                    style={{ marginLeft: 2 }}
                  >
                    <CornerDownRight
                      className={styles['item-left-arrow']}
                      size={13}
                    />
                    <div>{child.title}</div>
                  </Flex>
                ))}
              </SRender>
            </div>
          ))
        }
      </div>
    </nav>
  )
}
