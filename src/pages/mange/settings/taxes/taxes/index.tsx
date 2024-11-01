import { Trans, useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { IconPencil, IconTrash } from '@tabler/icons-react'
import { useRequest } from 'ahooks'
import { Card, Checkbox, Flex, Form, Switch } from 'antd'

import { useCountries } from '@/api/base/countries'
import { TaxListApi, TaxListRes, TaxStatus } from '@/api/tax/list'
import IconButton from '@/components/icon-button'
import Page from '@/components/page'
import STable, { STableProps } from '@/components/s-table'

import styles from './index.module.less'

export default function Taxes () {
  const { t } = useTranslation('settings', { keyPrefix: 'tax' })
  const nav = useNavigate()
  const list = useRequest(TaxListApi)
  const countries = useCountries()

  const toDelivery = () => {
    nav('/settings/shipping')
  }

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
      width: 100,
      align: 'center',
      render: (id: number) => (
        <Flex style={{ justifyContent: 'center' }} onMouseUp={e => { e.stopPropagation() }} className={styles.default} align={'center'} gap={16}>
          <IconButton onClick={() => { nav(`info/${id}`) }} type={'text'} size={24}>
            <IconPencil size={15} />
          </IconButton>
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
      <Card title={t('收税地区')}>
        <div className={'tips'} style={{ marginBottom: 12 }}>
          <Trans
            i18nKey={t('收税地区提示')}
            components={{
              a1: <a onClick={toDelivery} />,
              a2: <a href={'https://example.com'} target={'_blank'} rel={'noreferrer'} />
            }}
          />
        </div>
        <STable
          onRowClick={(record) => { nav(`info/${record.id}`) }}
          init
          className={'table-border'}
          columns={columns}
          data={list?.data || []}
          borderless
        />
      </Card>

      <Card style={{ marginTop: 16 }} title={t('全球设置')}>
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
      </Card>
    </Page>
  )
}
