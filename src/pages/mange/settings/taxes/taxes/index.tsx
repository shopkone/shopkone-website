import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { IconTax, IconTrash } from '@tabler/icons-react'
import { useRequest } from 'ahooks'
import { Button, Checkbox, Empty, Flex, Form, Switch } from 'antd'
import SCard from '@/components/s-card'

import { useCountries } from '@/api/base/countries'
import { TaxListApi, TaxListRes, TaxStatus } from '@/api/tax/list'
import IconButton from '@/components/icon-button'
import Page from '@/components/page'
import SRender from '@/components/s-render'
import STable, { STableProps } from '@/components/s-table'
import SelectCountry from '@/components/select-country'

import styles from './index.module.less'

export default function Taxes () {
  const { t } = useTranslation('settings', { keyPrefix: 'tax' })
  const nav = useNavigate()
  const list = useRequest(TaxListApi)
  const countries = useCountries()

  const columns: STableProps['columns'] = [
    {
      title: t('征收'),
      code: 'status',
      name: 'status',
      render: (status: TaxStatus) => (
        <div onMouseUp={e => { e.stopPropagation() }} className={styles.default}>
          <Switch checked={status === TaxStatus.Active} />
        </div>
      ),
      width: 80,
      lock: true
    },
    {
      title: t('国家/地区'),
      code: 'country_code',
      name: 'country_code',
      render: (code: string, row: TaxListRes) => {
        return (
          countries?.data?.find((c) => c.code === code)?.name || '--'
        )
      }
    },
    {
      title: '',
      code: 'id',
      name: 'id',
      width: 60,
      align: 'center',
      render: (id: number) => (
        <Flex style={{ justifyContent: 'center' }} onMouseUp={e => { e.stopPropagation() }} className={styles.default} align={'center'} gap={16}>
          <IconButton type={'text'} size={24}>
            <IconTrash size={15} />
          </IconButton>
        </Flex>
      )
    }
  ]
  return (
    <Page
      loading={list.loading || countries.loading}
      width={700}
      title={t('税费设置')}
    >
      <SCard
        extra={
          <SRender render={list?.data?.length}>
            <Button type={'link'} size={'small'}>
              {t('添加收税地区')}
            </Button>
          </SRender>
        }
        title={t('收税地区')}
      >
        <SRender render={list?.data?.length} className={'tips'} style={{ marginBottom: 12 }}>
          {t('收税地区提示')}
        </SRender>
        <SRender render={list?.data?.length}>
          <STable
            onRowClick={(record) => { nav(`info/${record.id}`) }}
            init
            className={'table-border'}
            columns={columns}
            data={list?.data || []}
            borderless
          />
        </SRender>
        <SRender render={!list?.data?.length && !list.loading}>
          <Empty
            image={
              <div style={{ paddingTop: 20 }}>
                <IconTax size={64} color={'#ddd'} />
              </div>
            }
            description={(
              <div className={'secondary'}>
                {t('收税地区提示')}
              </div>
            )}
            style={{ paddingBottom: 24 }}
          >
            <Button type={'primary'}>{t('添加收税地区')}</Button>
          </Empty>
        </SRender>
      </SCard>

      <SCard  style={{ marginTop: 16 }} title={t('全球设置')}>
        <Form.Item
          extra={
            <div className={'tips'} style={{ marginTop: -8, marginLeft: 24 }}>
              {t('自动计算适用于加拿大、欧盟和美国')}
            </div>
          }
        >
          <Checkbox>
            {t('对运输收取销售税')}
          </Checkbox>
        </Form.Item>
      </SCard>

      <SelectCountry onlyCountry height={400} />
    </Page>
  )
}
