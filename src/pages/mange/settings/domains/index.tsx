import { useTranslation } from 'react-i18next'
import { IconLockOff, IconShieldLock, IconTrash } from '@tabler/icons-react'
import { useRequest } from 'ahooks'
import { Button, Empty, Flex } from 'antd'

import { BlackIpListRes, DomainBlackIpListApi } from '@/api/domain/black-ip-list'
import { BlackIpType } from '@/api/domain/black-ip-update'
import { DomainBlockCountryListApi } from '@/api/domain/block-country-list'
import { DomainListApi, DomainListRes, DomainStatus } from '@/api/domain/list'
import IconButton from '@/components/icon-button'
import Page from '@/components/page'
import SCard from '@/components/s-card'
import { sMessage } from '@/components/s-message'
import { useModal } from '@/components/s-modal'
import SRender from '@/components/s-render'
import STable, { STableProps } from '@/components/s-table'
import Status from '@/components/status'
import { useOpen } from '@/hooks/useOpen'
import BlackIpModal from '@/pages/mange/settings/domains/black-ip-modal'
import { DomainBlackIpRemoveApi } from '@/pages/mange/settings/domains/black-ip-remove'
import BlockCountryModal from '@/pages/mange/settings/domains/block-country-modal'
import ConnectDomain from '@/pages/mange/settings/domains/connect-domain'

export default function Domains () {
  const { t } = useTranslation('settings', { keyPrefix: 'domains' })

  const list = useRequest(DomainListApi)
  const blocks = useRequest(DomainBlockCountryListApi)
  const blackIps = useRequest(DomainBlackIpListApi)
  const blackIpRemove = useRequest(DomainBlackIpRemoveApi, { manual: true })
  const openInfo = useOpen<string>()
  const openInfoBlock = useOpen<string[]>()
  const openInfoBlackIp = useOpen<{ type: BlackIpType, ips: string[] }>()
  const modal = useModal()

  const onRemoveIp = (ip: string, type: BlackIpType) => {
    modal.confirm({
      title: t('确认移除 IP'),
      content: t('确认移除该 IP？', { x: ip, y: type === BlackIpType.Black ? t('黑名单') : t('白名单') }),
      onOk: async () => {
        await blackIpRemove.runAsync({ ips: [ip], type })
        sMessage.success(t('ip 成功移出', { x: type === BlackIpType.Black ? t('黑名单') : t('白名单'), ip }))
        blackIps.refresh()
      },
      okText: t('移出'),
      okButtonProps: { danger: true }
    })
  }

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
    { title: t('IP地址'), name: 'ip', code: 'ip', width: 400 },
    {
      title: t('类型'),
      code: 'type',
      name: 'type',
      render: (type: BlackIpType) => {
        if (type === BlackIpType.Black) {
          return <Status borderless>{t('黑名单')}</Status>
        } else {
          return <Status borderless type={'success'}>{t('白名单')}</Status>
        }
      }
    },
    {
      title: '',
      code: 'ip',
      name: 'ip',
      render: (ip: string, row: BlackIpListRes) => (
        <IconButton
          loading={blackIpRemove.loading}
          onClick={() => { onRemoveIp(ip, row.type) }}
          type={'text'} size={24}
        >
          <IconTrash size={15} />
        </IconButton>
      ),
      width: 55
    }
  ]

  const banCountriesColumns: STableProps['columns'] = [
    { title: t('国家/地区'), name: 'name', code: 'name', width: 400 },
    {
      title: t('状态'),
      name: 'status',
      code: 'status',
      render: () => (
        <div style={{ display: 'inline-block' }}>
          <Status borderless>{t('已屏蔽')}</Status>
        </div>
      )
    }
  ]

  return (
    <Page title={t('域名')} width={700} bottom={120}>
      <Flex vertical gap={16}>
        <SCard
          extra={
            <Button onClick={() => { openInfo.edit() }} type={'link'} size={'small'}>{t('连接已有域名')}</Button>
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
          loading={blackIps.loading}
          title={t('黑白名单')}
          tips={
            <SRender render={!!blackIps.data?.length}>
              {t('添加黑名单后，可屏蔽用户访问，添加白名单后，允许用户访问。')}
            </SRender>
          }
          extra={
            <SRender render={!!blackIps.data?.length}>
              <Button
                type={'link'}
                size={'small'}
                onClick={() => { openInfoBlackIp.edit() }}
              >
                {t('添加黑/白名单')}
              </Button>
            </SRender>
          }
        >
          <SRender render={!!blackIps.data?.length}>
            <STable
              rowKey={'ip'}
              className={'table-border'}
              borderless
              columns={lockDomainsColumns}
              data={blackIps?.data || []}
            />
          </SRender>
          <SRender render={!blackIps.data?.length}>
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
              <Button onClick={() => { openInfoBlackIp.edit() }}>
                {t('添加黑/白名单')}
              </Button>
            </Empty>
          </SRender>
        </SCard>

        <SCard
          loading={blocks.loading}
          title={t('屏蔽区域')}
          tips={
            <SRender render={blocks.data?.length}>
              {t('启用后，您可以阻止来自特定国家/地区的访客。')}
            </SRender>
          }
          extra={
           !!blocks.data?.length && (
           <Button
             type={'link'}
             size={'small'}
             onClick={() => { openInfoBlock.edit(blocks?.data?.map(i => i.code) || []) }}
           >
             {t('选择国家/地区')}
           </Button>
           )
          }
        >
          <SRender render={!!blocks.data?.length}>
            <STable
              rowKey={'code'}
              className={'table-border'}
              borderless
              columns={banCountriesColumns}
              data={blocks?.data || []}
            />
          </SRender>

          <SRender render={!blocks.data?.length}>
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
              <Button onClick={() => { openInfoBlock.edit([]) }}>
                {t('选择国家/地区')}
              </Button>
            </Empty>
          </SRender>
        </SCard>
      </Flex>

      <ConnectDomain onFresh={() => { openInfo.close(); list.refresh() }} openInfo={openInfo} />

      <BlockCountryModal openInfo={openInfoBlock} onFresh={blocks.refresh} />

      <BlackIpModal openInfo={openInfoBlackIp} onFresh={blackIps.refresh} />
    </Page>
  )
}
