import { useTranslation } from 'react-i18next'
import { Button, Form, FormListFieldData, Input } from 'antd'

import { ZoneListOut } from '@/api/base/countries'
import SInputNumber from '@/components/s-input-number'
import SSelect from '@/components/s-select'
import STable, { STableProps } from '@/components/s-table'
import { genId } from '@/utils/random'

export interface CustomerItemProps {
  fields: FormListFieldData[]
  add: (value: any) => void
}

export default function CustomerItem (props: CustomerItemProps) {
  const { fields, add } = props
  const { t } = useTranslation('settings', { keyPrefix: 'tax' })

  const columns: STableProps['columns'] = [
    {
      title: t('区域'),
      name: 'name',
      code: 'name',
      render: (name: number) => {
        return (
          <Form.Item
            rules={[{ required: true, message: t('请选择区域') }]}
            className={'mb0'}
            name={[name, 'area_code']}
          >
            <SSelect
              showSearch
              optionFilterProp={'label'}
              placeholder={t('选择区域')}
              allowClear
              optionLabelProp={'label'}
            />
          </Form.Item>
        )
      }
    },
    {
      title: t('税名'),
      name: 'name',
      code: 'name',
      render: (name: number, row: ZoneListOut) => (
        <Form.Item
          rules={[{ required: true, message: t('请输入税名') }]}
          className={'mb0'}
          name={[name, 'name']}
        >
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

  return (
    <div style={{ border: '1px solid #000' }}>
      {123}
      <STable
        init
        data={fields}
        columns={columns}
      />
      <Button
        onClick={() => {
          add({
            id: genId(),
            name: 'VAT',
            tax_rate: 0
          })
        }}
        type={'link'}
        size={'small'}
        style={{
          marginLeft: -8,
          marginTop: 8
        }}
      >
        {t('添加区域')}
      </Button>
    </div>
  )
}
