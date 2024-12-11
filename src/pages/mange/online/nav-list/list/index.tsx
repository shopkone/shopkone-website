import { useTranslation } from 'react-i18next'
import { IconTrash } from '@tabler/icons-react'
import { useRequest } from 'ahooks'
import { Button, Flex, Typography } from 'antd'

import { NavListApi } from '@/api/online/navList'
import IconButton from '@/components/icon-button'
import Page from '@/components/page'
import SCard from '@/components/s-card'
import STable, { STableProps } from '@/components/s-table'
import { useNav } from '@/hooks/use-nav'

export default function NavList () {
  const { t } = useTranslation('online', { keyPrefix: 'nav' })
  const list = useRequest(NavListApi)
  const nav = useNav()

  const columns: STableProps['columns'] = [
    {
      title: t('菜单'),
      code: 'title',
      name: 'title',
      width: 250
    },
    {
      title: t('一级导航'),
      code: 'first_names',
      name: 'first_names',
      render: (first_names: string[]) => (
        <Typography.Text>{first_names.join('、')}</Typography.Text>
      )
    },
    {
      title: '',
      code: 'id',
      name: 'id',
      render: () => (
        <IconButton size={24} type={'text'} danger>
          <IconTrash size={15} />
        </IconButton>
      ),
      width: 50
    }
  ]

  return (
    <Page
      title={t('菜单导航')}
      header={(
        <Flex onClick={() => { nav('add') }}>
          <Button type={'primary'}>{t('添加导航')}</Button>
        </Flex>
      )}
    >
      <SCard styles={{ body: { padding: '8px 0' } }}>
        <STable
          onRowClick={(row) => { nav(`change/${row.id}`) }}
          loading={list.loading}
          data={list.data || []}
          columns={columns}
        />
      </SCard>
    </Page>
  )
}
