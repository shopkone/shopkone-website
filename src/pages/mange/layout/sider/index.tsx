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

import { useI18n } from '@/hooks/use-lang'

import styles from './index.module.less'

export default function Sider () {
  const nav = useNavigate()
  const location = useLocation()
  const openKey = `/${location.pathname?.split('/')[1]}`
  const activeKey = `${location.pathname?.split('/')[2] || ''}`
  const t = useI18n()

  const menus: MenuProps['items'] = [
    {
      label: t('首页'),
      key: '',
      icon: <IconHome size={16} />
    },
    {
      label: t('订单'),
      key: '/orders',
      children: [
        { label: 'All orders', key: 'orders' },
        { label: 'Drafts', key: 'Drafts' },
        { label: 'Abandoned checkouts', key: 'Abandoned checkouts' }
      ],
      icon: <IconArchive size={16} />
    },
    {
      label: t('商品'),
      key: '/products',
      children: [
        { label: t('商品'), key: 'products' },
        { label: t('专辑'), key: 'collections' },
        { label: t('库存'), key: 'inventory' },
        { label: t('采购单'), key: 'purchase_orders' },
        { label: t('库存转移'), key: 'transfers' },
        { label: t('礼品卡'), key: 'gift_cards' }
      ],
      icon: <IconTag size={16} />
    },
    {
      label: t('客户'),
      key: '/customers',
      children: [
        { label: t('客户'), key: 'customers' },
        { label: t('客户分组'), key: 'segments' }
      ],
      icon: <IconUser size={16} />
    },
    {
      label: t('分析'),
      key: '/analytics',
      children: [
        { label: t('分析'), key: 'analytics' },
        { label: t('报告'), key: 'reports' },
        { label: t('实时分析'), key: 'live-view' }
      ],
      icon: <IconBrandGoogleAnalytics size={16} />
    },
    {
      label: t('营销'),
      key: '/marketing',
      children: [
        { label: t('营销'), key: 'marketing' },
        { label: t('宣传活动'), key: 'campaigns' },
        { label: t('自动化'), key: 'automations' }
      ],
      icon: <IconTargetArrow size={16} />
    },
    {
      label: t('博客'),
      key: '/blog_posts',
      icon: <IconNotebook size={16} />
    },
    {
      label: t('设置'),
      key: '/settings',
      icon: <IconSettings size={16} />,
      children: [
        { label: t('基础信息'), key: 'general' },
        { label: t('员工'), key: 'staff' },
        { label: t('套餐与支付'), key: 'plan_billing' },
        { label: '收款', key: 'payments' },
        { label: '域名', key: 'domains' },
        { label: '语言', key: 'languages' },
        { label: '市场', key: 'markets' },
        { label: '税费', key: 'taxes' },
        { label: '地点', key: 'locations' },
        { label: '物流', key: 'shipping' },
        { label: '通知', key: 'notifications' },
        { label: '订单设置', key: 'order_settings' },
        { label: '结账页设置', key: 'checkout_page' },
        { label: 'Legal', key: 'legal' },
        { label: '元字段', key: 'metafields' },
        { label: '素材中心', key: 'files' },
        { label: '操作日志', key: 'activity_log' }
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
