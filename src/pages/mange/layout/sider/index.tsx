import { useLocation, useNavigate } from 'react-router-dom'
import { Home } from '@icon-park/react'
import { Menu, MenuProps } from 'antd'

import styles from './index.module.less'

export default function Sider () {
  const nav = useNavigate()
  const location = useLocation()

  const shopId = location.pathname.split('/')[1]

  const menus: MenuProps['items'] = [
    { label: 'Home', key: '', icon: <Home style={{ position: 'relative', top: -1 }} size={15} /> },
    {
      label: 'Orders',
      key: '/orders',
      children: [
        { label: 'All orders', key: 'orders' },
        { label: 'Drafts', key: 'Drafts' },
        { label: 'Abandoned checkouts', key: 'Abandoned checkouts' }
      ],
      icon: <Home style={{ position: 'relative', top: -1 }} size={15} />
    },
    {
      label: 'Products',
      key: '/products',
      children: [
        { label: 'Products', key: 'products' },
        { label: 'Collections', key: 'collections' },
        { label: 'Inventory', key: 'inventory' },
        { label: 'Purchase orders', key: 'purchase_orders' },
        { label: 'Transfers', key: 'transfers' },
        { label: 'Gift cards', key: 'gift_cards' }
      ],
      icon: <Home style={{ position: 'relative', top: -1 }} size={15} />
    },
    {
      label: 'Customers',
      key: '/customers',
      children: [
        { label: 'Customers', key: 'customers' },
        { label: 'Segments', key: 'segments' }
      ],
      icon: <Home style={{ position: 'relative', top: -1 }} size={15} />
    },
    {
      label: 'Content',
      key: '/content',
      children: [
        { label: 'Metaobjects', key: 'metaobjects' },
        { label: 'Files', key: 'files' }
      ],
      icon: <Home style={{ position: 'relative', top: -1 }} size={15} />
    },
    {
      label: 'Analytics',
      key: '/analytics',
      children: [
        { label: 'Analytics', key: 'analytics' },
        { label: 'Reports', key: 'reports' },
        { label: 'Live View', key: 'live-view' }
      ],
      icon: <Home style={{ position: 'relative', top: -1 }} size={15} />
    },
    {
      label: 'Marketing',
      key: '/marketing',
      children: [
        { label: 'Marketing', key: 'marketing' },
        { label: 'Campaigns', key: 'campaigns' },
        { label: 'automations', key: 'automations' }
      ],
      icon: <Home style={{ position: 'relative', top: -1 }} size={15} />
    },
    {
      label: 'Discounts',
      key: '/discounts',
      icon: <Home style={{ position: 'relative', top: -1 }} size={15} />
    }
  ]

  const onClick: MenuProps['onClick'] = ({ keyPath }) => {
    const path = keyPath.reverse().join('/')
    if (location.pathname === path) return
    nav(path)
  }

  return (
    <nav className={styles.sider}>
      <Menu
        defaultOpenKeys={[`/${location.pathname?.split('/')[1]}`]}
        selectedKeys={[`${location.pathname?.split('/')[2]}`]}
        onClick={onClick}
        prefix={'asd'}
        mode={'inline'}
        items={menus}
      />
    </nav>
  )
}
