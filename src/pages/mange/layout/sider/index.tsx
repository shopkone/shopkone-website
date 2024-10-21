import { useLocation, useNavigate } from 'react-router-dom'
import {
  IconArchive,
  IconBrandGoogleAnalytics,
  IconHome,
  IconNotebook,
  IconSettings,
  IconTag,
  IconTargetArrow,
  IconUser
} from '@tabler/icons-react'
import { Menu, MenuProps } from 'antd'

import styles from './index.module.less'

export default function Sider () {
  const nav = useNavigate()
  const location = useLocation()
  const openKey = `/${location.pathname?.split('/')[1]}`
  const activeKey = `${location.pathname?.split('/')[2] || ''}`

  const menus: MenuProps['items'] = [
    {
      label: 'Home',
      key: '',
      icon: <IconHome size={16} />
    },
    {
      label: 'Orders',
      key: '/orders',
      children: [
        { label: 'All orders', key: 'orders' },
        { label: 'Drafts', key: 'Drafts' },
        { label: 'Abandoned checkouts', key: 'Abandoned checkouts' }
      ],
      icon: <IconArchive size={16} />
    },
    {
      label: 'Products',
      key: '/products',
      children: [
        { label: 'Products', key: 'products' },
        { label: 'Collections', key: 'collections' },
        { label: 'Inventory', key: 'inventory' },
        { label: 'Purchase orders', key: 'purchase_orders' },
        { label: '库存转移', key: 'transfers' },
        { label: 'Gift cards', key: 'gift_cards' }
      ],
      icon: <IconTag size={16} />
    },
    {
      label: 'Customers',
      key: '/customers',
      children: [
        { label: 'Customers', key: 'customers' },
        { label: 'Segments', key: 'segments' }
      ],
      icon: <IconUser size={16} />
    },
    {
      label: 'Analytics',
      key: '/analytics',
      children: [
        { label: 'Analytics', key: 'analytics' },
        { label: 'Reports', key: 'reports' },
        { label: 'Live View', key: 'live-view' }
      ],
      icon: <IconBrandGoogleAnalytics size={16} />
    },
    {
      label: 'Marketing',
      key: '/marketing',
      children: [
        { label: 'Marketing', key: 'marketing' },
        { label: 'Campaigns', key: 'campaigns' },
        { label: 'automations', key: 'automations' }
      ],
      icon: <IconTargetArrow size={16} />
    },
    {
      label: 'Blog Posts',
      key: '/blog_posts',
      icon: <IconNotebook size={16} />
    },
    {
      label: 'Settings',
      key: '/settings',
      icon: <IconSettings size={16} />,
      children: [
        { label: 'General', key: 'general' },
        { label: 'Staff', key: 'staff' },
        { label: 'Plan & Billing', key: 'plan_billing' },
        { label: 'Payments', key: 'payments' },
        { label: 'Domains', key: 'domains' },
        { label: 'Languages', key: 'languages' },
        { label: 'Markets', key: 'markets' },
        { label: 'Taxes', key: 'taxes' },
        { label: 'Locations', key: 'locations' },
        { label: 'Shipping', key: 'shipping' },
        { label: 'Notifications', key: 'notifications' },
        { label: 'Order settings', key: 'order_settings' },
        { label: 'Checkout page', key: 'checkout_page' },
        { label: 'Legal', key: 'legal' },
        { label: 'Metafields', key: 'metafields' },
        { label: 'Files', key: 'files' },
        { label: 'Activity log', key: 'activity_log' }
      ]
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
        defaultOpenKeys={[openKey]}
        selectedKeys={[activeKey]}
        onClick={onClick}
        prefix={'asd'}
        mode={'inline'}
        items={menus}
      />
    </nav>
  )
}
