import { useTranslation } from 'react-i18next'
import { Button, Card, Checkbox, Form } from 'antd'

import Page from '@/components/page'
import STable, { STableProps } from '@/components/s-table'

export default function Taxes () {
  const { t } = useTranslation('product')

  const columns: STableProps['columns'] = [
    { title: t('国家 / 地区'), code: 'region', name: 'region' },
    { title: t('地区数量'), code: 'region', name: 'region' },
    { title: t('销售税率'), code: 'region', name: 'region' },
    { title: t('运输税率'), code: 'region', name: 'region' }
  ]
  return (
    <Page width={800} title={t('税务')}>
      <Card
        extra={
          <Button size={'small'} type={'link'}>{t('选择地区')}</Button>
        }
        title={t('区域设置')}
      >
        <div className={'tips'} style={{ marginBottom: 12 }}>
          {t('在您希望收税的区域创建一个运输区域。然后，在此列表中找到该区域并选择它以管理其税务设置。如果您不确定自己是否有责任，请咨询税务专业人士。')}
        </div>
        <STable
          init
          className={'table-border'}
          columns={columns}
          data={[]}
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
