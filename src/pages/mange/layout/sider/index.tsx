import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation('common', { keyPrefix: 'side' })

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
        { label: t('所有订单'), key: 'orders' },
        { label: t('草稿单'), key: 'drafts' },
        { label: t('弃单'), key: 'abandoned checkouts' }
      ],
      icon: <IconArchive size={16} />
    },
    {
      label: t('商品'),
      key: '/products',
      children: [
        { label: t('商品1'), key: 'products' },
        { label: t('系列'), key: 'collections' },
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
        { label: t('客户1'), key: 'customers' },
        { label: t('客户分组'), key: 'segments' }
      ],
      icon: <IconUser size={16} />
    },
    {
      label: t('分析'),
      key: '/analytics',
      children: [
        { label: t('分析1'), key: 'analytics' },
        { label: t('报告'), key: 'reports' },
        { label: t('实时分析'), key: 'live-view' }
      ],
      icon: <IconBrandGoogleAnalytics size={16} />
    },
    {
      label: t('营销'),
      key: '/marketing',
      children: [
        { label: t('营销1'), key: 'marketing' },
        { label: t('宣传活动'), key: 'campaigns' },
        { label: t('自动化'), key: 'automations' }
      ],
      icon: <IconTargetArrow size={16} />
    },
    {
      label: t('在线商店'),
      key: 'online',
      icon: <IconNotebook size={16} />,
      children: [
        { label: t('店铺设计'), key: 'design' },
        { label: t('博客'), key: 'blog_comments' },
        { label: t('自定义页面'), key: 'blog_tags' },
        { label: t('菜单导航'), key: 'nav_list' },
        { label: t('偏好设置'), key: 'blog_categories' }
      ]
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
        { label: '交易设置', key: 'transactions' },
        { label: '结账页设置', key: 'checkout_page' },
        { label: t('服务条款'), key: 'terms' },
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
        mode={'inline'}
        items={menus}
      />
    </nav>
  )
}
