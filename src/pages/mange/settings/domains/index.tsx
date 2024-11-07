import { useTranslation } from 'react-i18next'
import { IconLockOff, IconShieldLock } from '@tabler/icons-react'
import { useRequest } from 'ahooks'
import { Button, Empty, Flex } from 'antd'

import { DomainListApi, DomainListRes, DomainStatus } from '@/api/domain/list'
import Page from '@/components/page'
import SCard from '@/components/s-card'
import SRender from '@/components/s-render'
import STable, { STableProps } from '@/components/s-table'
import Status from '@/components/status'
import ConnectDomain from '@/pages/mange/settings/domains/connect-domain'

export default function Domains () {
  const { t } = useTranslation('settings', { keyPrefix: 'domains' })

  const list = useRequest(DomainListApi)

  const domainListColumns: STableProps['columns'] = [
    {
      title: t('域名'),
      name: 'domain',
      code: 'domain',
      render: (domain: string, row: DomainListRes) => (
        <Flex align={'center'} gap={12}>
          {domain}
          <SRender render={row.is_main}>
            <Status type={'info'}>{t('主域名')}</Status>
          </SRender>
        </Flex>
      ),
      width: 400
    },
    {
      title: t('状态'),
      name: 'status',
      code: 'status',
      render: (status: DomainStatus) => (
        <div style={{ display: 'inline-block' }}>
          <SRender render={status === DomainStatus.ConnectSuccess}>
            <Status borderless type={'success'}>{t('已连接')}</Status>
          </SRender>
          <SRender render={status === DomainStatus.ConnectFailed}>
            <Status borderless type={'error'}>{t('连接失败')}</Status>
          </SRender>
          <SRender render={status === DomainStatus.Disconnect}>
            <Status borderless type={'error'}>{t('连接已断开')}</Status>
          </SRender>
          <SRender render={status === DomainStatus.ConnectPre}>
            <Status borderless type={'default'}>{t('未连接')}</Status>
          </SRender>
        </div>
      )
    }
  ]

  const lockDomainsColumns: STableProps['columns'] = [
    { title: t('IP地址'), name: 'domain', code: 'domain' },
    { title: t('类型'), code: 'type', name: 'type' }
  ]

  const banCountriesColumns: STableProps['columns'] = [
    { title: t('国家/地区'), name: 'name', code: 'name' },
    { title: t('状态'), name: 'status', code: 'status' }
  ]

  return (
    <Page title={t('域名')} width={700} bottom={48}>
      <Flex vertical gap={16}>
        <SCard
          extra={
            <Button type={'link'} size={'small'}>{t('连接已有域名')}</Button>
          }
          title={t('域名列表')}
        >
          <STable
            borderless
            init={!list.loading}
            className={'table-border'}
            columns={domainListColumns}
            data={list.data || []}
          />
        </SCard>
        <SCard
          title={t('黑白名单')}
          tips={t('添加黑名单后，可屏蔽用户访问，添加白名单后，允许用户访问。')}
        >
          <STable
            className={'table-border'}
            borderless
            columns={lockDomainsColumns}
            data={[]}
          />
          <Empty
            image={
              <div style={{ paddingTop: 32 }}>
                <IconShieldLock size={64} color={'#ddd'} />
              </div>
            }
            description={(
              <div className={'secondary'}>
                {t('添加黑名单后，可屏蔽用户访问，添加白名单后，允许用户访问。')}
              </div>
            )}
            style={{ paddingBottom: 24, marginTop: -32 }}
          >
            <Button>
              {t('添加黑/白名单')}
            </Button>
          </Empty>
        </SCard>

        <SCard
          title={t('屏蔽区域')}
          tips={t('启用后，您可以阻止来自特定国家/地区的访客。')}
        >
          <STable
            className={'table-border'}
            borderless
            columns={banCountriesColumns}
            data={[]}
          />
          <Empty
            image={
              <div style={{ paddingTop: 32 }}>
                <IconLockOff size={64} color={'#ddd'} />
              </div>
            }
            description={(
              <div className={'secondary'}>
                {t('启用后，您可以阻止来自特定国家/地区的访客。')}
              </div>
            )}
            style={{ paddingBottom: 24, marginTop: -32 }}
          >
            <Button>
              {t('选择国家/地区')}
            </Button>
          </Empty>
        </SCard>
      </Flex>

      <ConnectDomain />
    </Page>
  )
}
