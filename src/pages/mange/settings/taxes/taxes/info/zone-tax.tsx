import { useTranslation } from 'react-i18next'
import { Button, Form, Input } from 'antd'

import { ZoneListOut } from '@/api/base/countries'
import SInputNumber from '@/components/s-input-number'
import SRender from '@/components/s-render'
import SSelect from '@/components/s-select'
import STable, { STableProps } from '@/components/s-table'
import { genId } from '@/utils/random'

export interface ZoneTaxProps {
  zones: ZoneListOut[]
}

export default function ZoneTax (props: ZoneTaxProps) {
  const { zones } = props

  const options = zones.map(zone => ({
    label: zone.name,
    value: zone.code
  }))

  const { t } = useTranslation('settings', { keyPrefix: 'tax' })

  const columns: STableProps['columns'] = [
    {
      title: t('区域'),
      name: 'name',
      code: 'name',
      render: (name: number, row: ZoneListOut) => (
        <Form.Item className={'mb0'} name={[name, 'zone']}>
          <SSelect placeholder={t('选择区域')} allowClear options={options} />
        </Form.Item>
      )
    },
    {
      title: t('税名'),
      name: 'name',
      code: 'name',
      render: (name: number, row: ZoneListOut) => (
        <Form.Item className={'mb0'} name={[name, 'name']}>
          <Input autoComplete={'off'} />
        </Form.Item>
      )
    },
    {
      title: t('税率'),
      name: 'name',
      code: 'name',
      render: (name: number, row: ZoneListOut) => (
        <Form.Item className={'mb0'} name={[name, 'tax_rate']}>
          <SInputNumber required min={0} suffix={'%'} precision={4} />
        </Form.Item>
      )
    }
  ]

  if (!zones?.length) return null

  return (
    <div>
      <div className={'line'} />
      <div>{t('区域税率')}</div>
      <div style={{ marginTop: 2 }} className={'tips'}>
        {t('如果添加了州税率，将替代地方税率。')}
      </div>

      <Form.List name={'zones'}>
        {
          (fields, { add }) => (
            <div>
              <SRender render={fields?.length}>
                <STable
                  borderless
                  className={'table-border'}
                  data={fields}
                  style={{ marginTop: 8 }}
                  columns={columns}
                  init
                />
              </SRender>
              <Button
                onClick={() => { add({ id: genId(), name: 'tax', tax_rate: 0 }) }}
                type={'link'}
                size={'small'}
                style={{ marginLeft: -8, marginTop: 8 }}
              >
                {t('添加区域')}
              </Button>
            </div>
          )
        }
      </Form.List>
    </div>
  )
}
